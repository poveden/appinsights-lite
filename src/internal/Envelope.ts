import { Base } from "./Base";
import { UUIDv4 } from "./UUIDv4";
import { Data } from "./Data";
import { Domain } from "./Domain";
import { ITelemetryItem } from "./ITelemetryItem";

/**
 * System variables for a telemetry item.
 *
 * @see {@link https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCommon/src/Interfaces/Contracts/Generated/Envelope.ts}
 * @internal
 */
export class Envelope implements ITelemetryItem {
  readonly time: string;
  readonly iKey: string;
  readonly name: string;
  readonly tags: { [key: string]: unknown };
  readonly data: Base;

  constructor(iKey: string, tags: { [key: string]: unknown }, eventType: string, baseType: string, data: Domain) {
    const baseTags = {
      'ai.operation.id': new UUIDv4().toString(),
    };

    this.time = new Date().toISOString();
    this.iKey = iKey;
    this.name = `Axa.AppInsightsLite.${iKey.replace(/-/g, '')}.${eventType}`;
    this.tags = Object.assign({}, baseTags, tags);
    this.data = new Data(baseType, data);
  }
}
