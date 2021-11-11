import { Base } from "./Base";
import { Domain } from "./Domain";

/**
 * Data struct to contain both B and C sections.
 *
 * @see {@link https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCommon/src/Interfaces/Contracts/Generated/Data.ts}
 * @internal
 */
 export class Data extends Base {
  readonly baseData: Domain;

  constructor(baseType: string, baseData: Domain) {
    super(baseType);
    this.baseData = baseData;
  }
}
