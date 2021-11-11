import { Base } from "./Base";

/**
 * Telemetry item.
 *
 * @see {@link https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/ITelemetryItem.ts}
 * @internal
 */
export interface ITelemetryItem {
  /**
   * CommonSchema Version of this SDK
   */
  ver?: string;

  /**
   * Unique name of the telemetry item
   */
  name: string;

  /**
   * Timestamp when item was sent
   */
  time?: string;

  /**
   * Identifier of the resource that uniquely identifies which resource data is sent to
   */
  iKey?: string;

  /**
   * System context properties of the telemetry item, example: ip address, city etc
   */
  ext?: { [key: string]: unknown };

  /**
   * System context property extensions that are not global (not in ctx)
   */
  tags?: { [key: string]: unknown };

  /**
   * Custom data
   */
  data?: Base;

  /**
   * Telemetry type used for part B
   */
  baseType?: string;

  /**
   * Based on schema for part B
   */
  baseData?: { [key: string]: unknown };
}
