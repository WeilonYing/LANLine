# LANLine

## How to develop
First, install `nodejs` and `npm` (Node Package Manager).
Then install Node dependencies with `npm install`.

- You can run a local build of LANLine by using `npm start`.
- To package and deploy the application for your local OS, run `npm run package`. Your packages will be found in `out/`.
- To package and deploy the application for Linux, OSX and Windows, run `npm run packageall`. **Note**: If you're packaging for Windows (`win32`) on a non-Windows OS, you will need to have WINE installed.

## How to SASS

Add SASS code to the file components.scss

### Compile
On the command line:
`npm run compile:sass`

And if you want to see your sass on your web browser, in another terminal tab:
`live-server`
