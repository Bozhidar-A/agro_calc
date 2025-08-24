import { useSelector } from 'react-redux';
import { DisplayOutputRow } from '@/app/calculators/sowing/page';
import { useTranslate } from '@/hooks/useTranslate';
import { SowingRateSaveData } from '@/lib/interfaces';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import {
  KgPerAcreToKgPerHectare,
  SowingRatePlantsPerAcreToHectare,
  ToFixedNumber,
} from '@/lib/math-util';
import { UNIT_OF_MEASUREMENT_LENGTH } from '@/lib/utils';

export default function SowingMeasurementSwitcher({
  dataToBeSaved,
}: {
  dataToBeSaved: SowingRateSaveData;
}) {
  const translator = useTranslate();
  const unitOfMeasurement = useSelector((state: any) => state.local.unitOfMeasurementLength);

  switch (unitOfMeasurement) {
    case UNIT_OF_MEASUREMENT_LENGTH.ACRES:
      return (
        <>
          <DisplayOutputRow
            data={dataToBeSaved.sowingRatePlantsPerAcre}
            text={translator(SELECTABLE_STRINGS.SOWING_RATE_OUTPUT_SOWING_RATE)}
            unit={translator(SELECTABLE_STRINGS.PLANTS_PER_ACRE)}
          />
          <DisplayOutputRow
            data={dataToBeSaved.usedSeedsKgPerAcre}
            text={translator(SELECTABLE_STRINGS.SOWING_RATE_OUTPUT_USED_SEEDS)}
            unit={translator(SELECTABLE_STRINGS.KG_ACRE)}
          />
        </>
      );
    case UNIT_OF_MEASUREMENT_LENGTH.HECTARES:
      return (
        <>
          <DisplayOutputRow
            data={ToFixedNumber(
              SowingRatePlantsPerAcreToHectare(dataToBeSaved.sowingRatePlantsPerAcre),
              0
            )}
            text={translator(SELECTABLE_STRINGS.SOWING_RATE_OUTPUT_SOWING_RATE)}
            unit={translator(SELECTABLE_STRINGS.PLANTS_PER_HECTARE)}
          />
          <DisplayOutputRow
            data={ToFixedNumber(KgPerAcreToKgPerHectare(dataToBeSaved.usedSeedsKgPerAcre), 2)} // Convert kg/acre to kg/hectare
            text={translator(SELECTABLE_STRINGS.SOWING_RATE_OUTPUT_USED_SEEDS)}
            unit={translator(SELECTABLE_STRINGS.KG_HECTARE)}
          />
        </>
      );
    default:
      return null;
  }
}
