import { IResponseError } from "./IResponseError";

/**
 * Back end response.
 *
 * @see {@link https://github.com/microsoft/ApplicationInsights-JS/blob/master/channels/applicationinsights-channel-js/src/Interfaces.ts}
 */
export interface IBackendResponse {
  /**
   * Number of items received by the backend
   */
  readonly itemsReceived: number;

  /**
   * Number of items succesfuly accepted by the backend
   */
  readonly itemsAccepted: number;

  /**
   * List of errors for items which were not accepted
   */
  readonly errors: IResponseError[];

  /**
   * App id returned by the backend - not necessary returned, but we don't need it with each response.
   */
  readonly appId?: string;
}
