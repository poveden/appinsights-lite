import AppInsightsLite from '../src/AppInsightsLite';

describe('AppInsightsLite', () => {
  it('can be instanced', () => {
    const ai = new AppInsightsLite({ instrumentationKey: '-' });

    expect(ai).toBeInstanceOf(AppInsightsLite);
  });

  it('sends telemetry using fetch()', async () => {
    const spy = jest.spyOn(window, 'fetch');
    const ai = new AppInsightsLite({ instrumentationKey: '-' });

    ai.trackTrace({ message: 'Telemetry via fetch()' });
    await ai.flush();

    expect(spy).toBeCalled();
  });

  it('sends telemetry using sendBeacon()', async () => {
    const spy = jest.spyOn(navigator, 'sendBeacon');
    const ai = new AppInsightsLite({ instrumentationKey: '-', isBeaconApiDisabled: false });

    ai.trackTrace({ message: 'Telemetry via sendBeacon()' });
    await ai.flush();

    expect(spy).toBeCalled();
  });

  it('sends a track trace', async () => {
    jest.spyOn(window, 'fetch').mockResolvedValueOnce(buildOKResponse(1));

    const ai = new AppInsightsLite({ instrumentationKey: '-' });

    ai.trackTrace({ message: 'This is a test' });
    const res = await ai.flush();

    expect(res).toMatchObject({
      ok: true,
      status: 200,
      response: {
        itemsReceived: 1,
        itemsAccepted: 1,
        errors: [],
      },
    });
  });

  it('handles 206 status codes', async () => {
    jest.spyOn(window, 'fetch').mockResolvedValueOnce(<Response>{
      ok: true,
      status: 206,
      statusText: 'Partial Content',
      json: () => Promise.resolve({
        itemsReceived: 4,
        itemsAccepted: 2,
        errors: [
          { index: 2, statusCode: 402, message: 'Monthly quota exceeded' },
          { index: 0, statusCode: 402, message: 'Monthly quota exceeded' },
        ],
      }),
    });

    const ai = new AppInsightsLite({ instrumentationKey: '-' });

    ai.trackTrace({ message: 'Trace 1' });
    ai.trackTrace({ message: 'Trace 2' });
    ai.trackTrace({ message: 'Trace 3' });
    ai.trackTrace({ message: 'Trace 4' });
    const res = await ai.flush();

    expect(res).toMatchObject({
      ok: true,
      status: 206,
      response: {
        itemsReceived: 4,
        itemsAccepted: 2,
        errors: [
          { index: 2, statusCode: 402, message: 'Monthly quota exceeded' },
          { index: 0, statusCode: 402, message: 'Monthly quota exceeded' },
        ],
      },
    });

    expect(ai['_queue']).toMatchObject([
      { data: { baseData: { message: 'Trace 2' } } },
      { data: { baseData: { message: 'Trace 4' } } },
    ]);
  });

  it('handles 206 status codes without response payload', async () => {
    jest.spyOn(window, 'fetch').mockResolvedValueOnce(<Response>{
      ok: true,
      status: 206,
      statusText: 'Partial Content',
      json: () => Promise.resolve(undefined),
    });

    const ai = new AppInsightsLite({ instrumentationKey: '-' });

    ai.trackTrace({ message: 'Trace 1' });
    ai.trackTrace({ message: 'Trace 2' });
    const res = await ai.flush();

    expect(res).toMatchObject({
      ok: true,
      status: 206,
      response: undefined,
    });

    expect(ai['_queue'].length).toEqual(0);
  });

  it.each([
    ['Not a JSON object',             Promise.resolve("THIS IS NOT A JSON RESPONSE")],
    ['No itemsReceived',              Promise.resolve({ itemsReceived: null, itemsAccepted: 1, errors: [] })],
    ['No itemsAccepted',              Promise.resolve({ itemsReceived: 1, itemsAccepted: null, errors: [] })],
    ['No errors array',               Promise.resolve({ itemsReceived: 1, itemsAccepted: 1, errors: null })],
    ['itemsAccepted > itemsReceived', Promise.resolve({ itemsReceived: 1, itemsAccepted: 2, errors: [] })],
    ['Error length mismatch',         Promise.resolve({ itemsReceived: 2, itemsAccepted: 1, errors: [] })],
    ['fetch() error',                 Promise.reject(new Error('FETCH ERROR'))],
  ])('ignores unrecognized response payloads: %s', async (_name: string, promise: Promise<unknown>) => {
    jest.spyOn(window, 'fetch').mockResolvedValueOnce(<Response>{
      ok: true,
      status: 200,
      statusText: 'OK',
      json: () => promise,
    });

    const ai = new AppInsightsLite({ instrumentationKey: '-' });

    ai.trackTrace({ message: 'Trace' });
    const res = await ai.flush();

    expect(res).toMatchObject({
      ok: true,
      status: 200,
      response: undefined,
    });

    expect(ai['_queue'].length).toEqual(0);
  });

  it('handles non-2xx responses', async () => {
    jest.spyOn(window, 'fetch').mockResolvedValueOnce(<Response>{
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve(''),
    });

    const ai = new AppInsightsLite({ instrumentationKey: '-' });

    ai.trackTrace({ message: 'Trace' });
    const res = await ai.flush();

    expect(res).toMatchObject({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      response: undefined,
    });

    expect(ai['_queue'].length).toEqual(1);
  });
});

function buildOKResponse(numItems: number) : Response {
  return <Response>{
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve({
      itemsReceived: numItems,
      itemsAccepted: numItems,
      errors: [],
    }),
  };
}
