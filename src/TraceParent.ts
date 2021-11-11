import { RandomBytes } from "./internal/RandomBytes";
import { UUIDv4 } from "./internal/UUIDv4";

/**
 * Represents a traceparent header.
 *
 * @see {@link https://www.w3.org/TR/trace-context/#traceparent-header}
 */
export class TraceParent {
  readonly version: string;
  readonly traceId: string;
  readonly spanId: string;
  readonly traceFlags: string;

  /**
   * Creates a new TraceParent instance.
   *
   * @param {boolean} clearSampledFlag - Whether the "sampled" flag should be cleared or not. See {@link https://www.w3.org/TR/trace-context/#sampled-flag}.
   */
  constructor(clearSampledFlag?: boolean) {
    this.version = '00';
    this.traceId = new UUIDv4().toString();
    this.spanId = new RandomBytes(8).toString();
    this.traceFlags = clearSampledFlag ? '00' : '01';
  }

  toString() {
    return `${this.version}-${this.traceId}-${this.spanId}-${this.traceFlags}`;
  }
}
