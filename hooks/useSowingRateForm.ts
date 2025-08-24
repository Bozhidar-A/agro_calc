import { useCallback, useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useTranslate } from '@/hooks/useTranslate';
import { useWarnings } from '@/hooks/useWarnings';
import { APICaller } from '@/lib/api-util';
import { SowingRateDBData, SowingRateSaveData } from '@/lib/interfaces';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { Log } from '@/lib/logger';
import { CmToMeters, MetersSquaredToAcre, MetersToCm, ToFixedNumber } from '@/lib/math-util';
import { IsValueOutOfBounds } from '@/lib/sowing-utils';
import { CalculatorValueTypes } from '@/lib/utils';

export default function useSowingRateForm(dbData: SowingRateDBData[]) {
  const { isAuthenticated, userId } = useAuth();
  const translator = useTranslate();
  const [activePlantDbData, setActivePlantDbData] = useState<SowingRateDBData | null>(null);
  const [dataToBeSaved, setDataToBeSaved] = useState<SowingRateSaveData>({
    userId: '',
    plantId: '',
    plantLatinName: '',
    sowingRateSafeSeedsPerMeterSquared: 0,
    sowingRatePlantsPerAcre: 0,
    usedSeedsKgPerAcre: 0,
    internalRowHeightCm: 0,
    totalArea: 1,
    isDataValid: false,
  });

  const { warnings, AddWarning, RemoveWarning, CountWarnings } = useWarnings();

  const formSchema = z.object({
    cultureLatinName: z.string(),
    coefficientSecurity: z
      .number()
      .min(0, 'Coefficient security must be at least 0')
      .max(100, 'Coefficient security cannot exceed 100'),
    wantedPlantsPerMeterSquared: z
      .number()
      .min(0, 'Wanted plants per meter squared must be at least 0'),
    massPer1000g: z.number().min(0, 'Mass per 1000g must be at least 0'),
    purity: z.number().min(0, 'Purity must be at least 0'),
    germination: z.number().min(0, 'Germination must be at least 0'),
    rowSpacing: z.number().min(0, 'Row spacing must be at least 0'),
    totalArea: z
      .number()
      .min(0, 'Total area must be at least 0')
      .transform((val) => (isNaN(val) ? 0 : val)),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cultureLatinName: '',
      coefficientSecurity: 0,
      wantedPlantsPerMeterSquared: 0,
      massPer1000g: 0,
      purity: 0,
      germination: 0,
      rowSpacing: 0,
      totalArea: 1,
    },
    mode: 'onChange',
    reValidateMode: 'onBlur',
  });

  const calculateSavingData = useCallback(() => {
    if (!activePlantDbData) {
      return null;
    }

    const formValues = form.getValues();
    const formState = form.formState;

    const wantedPlantsPerMeterSquared =
      (formValues.wantedPlantsPerMeterSquared * 100) /
      (formValues.germination * formValues.coefficientSecurity);

    const sowingRatePlantsPerAcre = MetersSquaredToAcre(wantedPlantsPerMeterSquared);

    const usedSeedsKgPerAcre =
      (wantedPlantsPerMeterSquared * formValues.massPer1000g * 10) /
      (formValues.purity * formValues.germination);

    const internalRowHeightCm =
      MetersToCm(1000 / CmToMeters(formValues.rowSpacing)) / sowingRatePlantsPerAcre;

    return {
      userId,
      plantId: activePlantDbData.plant.plantId,
      plantLatinName: activePlantDbData.plant.plantLatinName,
      sowingRateSafeSeedsPerMeterSquared: ToFixedNumber(wantedPlantsPerMeterSquared, 0),
      sowingRatePlantsPerAcre: ToFixedNumber(sowingRatePlantsPerAcre, 0),
      usedSeedsKgPerAcre: ToFixedNumber(usedSeedsKgPerAcre, 2),
      internalRowHeightCm: ToFixedNumber(internalRowHeightCm, 2),
      totalArea: formValues.totalArea,
      isDataValid: formState.isValid && CountWarnings() === 0,
    };
  }, [activePlantDbData, form.getValues, form.formState, CountWarnings]);

  //calculate data whenever form values or active plant changes
  useEffect(() => {
    const subscription = form.watch(() => {
      const newData = calculateSavingData();
      if (newData) {
        setDataToBeSaved(newData);
      }
    });

    return () => subscription.unsubscribe();
  }, [form.watch, calculateSavingData]);

  //trigger validation on mount
  useEffect(() => {
    form.trigger();
  }, [form]);

  //inane BS but this prevents infinite loops and makes test happy
  const isUpdatingRef = useRef(false);

  //handle form value changes and validation
  useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      //skip if we're in the middle of an update
      if (isUpdatingRef.current) {
        return;
      }

      const plant = dbData.find(
        (entry) => entry.plant.plantLatinName === form.getValues('cultureLatinName')
      );

      if (name === 'cultureLatinName' && plant) {
        setActivePlantDbData(plant);

        const currentValues = form.getValues();
        const newValues = {
          coefficientSecurity:
            plant.coefficientSecurity.type === CalculatorValueTypes.SLIDER
              ? plant.coefficientSecurity.minSliderVal
              : plant.coefficientSecurity.constValue,
          wantedPlantsPerMeterSquared:
            plant.wantedPlantsPerMeterSquared.type === CalculatorValueTypes.SLIDER
              ? plant.wantedPlantsPerMeterSquared.minSliderVal
              : plant.wantedPlantsPerMeterSquared.constValue,
          massPer1000g:
            plant.massPer1000g.type === CalculatorValueTypes.SLIDER
              ? plant.massPer1000g.minSliderVal
              : plant.massPer1000g.constValue,
          purity:
            plant.purity.type === CalculatorValueTypes.SLIDER
              ? plant.purity.minSliderVal
              : plant.purity.constValue,
          germination:
            plant.germination.type === CalculatorValueTypes.SLIDER
              ? plant.germination.minSliderVal
              : plant.germination.constValue,
          rowSpacing:
            plant.rowSpacing.type === CalculatorValueTypes.SLIDER
              ? plant.rowSpacing.minSliderVal
              : plant.rowSpacing.constValue,
        };

        //only update values if they are different from current values
        const hasChanges = Object.entries(newValues).some(
          ([key, value]) => currentValues[key as keyof typeof currentValues] !== value
        );

        if (hasChanges) {
          isUpdatingRef.current = true;
          Object.entries(newValues).forEach(([key, value]) => {
            form.setValue(key as any, value, { shouldValidate: false });
          });
          //trigger validation after all updates are done
          setTimeout(() => {
            form.trigger();
            isUpdatingRef.current = false;
          }, 0);
        }
        return;
      }

      if (!plant) {
        return;
      }

      //validation warnings - only run if we're not in the middle of an update
      if (!isUpdatingRef.current) {
        const validationChecks = [
          { field: 'coefficientSecurity', config: plant.coefficientSecurity },
          { field: 'wantedPlantsPerMeterSquared', config: plant.wantedPlantsPerMeterSquared },
          { field: 'massPer1000g', config: plant.massPer1000g },
          { field: 'purity', config: plant.purity },
          { field: 'germination', config: plant.germination },
          { field: 'rowSpacing', config: plant.rowSpacing },
        ];

        validationChecks.forEach(({ field, config }) => {
          if (
            IsValueOutOfBounds(
              form.getValues(field as any),
              config.type,
              config.minSliderVal,
              config.maxSliderVal,
              config.constValue
            )
          ) {
            AddWarning(field, 'Value out of bounds!');
          } else {
            RemoveWarning(field);
          }
        });

        if (IsValueOutOfBounds(form.getValues('totalArea'), CalculatorValueTypes.ABOVE_ZERO)) {
          AddWarning('totalArea', 'Value out of bounds!');
        } else {
          RemoveWarning('totalArea');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, dbData, AddWarning, RemoveWarning]);

  async function onSubmit(_data: any) {
    if (!isAuthenticated) {
      toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_NOT_LOGGED_IN));
      return;
    }

    if (!activePlantDbData) {
      toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_NO_PLANT_SELECTED));
      return;
    }

    try {
      const res = await APICaller(
        ['calc', 'combined', 'page', 'save history'],
        '/api/calc/sowing/history',
        'POST',
        dataToBeSaved
      );

      if (!res.success) {
        toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR), {
          description: res.message,
        });
        Log(['frontend', 'hooks', 'useSowingRateForm', 'onSubmit'], res.message);
        return;
      }

      toast.success(translator(SELECTABLE_STRINGS.TOAST_SAVE_SUCCESS));
    } catch (error) {
      toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR));
      Log(
        ['frontend', 'hooks', 'useSowingRateForm', 'onSubmit'],
        (error as Error)?.message ?? String(error)
      );
    }
  }

  return { form, onSubmit, warnings, activePlantDbData, dataToBeSaved, CountWarnings };
}
