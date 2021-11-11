/**
 * Back end response error detail.
 *
 * @see {@link https://github.com/microsoft/ApplicationInsights-JS/blob/master/channels/applicationinsights-channel-js/src/Interfaces.ts}
 */
 export interface IResponseError {
  /**
   * Index of the affected item in the payload sent to the back end.
   */
  readonly index: number;

  /**
   * HTTP status code.
   */
  readonly statusCode: number;

  /**
   * Error messsage.
   */
  readonly message: string;
}
