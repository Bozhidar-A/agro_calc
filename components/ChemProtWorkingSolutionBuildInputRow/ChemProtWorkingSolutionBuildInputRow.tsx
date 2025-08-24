import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ChemProtWorkingSolutionBuildInputRowProps } from '@/lib/interfaces';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';

export function ChemProtWorkingSolutionBuildInputRow({
  varName,
  displayName,
  form,
  icon,
  translator,
  unit,
  displayValue,
  id,
}: ChemProtWorkingSolutionBuildInputRowProps) {
  return (
    <Card className="overflow-hidden" data-testid="card">
      <CardHeader className="bg-green-700 pb-2" data-testid="card-header">
        <CardTitle
          className="flex items-center gap-2 text-lg text-white"
          data-testid="card-title"
        >
          {icon}
          {displayName}
        </CardTitle>
        <CardDescription className="text-white/90">
          {translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_CALC_DESCRIPTION)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name={varName}
            render={({ field }) => {
              const watchedValue = form.watch(varName);
              const currentValue = watchedValue ?? 0;
              return (
                <Input
                  min={0}
                  className="text-center text-xl"
                  type="number"
                  id={id}
                  value={currentValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      field.onChange('');
                    } else {
                      const numVal = Number(val);
                      field.onChange(isNaN(numVal) ? '' : numVal);
                    }
                  }}
                />
              );
            }}
          />
          <div className="text-center font-medium mt-1">
            {`${displayValue ?? (form.watch(varName) || 0)} ${unit}`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
