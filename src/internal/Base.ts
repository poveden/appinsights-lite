/**
 * Data struct to contain only C section with custom fields.
 *
 * @see {@link https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCommon/src/Interfaces/Contracts/Generated/Base.ts}
 * @internal
 */
 export class Base {
  readonly baseType: string;

  constructor(baseType: string) {
    this.baseType = baseType;
  }
}
