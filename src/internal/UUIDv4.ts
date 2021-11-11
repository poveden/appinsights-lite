import { RandomBytes } from "./RandomBytes";

/**
 * Represents a Version 4 UUID.
 *
 * @see {@link https://datatracker.ietf.org/doc/html/rfc4122#section-4.4}
 * @internal
 */
export class UUIDv4 extends RandomBytes {

  constructor() {
    super(16);

    this.bytes[6] = (this.bytes[6] & 0x0F) | 0x40;
    this.bytes[8] = (this.bytes[8] & 0x3F) | 0x80;
  }
}
