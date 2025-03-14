import { SeedCombinedRow } from "@/components/SeedCombinedRow/SeedCombinedRow";
import { CalculateParticipation } from "@/lib/seedingCombinedUtils";

export function SeedCombinedSection({ name, title, maxPercentage, form, dbData }) {
    const participation = CalculateParticipation(form.watch(name));

    return (
        <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-4">{title}</h2>
            <div className="flex justify-between">
                <span className="text-xl">Общо участие: {participation.toFixed(1)}%</span>
                <span className={participation > maxPercentage ? "text-red-500 font-bold text-xl" : "text-xl"}>
                    Максимално: {maxPercentage}%
                </span>
            </div>
            {participation > maxPercentage && <p className="text-red-500 font-medium text-xl">Reduce participation.</p>}
            <div className="grid gap-4">
                <div className="grid grid-cols-6 gap-4 font-medium text-xl m-2">
                    <div>Активно?</div>
                    <div>Растиение</div>
                    <div>Сеидбена норма - самостоятелно</div>
                    <div>Участие (%)</div>
                    <div>Сеидбена норма - в смеската</div>
                    <div>Цена на семена за da/BGN</div>
                </div>
                {form.watch(name).map((_, index) => (
                    <SeedCombinedRow key={index} form={form} name={name} index={index} dbData={dbData} />
                ))}
            </div>
        </div>
    );
};