# LANLine

## How to develop
First, install `nodejs` and `npm` (Node Package Manager).
Then install Node dependencies with `npm install`.

- You can run a local build of LANLine by using `npm start`.
- To package and deploy the application for your local OS, run `npm run package`. Your packages will be found in `out/`.
- To package and deploy the application for Linux, OSX and Windows, run `npm run packageall`. **Note**: If you're packaging for Windows (`win32`) on a non-Windows OS, you will need to have WINE installed.

## Testing
Jest.js is used for testing. Ensure you have all dependencies installed by using `npm install`.

Run the testing framework with `npm test`. If this doesn't work, it's most likely because `jest` is not in your PATH environment variable. Run `npm install -g jest` and try again.

Tests should be written in `src/__tests__`.