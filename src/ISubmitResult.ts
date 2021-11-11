import { IBackendResponse } from "./IBackendResponse";

export interface ISubmitResult {
  readonly ok: boolean;
  readonly status?: number;
  readonly statusText?: string;
  readonly response?: IBackendResponse;
}
