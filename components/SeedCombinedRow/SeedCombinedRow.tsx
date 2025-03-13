import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export function SeedCombinedRow({ form, name, index, dbData }) {
    // Get the selected plant
    const selectedPlant = dbData.find((plant) => plant.id === form.watch(`${name}.${index}.id`));

    // Get all selected plant names in the form
    const selectedPlantNames = form.watch(name).map((row) => row.dropdownPlant).filter(Boolean);

    return (
        <div className="grid grid-cols-6 gap-4 items-center">
            <FormField control={form.control} name={`${name}.${index}.active`} render={({ field }) => (
                <div className="flex justify-center items-center">
                    <Input type="checkbox" checked={field.value} onChange={field.onChange} className="w-5 h-5" />
                </div>
            )} />

            <FormField control={form.control} name={`${name}.${index}.dropdownPlant`} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} disabled={!form.watch(`${name}.${index}.active`)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                        {dbData.map((plant) => (
                            plant.plantType === name && (
                                <SelectItem
                                    key={plant.latinName}
                                    value={plant.latinName}
                                    disabled={selectedPlantNames.includes(plant.latinName) && field.value !== plant.latinName}>
                                    {plant.latinName}
                                </SelectItem>
                            )
                        ))}
                    </SelectContent>
                </Select>
            )} />

            {/* Seeding Rate */}
            <FormField control={form.control} name={`${name}.${index}.seedingRate`} render={({ field, fieldState }) => (
                <div>
                    <Input
                        type="number"
                        step="0.1"
                        {...field}
                        disabled={!form.watch(`${name}.${index}.active`) || form.watch(`${name}.${index}.id`) === ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} // Convert to number
                    />
                    {/* Show min/max dynamically */}
                    {selectedPlant && (
                        <p className="text-yellow-500 text-sm">
                            Min: {selectedPlant.minSeedingRate} | Max: {selectedPlant.maxSeedingRate}
                        </p>
                    )}
                    {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
                </div>
            )} />

            {/* Participation */}
            <FormField control={form.control} name={`${name}.${index}.participation`} render={({ field, fieldState }) => (
                <div>
                    <Input
                        type="number"
                        step="0.1"
                        min={0}
                        max={100}
                        {...field}
                        disabled={!form.watch(`${name}.${index}.active`) || form.watch(`${name}.${index}.id`) === ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                    {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
                </div>
            )} />

            {/* seedingRateInCombination */}
            <FormField control={form.control} name={`${name}.${index}.seedingRateInCombination`} render={({ field }) => (
                <Input disabled value={form.watch(`${name}.${index}.seedingRateInCombination`) || 0} />
            )} />

            {/* priceSeedsPerDaBGN */}
            <FormField control={form.control} name={`${name}.${index}.priceSeedsPerDaBGN`} render={({ field }) => (
                <Input disabled value={form.watch(`${name}.${index}.priceSeedsPerDaBGN`) || 0} />
            )} />
        </div>
    );
}
