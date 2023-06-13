export const config = {
    // ...
    runner: 'browser',
    specs: ['./test/index.js'],
    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY,
    region: 'eu',
    services: [
        ['sauce', {
            sauceConnect: true,
            sauceConnectOpts: {
                // ...
            }
        }]
    ],
    capabilities: [{
        browserName: 'chrome',
        platformName: 'Windows 10',
        browserVersion: '75'
    }],
	logLevel: 'trace',
};