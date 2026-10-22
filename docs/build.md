# Build and run

For ordinary development, the README recommends opening `app-dev.html` through a local HTTP server such as VS Code Live Server. ES module imports do not work from `file://`. The optional `npm start` script runs esbuild's server, but esbuild is not listed in `package.json`; the README suggests installing it separately if needed.

Building is mainly useful for mirroring the hosted site. The root README documents:

```sh
bun install
bun run build.js
```

The script targets Linux and uses Bun, Google Closure Compiler, and Bun's CSS bundler. Open `app-prod.html` through an HTTP server to test the generated output. The HTML expects the lui runtime under `node_modules/lui/src/luirt.js` and English production JS at `dist/app-en.js`.

## What the build does

`build.js` generates locale constants from `locales/*.csv`, writes build-specific values to `src/etc/env.js`, then compiles `src/app.js` as the entry point. Closure Compiler first performs advanced compilation/dependency pruning and then emits final bundles/source maps. Bun builds and minifies `src/app.css`.

The normal local build makes English variants: standard, legacy, and SSR. The SSR variant produces HTML with `lui-ssr`; the legacy JS target is ECMAScript 3, while the standard output targets ECMAScript 6 strict mode. On CI, a build on `master` expands language outputs from the CSV files; non-master CI runs use Closure's checks-only mode. The workflow builds on Ubuntu and deploys generated artifacts to the `dist` branch only from master; see [`.github/workflows/build.yml`](../.github/workflows/build.yml).

For local builds the script restores development values (`VERSION`, API paths, debug mode) and restores the lui type annotation and English locale after compilation. Generated `dist/` files are build output, not source-of-truth; edit `src/`, `locales/`, and `build.js` instead.

The package scripts are in [`package.json`](../package.json), build configuration in [`build.js`](../build.js), HTML entry points in [`app-dev.html`](../app-dev.html) and [`app-prod.html`](../app-prod.html). The exact currently checked-in `src/etc/env.js` values are development defaults.
