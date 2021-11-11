/**
 * PartC telemetry interface. Implemented by all I(xxx)Telemetry interfaces.
 *
 * @see {@link https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCommon/src/Interfaces/IPartC.ts}
 */
export interface IPartC {
  /**
   * Property bag to contain additional custom properties (Part C)
   */
  properties?: { [key: string]: string };

  /**
   * Property bag to contain additional custom measurements (Part C)
   *
   * @deprecated -- please use properties instead
   */
  measurements?: { [key: string]: number };
}
