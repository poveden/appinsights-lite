/*!
 * Copyright (c) Jorge Poveda Coma
 * Released under the MIT license
 */

import { IConfiguration } from "./IConfiguration";
import { ITraceTelemetry } from "./ITraceTelemetry";
import { Envelope } from "./internal/Envelope";
import { MessageData } from "./internal/MessageData";
import { ISubmitResult } from "./ISubmitResult";
import { IBackendResponse } from "./IBackendResponse";

// References:
// - https://stackoverflow.com/questions/52432103/post-json-to-log-event-into-application-insights/66377900#66377900
// - https://github.com/microsoft/ApplicationInsights-JS/blob/master/AISKU/API.md

const DEFAULT_ENDPOINTURL = 'https://dc.services.visualstudio.com/v2/track';

/**
 * Exposes a "lite" version of the Application Insights JavaScript SDK.
 *
 * @see {@link https://github.com/microsoft/ApplicationInsights-JS/blob/master/extensions/applicationinsights-analytics-js/src/JavaScriptSDK/ApplicationInsights.ts}
 */
export default class AppInsightsLite {
  tags: { [key: string]: unknown };

  private readonly _config: IConfiguration;
  private readonly _queue: Envelope[];
  private readonly _send: (endpointUrl: string, queue: Envelope[]) => Promise<ISubmitResult>;

  /**
   * Creates a new AppInsightsLite instance.
   *
   * @param {IConfiguration} config - The configuration used to initialize AppInsightsLite.
   * @param {Object.<string, any>} tags? - An optional collection of tags.
   */
  constructor(config: IConfiguration, tags?: { [key: string]: unknown }) {
    const baseConfig: IConfiguration = {
      instrumentationKey: '',
      endpointUrl: DEFAULT_ENDPOINTURL,
      isBeaconApiDisabled: true,
    };

    this._config = Object.assign({}, baseConfig, config);

    const baseTags = {
      "ai.device.id": "browser",
      "ai.device.type": "Browser",
    };

    this.tags = Object.assign({}, baseTags, tags);
    this._queue = [];
    this._send = this._config.isBeaconApiDisabled ? AppInsightsLite._sendViaFetch : AppInsightsLite._sendViaBeacon;
  }

  /**
   * Log a diagnostic trace
   *
   * @param {ITraceTelemetry} trace - The trace telemetry to log.
   * @param {Object.<string, any>} customProperties? - An optional collection of custom properties.
   */
  trackTrace(trace: ITraceTelemetry, customProperties?: { [key: string]: unknown }) {
    const data: ITraceTelemetry = Object.assign(new MessageData(trace.message), trace);
    data.properties = Object.assign({}, data.properties, customProperties);

    const envelope = new Envelope(this._config.instrumentationKey, this.tags, 'Message', 'MessageData', data);

    this._queue.push(envelope);
  }

  /**
   * Flush to send data immediately.
   *
   * @returns {Promise<ISubmitResult>} - The results of the operation.
   */
  async flush(): Promise<ISubmitResult> {
    const url = <string>this._config.endpointUrl;
    const res = await this._send(url, this._queue.slice(0));

    if (!res.ok) {
      return res;
    }

    if (res.status === 206) {
      if (!res.response) {
        this._queue.length = 0;
      } else {
        const rev = res.response.errors.sort((a, b) => b.index - a.index);

        rev.forEach(error => {
          if (!AppInsightsLite._isRetriable(error.statusCode)) {
            this._queue.splice(error.index, 1);
          }
        });
      }
    } else {
      this._queue.length = 0;
    }

    return res;
  }

  private static async _sendViaFetch(this: void, endpointUrl: string, queue: Envelope[]): Promise<ISubmitResult> {
    const body = JSON.stringify(queue);

    const res = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    const json = await AppInsightsLite._parseBackendResponse(res);

    const result: ISubmitResult = {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      response: json,
    };

    return result;
  }

  private static _sendViaBeacon(this: void, endpointUrl: string, queue: Envelope[]): Promise<ISubmitResult> {
    const body = JSON.stringify(queue);

    const data = new Blob([body], {
      type: 'text/plain; charset=UTF-8'
    });

    const res = navigator.sendBeacon(endpointUrl, data);

    const result: ISubmitResult = {
      ok: res,
    };

    return Promise.resolve(result);
  }

  // Reference: https://github.com/microsoft/ApplicationInsights-JS/blob/master/channels/applicationinsights-channel-js/src/Sender.ts
  private static async _parseBackendResponse(this: void, res: Response) : Promise<IBackendResponse|undefined> {
    try {
      const json = await res.json() as IBackendResponse;

      if (!json || (!json.itemsReceived && json.itemsReceived !== 0) || (!json.itemsAccepted && json.itemsAccepted !== 0) || !Array.isArray(json.errors)) {
        return undefined;
      }

      if (json.itemsReceived < json.itemsAccepted || json.itemsReceived - json.itemsAccepted !== json.errors.length) {
        return undefined;
      }

      return json;
    } catch {
      return undefined;
    }
  }

  // Reference: https://github.com/microsoft/ApplicationInsights-JS/blob/master/channels/applicationinsights-channel-js/src/Sender.ts
  private static _isRetriable(this: void, statusCode: number): boolean {
    return statusCode === 408  // Timeout
        || statusCode === 429  // Too many requests.
        || statusCode === 500  // Internal server error.
        || statusCode === 503; // Service unavailable.
  }
}
