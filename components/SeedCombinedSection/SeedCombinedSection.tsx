import { SeedCombinedRow } from "@/components/SeedCombinedRow/SeedCombinedRow";
import { CalculateParticipation } from "@/lib/seedingCombinedUtils";

export function SeedCombinedSection({ name, title, maxPercentage, form, dbData }) {
    const participation = CalculateParticipation(form.watch(name));

    return (
        <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-4">{title}</h2>
            <div className="flex justify-between">
                <span>Total Participation: {participation.toFixed(1)}%</span>
                <span className={participation > maxPercentage ? "text-red-500 font-bold" : ""}>
                    Max: {maxPercentage}%
                </span>
            </div>
            {participation > maxPercentage && <p className="text-red-500 font-medium">Reduce participation.</p>}
            <div className="grid gap-4">
                <div className="grid grid-cols-6 gap-4 font-medium text-lg m-2">
                    <div>Active</div>
                    <div>Plant Type</div>
                    <div>Seeding Rate</div>
                    <div>Participation %</div>
                    <div>Combined Rate</div>
                    <div>Price/Da (BGN)</div>
                </div>
                {form.watch(name).map((_, index) => (
                    <SeedCombinedRow key={index} form={form} name={name} index={index} dbData={dbData} />
                ))}
            </div>
        </div>
    );
};