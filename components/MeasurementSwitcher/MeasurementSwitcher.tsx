import { useDispatch, useSelector } from 'react-redux';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslate } from '@/hooks/useTranslate';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { UNIT_OF_MEASUREMENT_LENGTH } from '@/lib/utils';
import { LocalSetUnitOfMeasurementLength } from '@/store/slices/localSettingsSlice';
import { RootState } from '@/store/store';
import { Button } from '../ui/button';

function MUnitToI18nString(unitOfMeasurementLength: string) {
  switch (unitOfMeasurementLength) {
    case UNIT_OF_MEASUREMENT_LENGTH.ACRES:
      return SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT_ACRES;
    case UNIT_OF_MEASUREMENT_LENGTH.HECTARES:
      return SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT_HECTARES;
    default:
      return SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT_ACRES;
  }
}

export default function MeasurementSwitcher() {
  const dispatch = useDispatch();
  const translator = useTranslate();
  const measurementUnit = useSelector((state: RootState) => state.local.unitOfMeasurementLength);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{translator(MUnitToI18nString(measurementUnit))}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            dispatch(LocalSetUnitOfMeasurementLength(UNIT_OF_MEASUREMENT_LENGTH.ACRES));
          }}
        >
          {translator(SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT_ACRES)}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            dispatch(LocalSetUnitOfMeasurementLength(UNIT_OF_MEASUREMENT_LENGTH.HECTARES));
          }}
        >
          {translator(SELECTABLE_STRINGS.SETTINGS_PREF_UNIT_OF_MEASUREMENT_HECTARES)}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
