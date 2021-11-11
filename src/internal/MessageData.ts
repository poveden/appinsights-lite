import { ITraceTelemetry } from "../ITraceTelemetry";
import { SeverityLevel } from "../SeverityLevel";
import { Domain } from "./Domain";

/**
 * Instances of Message represent printf-like trace statements that are text-searched.
 * Log4Net, NLog and other text-based log file entries are translated into intances of this type.
 * The message does not have measurements.
 *
 * @see {@link https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCommon/src/Interfaces/Contracts/Generated/MessageData.ts}
 * @internal
 */
 export class MessageData extends Domain implements ITraceTelemetry {
  version = 2;
  message: string;
  severityLevel?: SeverityLevel;
  iKey?: string;
  properties?: { [key: string]: string; };
  measurements?: { [key: string]: number; };

  constructor(message: string) {
    super();
    this.message = message;
  }
}
