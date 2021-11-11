import { SeverityLevel } from './SeverityLevel';
import { IPartC } from './IPartC';

/**
 * Defines a trace message.
 *
 * @see {@link https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCommon/src/Interfaces/ITraceTelemetry.ts}
 */
export interface ITraceTelemetry extends IPartC {
    /**
     * A message string
     */
    message: string;

    /**
     * Severity level of the logging message used for filtering in the portal.
     */
    severityLevel?: SeverityLevel;

    /**
     * Custom defined iKey.
     */
    iKey?: string;
}
