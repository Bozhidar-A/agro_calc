import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { ChemProtWorkingInputPlantChem, ChemProtWorkingToSave, SowingRateHistory } from "@/lib/interfaces";
import { CalculateChemProtRoughSprayerCount, CalculateChemProtTotalChemicalLiters, CalculateChemProtTotalWorkingSolutionLiters, CalculateChemProtWorkingSolutionPerSprayerML, AcresToHectares, HectaresToAcres } from "@/lib/math-util";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { APICaller } from "@/lib/api-util";
import { toast } from "sonner";
import { SELECTABLE_STRINGS } from "@/lib/LangMap";
import { useTranslate } from "@/hooks/useTranslate";
import { Log } from "@/lib/logger";
import { UNIT_OF_MEASUREMENT_LENGTH } from "@/lib/utils";
import { useWarnings } from "@/hooks/useWarnings";

const formSchema = z.object({
    selectedPlantId: z.string().optional(),
    selectedChemicalId: z.string().optional(),
    chemicalPerAcreML: z.number().min(0.01),
    workingSolutionPerAcreLiters: z.number().min(0.01),
    sprayerVolumePerAcreLiters: z.number().min(0.01),
    areaToBeSprayedAcres: z.number().min(0.01),
});

export default function useChemProtWorkingForm() {
    const translator = useTranslate();
    const authObject = useSelector((state: RootState) => state.auth);
    const unitOfMeasurement = useSelector((state: RootState) => state.local.unitOfMeasurementLength);
    const [loading, setLoading] = useState(true);
    const [plantsChems, setPlantsChems] = useState<ChemProtWorkingInputPlantChem[]>([]);
    const [lastUsedPlantId, setLastUsedPlantId] = useState<string | null>(null);
    const [dataToBeSaved, setDataToBeSaved] = useState<ChemProtWorkingToSave>({
        userId: authObject?.user?.id ?? '',
        plantId: "",
        chemicalId: "",
        totalChemicalForAreaLiters: 0,
        totalWorkingSolutionForAreaLiters: 0,
        roughSprayerCount: 0,
        chemicalPerSprayerML: 0,
        isDataValid: false,
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            selectedPlantId: "",
            selectedChemicalId: "",
            chemicalPerAcreML: 0,
            workingSolutionPerAcreLiters: 0,
            sprayerVolumePerAcreLiters: 0,
            areaToBeSprayedAcres: 0,
        },
        mode: 'onChange',
        reValidateMode: 'onBlur'
    });

    //react-hook-form doesnt support warnings, so i have to hack my way around it
    const { warnings, AddWarning, RemoveWarning, CountWarnings } = useWarnings();

    // Fetch chemicals on mount
    useEffect(() => {
        const fetchChemicals = async () => {
            try {
                const res = await APICaller(
                    ['calc', 'chem-protection', 'working-solution', 'chemicals', "BACKGROUND"],
                    '/api/calc/chem-protection/working-solution/input',
                    'GET'
                );

                if (!res.success) {
                    Log(['calc', 'chem-protection', 'working-solution', 'chemicals', "BACKGROUND"], `Error fetching chemicals: ${res.message}`);
                    return;
                }

                setPlantsChems(res.data);
                setLoading(false);
            } catch (error) {
                Log(['calc', 'chem-protection', 'working-solution', 'chemicals', "BACKGROUND"], `Error fetching chemicals: ${error}`);
                setLoading(false);
            }
        };

        fetchChemicals();
    }, []);

    // Fetch sowing history in the background
    useEffect(() => {
        const fetchSowingHistory = async () => {
            try {
                const res = await APICaller(
                    ['calc', 'sowing', 'history', 'BACKGROUND'],
                    '/api/calc/sowing/history',
                    'GET'
                );

                if (!res.success) {
                    Log(['calc', 'sowing', 'history', 'BACKGROUND'], `Error fetching sowing history: ${res.message}`);
                    return;
                }

                const history = res.data as SowingRateHistory[];
                if (history.length > 0) {
                    // Sort by date descending and get the most recent entry
                    const sortedHistory = history.sort((a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                    // Get the plant ID from the most recent entry
                    setLastUsedPlantId(sortedHistory[0].plant.id);
                }
            } catch (error) {
                Log(['calc', 'sowing', 'history', 'BACKGROUND'], `Error fetching sowing history: ${error}`);
            }
        };

        if (authObject?.user?.id) {
            fetchSowingHistory();
        }
    }, [authObject?.user?.id]);

    //watch for plant selection changes
    useEffect(() => {
        const selectedPlantId = form.watch('selectedPlantId');
        if (selectedPlantId) {
            const selectedPlant = plantsChems.find((c) => c.plant.id === selectedPlantId);
            if (selectedPlant) {
                // Reset chemical selection and related values
                form.setValue('selectedChemicalId', "", {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true
                });
                form.setValue('chemicalPerAcreML', 0, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true
                });
            }
        }
    }, [form.watch('selectedPlantId'), form, plantsChems]);

    // Watch for chemical selection changes using a subscription
    useEffect(() => {
        const subscription = form.watch((values, { name }) => {
            if (name === 'selectedChemicalId') {
                const selectedChemicalId = values.selectedChemicalId;
                if (selectedChemicalId) {
                    const selectedChemical = plantsChems.find((c) => c.chemical.id === selectedChemicalId);
                    if (selectedChemical) {
                        const convertedDosage = unitOfMeasurement === UNIT_OF_MEASUREMENT_LENGTH.ACRES
                            ? selectedChemical.chemical.dosage
                            : AcresToHectares(selectedChemical.chemical.dosage);
                        // Only set if different to avoid infinite loop
                        if (form.getValues('chemicalPerAcreML') !== convertedDosage) {
                            form.setValue('chemicalPerAcreML', convertedDosage, {
                                shouldValidate: true,
                                shouldDirty: true,
                                shouldTouch: true
                            });
                            RemoveWarning('chemicalPerAcreML');
                        }
                    }
                }
            }
        });
        return () => subscription.unsubscribe();
    }, [form, plantsChems, unitOfMeasurement]);

    // Trigger validation on mount
    useEffect(() => {
        form.trigger().then(() => {
            // Trigger initial data calculation
            const { chemicalPerAcreML, workingSolutionPerAcreLiters, sprayerVolumePerAcreLiters, areaToBeSprayedAcres } = form.getValues();
            let isMathWorking = true;

            const totalChemicalLiters = CalculateChemProtTotalChemicalLiters(chemicalPerAcreML, areaToBeSprayedAcres);
            const totalWorkingSolutionLiters = CalculateChemProtTotalWorkingSolutionLiters(workingSolutionPerAcreLiters, areaToBeSprayedAcres);
            const roughSprayerCount = CalculateChemProtRoughSprayerCount(totalWorkingSolutionLiters, areaToBeSprayedAcres, sprayerVolumePerAcreLiters);
            const workingSolutionPerSprayerLiters = CalculateChemProtWorkingSolutionPerSprayerML(chemicalPerAcreML, workingSolutionPerAcreLiters, areaToBeSprayedAcres, sprayerVolumePerAcreLiters);

            if (isNaN(totalChemicalLiters) || totalChemicalLiters < 0 || !isFinite(totalChemicalLiters)) {
                isMathWorking = false;
            }

            if (isNaN(totalWorkingSolutionLiters) || totalWorkingSolutionLiters < 0 || !isFinite(totalWorkingSolutionLiters)) {
                isMathWorking = false;
            }

            if (isNaN(roughSprayerCount) || roughSprayerCount < 0 || !isFinite(roughSprayerCount)) {
                isMathWorking = false;
            }

            if (isNaN(workingSolutionPerSprayerLiters) || workingSolutionPerSprayerLiters < 0 || !isFinite(workingSolutionPerSprayerLiters)) {
                isMathWorking = false;
            }

            setDataToBeSaved({
                userId: authObject?.user?.id,
                plantId: form.getValues('selectedPlantId') || "",
                chemicalId: form.getValues('selectedChemicalId') || "",
                totalChemicalForAreaLiters: totalChemicalLiters,
                totalWorkingSolutionForAreaLiters: totalWorkingSolutionLiters,
                roughSprayerCount,
                chemicalPerSprayerML: workingSolutionPerSprayerLiters,
                isDataValid: form.formState.isValid && isMathWorking
            });
        });
    }, []);

    //on change, recalc the data
    useEffect(() => {
        const subscription = form.watch((_) => {
            let { chemicalPerAcreML, workingSolutionPerAcreLiters, sprayerVolumePerAcreLiters, areaToBeSprayedAcres } = form.getValues();
            let isMathWorking = true;

            if (isNaN(chemicalPerAcreML) || chemicalPerAcreML < 0) {
                chemicalPerAcreML = 0;
            }

            if (isNaN(workingSolutionPerAcreLiters) || workingSolutionPerAcreLiters < 0) {
                workingSolutionPerAcreLiters = 0;
            }

            if (isNaN(sprayerVolumePerAcreLiters) || sprayerVolumePerAcreLiters < 0) {
                sprayerVolumePerAcreLiters = 0;
            }

            if (isNaN(areaToBeSprayedAcres) || areaToBeSprayedAcres < 0) {
                areaToBeSprayedAcres = 0;
            }

            const totalChemicalLiters = CalculateChemProtTotalChemicalLiters(chemicalPerAcreML, areaToBeSprayedAcres);
            const totalWorkingSolutionLiters = CalculateChemProtTotalWorkingSolutionLiters(workingSolutionPerAcreLiters, areaToBeSprayedAcres);
            const roughSprayerCount = CalculateChemProtRoughSprayerCount(totalWorkingSolutionLiters, areaToBeSprayedAcres, sprayerVolumePerAcreLiters);
            const workingSolutionPerSprayerLiters = CalculateChemProtWorkingSolutionPerSprayerML(chemicalPerAcreML, workingSolutionPerAcreLiters, areaToBeSprayedAcres, sprayerVolumePerAcreLiters);

            if (isNaN(totalChemicalLiters) || totalChemicalLiters < 0 || !isFinite(totalChemicalLiters)) {
                isMathWorking = false;
            }

            if (isNaN(totalWorkingSolutionLiters) || totalWorkingSolutionLiters < 0 || !isFinite(totalWorkingSolutionLiters)) {
                isMathWorking = false;
            }

            if (isNaN(roughSprayerCount) || roughSprayerCount < 0 || !isFinite(roughSprayerCount)) {
                isMathWorking = false;
            }

            if (isNaN(workingSolutionPerSprayerLiters) || workingSolutionPerSprayerLiters < 0 || !isFinite(workingSolutionPerSprayerLiters)) {
                isMathWorking = false;
            }

            // Only show warning if the value was manually changed
            const currentChemicalId = form.getValues('selectedChemicalId');
            if (currentChemicalId) {
                const selectedChemicalData = plantsChems.find((c) => c.chemical.id === currentChemicalId)?.chemical;
                if (selectedChemicalData) {
                    const convertedDosage = unitOfMeasurement === UNIT_OF_MEASUREMENT_LENGTH.ACRES ?
                        selectedChemicalData.dosage :
                        AcresToHectares(selectedChemicalData.dosage);

                    if (convertedDosage !== chemicalPerAcreML && form.getFieldState('chemicalPerAcreML').isDirty) {
                        AddWarning('chemicalPerAcreML', "Value out of bounds!");
                    } else {
                        RemoveWarning('chemicalPerAcreML');
                    }
                }
            }

            setDataToBeSaved({
                userId: authObject?.user?.id,
                plantId: form.getValues('selectedPlantId') || "",
                chemicalId: form.getValues('selectedChemicalId') || "",
                totalChemicalForAreaLiters: totalChemicalLiters,
                totalWorkingSolutionForAreaLiters: totalWorkingSolutionLiters,
                roughSprayerCount,
                chemicalPerSprayerML: workingSolutionPerSprayerLiters,
                isDataValid: form.formState.isValid && isMathWorking
            });
        });

        return () => subscription.unsubscribe();
    }, [form.watch(), plantsChems]);

    //changes for unit of measurement
    useEffect(() => {
        const currentValue = form.getValues("chemicalPerAcreML");
        if (unitOfMeasurement === UNIT_OF_MEASUREMENT_LENGTH.HECTARES) {
            form.setValue("chemicalPerAcreML", AcresToHectares(currentValue));
        } else {
            form.setValue("chemicalPerAcreML", HectaresToAcres(currentValue));
        }
    }, [unitOfMeasurement])

    const onSubmit = async () => {
        if (!form.formState.isValid) {
            return;
        }

        const values = form.getValues();
        const dataToBeSaved = {
            userId: authObject?.user?.id,
            plantId: values.selectedPlantId || null,
            chemicalId: values.selectedChemicalId || null,
            totalChemicalForAreaLiters: (values.chemicalPerAcreML * values.areaToBeSprayedAcres) / 1000,
            totalWorkingSolutionForAreaLiters:
                values.workingSolutionPerAcreLiters * values.areaToBeSprayedAcres,
            roughSprayerCount:
                (values.workingSolutionPerAcreLiters * values.areaToBeSprayedAcres) /
                values.sprayerVolumePerAcreLiters,
            chemicalPerSprayerML:
                (values.chemicalPerAcreML * values.sprayerVolumePerAcreLiters) /
                values.workingSolutionPerAcreLiters,
            isDataValid: form.formState.isValid && CountWarnings() === 0,
        };

        try {
            const res = await APICaller(
                ['calc', 'chem-protection', 'working-solution', 'history'],
                '/api/calc/chem-protection/working-solution/history',
                'POST',
                dataToBeSaved
            );

            if (!res.success) {
                toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR));
                return;
            }

            toast.success(translator(SELECTABLE_STRINGS.TOAST_SAVE_SUCCESS));
        } catch (error) {
            toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR));
        }
    };

    return {
        form,
        onSubmit,
        dataToBeSaved,
        plantsChems,
        unitOfMeasurement,
        CountWarnings,
        warnings,
        loading,
        lastUsedPlantId
    }
}
