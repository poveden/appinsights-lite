# appinsights-lite

A minimal implementation of the [Application Insights JavaScript SDK](https://github.com/microsoft/ApplicationInsights-JS) for restricted web browser environments.

Although [the SDK already offers a Basic version](https://github.com/microsoft/ApplicationInsights-JS/tree/master/AISKULight),
`appinsights-lite` is meant to be embedded in web browser application environments which might impose several restrictions (e.g. Salesforce).

### Limitations

- No automatic collection of telemetry of any kind (which usually involves overloading of JavaScript objects). This implies:
  - No automatic exception tracking.
  - No network dependency tracking.
  - No user, device or session information.
- No automated, periodic delivery of collected telemetry.

## Supported Browsers

- Google Chrome v55+
- Mozilla Firefox v52+
- Apple Safari 11+
- Microsoft Edge 15+

Note that Internet Explorer is _not_ supported.

## How to Use

Download `appinsights-lite.js` from the [Releases](https://github.com/poveden/appinsights-lite/releases) page and reference it from your HTML code:

```html
<script type="module" src="appinsights-lite.js"></script>

<script type="module">
  import AppInsightsLite from "./appinsights-lite.js";

  const ai = new AppInsightsLite({
    instrumentationKey: 'YOUR_INSTRUMENTATION_KEY_GOES_HERE'
  });

  ai.trackTrace({
    message: 'Trace message'
  });

  ai.flush();
</script>
```

## Configuration Settings

| Setting               | Description |
|-----------------------|-------------|
| `instrumentationKey`  | Required. Application Insights _Instrumentation Key_. |
| `endpointUrl`         | Optional. Alternate ingestion API endpoint. Default is `https://dc.services.visualstudio.com/v2/track`. |
| `isBeaconApiDisabled` | Optional. If set to `false` telemetry will be sent using the [Beacon API](https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API). Default is `true`. |

## Contributing

Contributions are welcome! Please read on [how to contribute](https://github.com/poveden/appinsights-lite/blob/master/CONTRIBUTING.md).

## Code of conduct

We follow the [Contributor Covenant Code of Conduct](https://github.com/poveden/appinsights-lite/blob/master/CODE_OF_CONDUCT.md).
