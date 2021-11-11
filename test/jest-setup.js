global.crypto = require('crypto').webcrypto;

global.fetch = jest.fn(input => {
  if (input !== 'https://dc.services.visualstudio.com/v2/track') {
    throw new Error('Not supported');
  }

  return Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve({}),
  });
});

global.navigator.sendBeacon = jest.fn(() => true);
