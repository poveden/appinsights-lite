/**
 * Represents an array of random bytes.
 *
 * @internal
 */
export class RandomBytes {
  readonly bytes: Uint8Array;

  constructor(numBytes: number) {
    this.bytes = crypto.getRandomValues(new Uint8Array(numBytes));
  }

  toString() {
    return this.bytes.reduce(
      (res, byte) => res + byte.toString(16).padStart(2, '0'),
      ''
    ).toLowerCase();
  }
}
