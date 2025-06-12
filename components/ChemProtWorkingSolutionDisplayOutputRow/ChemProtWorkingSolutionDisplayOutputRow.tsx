import { ToFixedNumber } from '@/lib/math-util';

interface DisplayOutputRowProps {
  data: number;
  text: string;
  unit: string;
  decimals?: number;
  base?: number;
}

export function ChemProtWorkingSolutionDisplayOutputRow({
  data,
  text,
  unit,
  decimals = 2,
  base = 10,
}: DisplayOutputRowProps) {
  const safeValue = isNaN(data) ? 0 : data;
  return (
    <div
      className="flex justify-between items-center border-b pb-2 sm:pb-3"
      data-testid="display-output-row"
    >
      <span className="font-semibold text-lg sm:text-xl">{text}</span>
      <div>
        <span className="text-lg sm:text-xl font-bold">
          {ToFixedNumber(safeValue, decimals, base)}
        </span>
        <span className="text-lg sm:text-xl font-bold"> {unit}</span>
      </div>
    </div>
  );
}
