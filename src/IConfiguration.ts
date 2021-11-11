/**
 * Configuration for AppInsightsLite.
 *
 * @see {@link https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/IConfiguration.ts}
 */
 export interface IConfiguration {
  /**
   * Instrumentation key of resource.
   */
  instrumentationKey: string;

  /**
   * Endpoint where telemetry data is sent
   */
  endpointUrl?: string;

  /**
   * If false, the SDK will send all telemetry using the Beacon API.
   */
  isBeaconApiDisabled?: boolean;
}
