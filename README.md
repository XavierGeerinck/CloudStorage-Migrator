# M18X
Tool to Migrate between Cloud Platforms

## Installation
### Application
1. Navigate into the `./application` folder with `cd application/`
2. Run `npm install`
3. Run `npm run electron-dev` to start the application in development mode

> Note: The application can only start in a UNIX shell, and therefor only Works on MAC and Linux. For Windows use the Bash subsystem - we depend on a environment variable.

#### Building for release
1. Navigate into the `./application` folder with `cd application/`
2. Run `npm install`
3. Run `npm run electron-pack`
4. See the `./dist` folder

### Server
1. Navigate into the `./server` folder with `cd server/`
2. Run `npm install`
3. Copy `config.sample.js` to `config.js` and adapt the variables with your own
4. Run `node index.js` to start the server

> Note: The server requires a valid host and domain name configured since it needs to trigger the callbacks from the providers.

## Documentation
### OneDrive
* Permission/Scope: https://docs.microsoft.com/en-us/onedrive/developer/rest-api/getting-started/msa-oauth
* Get all items: https://graph.microsoft.com/v1.0/me/drive/root/children
* Tester: https://developer.microsoft.com/en-us/graph/graph-explorer#