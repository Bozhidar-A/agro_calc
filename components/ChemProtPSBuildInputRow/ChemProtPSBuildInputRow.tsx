import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ChemProtPercentFormValues } from '@/lib/interfaces';

export function ChemProtPSBuildInputRow({
  varName,
  displayName,
  form,
  icon,
  unit,
  tourId,
}: {
  varName: keyof ChemProtPercentFormValues;
  displayName: string;
  form: any;
  icon: React.ReactNode;
  unit: string;
  tourId: string;
}) {
  return (
    <Card className="overflow-hidden" id={tourId} data-testid={tourId}>
      <CardHeader className="bg-green-700 pb-2">
        <CardTitle className="flex items-center gap-2 text-lg text-black dark:text-white">
          {icon}
          {displayName}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name={varName}
            render={({ field }) => (
              <Input
                className="text-center text-xl"
                type="number"
                min="0"
                {...field}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || isNaN(Number(value)) || Number(value) < 0) {
                    field.onChange(0);
                    return;
                  }
                  field.onChange(Number(value));
                }}
              />
            )}
          />
          <div className="text-center font-medium mt-1">
            {`${form.watch(varName) || 0} ${unit}`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
