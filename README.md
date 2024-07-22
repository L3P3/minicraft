# minicraft

![Screenshot](https://l3p3.de/media/minicraft1.png)

Minecraft, but based on ray tracing and written in JavaScript, following my own rules.

[>>> START MINICRAFT <<<](https://l3p3.de/minicraft)

[User manual](https://github.com/L3P3/minicraft/wiki)

Heavily inspired by and somewhat based on the work of [@xNotch](https://github.com/xNotch).

## TODOs

- [x] study computer science and math
- [x] steal idea from [@xNotch](https://github.com/xNotch)
- [x] proof of concept
- [x] tell everybody about this project
- [x] get rich
- [x] annoy everybody with this project
- [x] new file structure
- [x] basic component tree
- [x] basic models
- [x] basic rasterization
- [x] key handling
- [x] settings menu
- [x] comprehensive readme
- [x] solve wrong-fps issue
- [x] world/chunk/player model
- [x] actual raytracing
- [x] correct raytracing
- [x] production build
- [x] build/destroy
- [x] persistent user configuration
- [x] texturing
- [x] multiple chunks
- [x] load/save chunks
- [x] basic mobile view
- [x] chat/terminal
- [x] more blocks
- [x] higher world
- [x] inventory
- [x] gamemode
- [x] multiple worlds
- [x] download/upload worlds
- [ ] world edit
- [ ] multiplayer
- [ ] sound
- [ ] entity models
- [ ] collision
- [ ] good styled ui
- [ ] good mobile view
- [ ] migrate to typescript?
- [ ] support older browsers
- [ ] time of day
- [ ] sky elements
- [ ] non-cubic blocks
- [ ] visible entities
- [ ] particles
- [ ] multi-threading?
- [ ] use gpu?
- [ ] get a lawyer?

## How to use while developing

I highly recommend using Visual Studio Code and the extension "Live Server". Start it via "Go Live" and open "http://localhost:5500/app-dev.html" to see the result.

## Build instructions

After cloning, you need to run `npm install` once to install the build tools.

To bundle the app, run `npm run build`. The result will be put into the `/dist` directory and can be tested at "http://localhost:5500/app-prod.html".

## My tools

- Browser + DevTools for testing and debugging
- [code-server](https://github.com/cdr/code-server) for development on any device
- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for developer preview
- [lui](https://github.com/L3P3/lui) for GUI
- [Closure Compiler](https://github.com/google/closure-compiler) for packing JS
- [cssnano](https://cssnano.co) for packing CSS
- [GitHub Actions](https://github.com/features/actions) for automatic building
- [jsDelivr](https://www.jsdelivr.com) for distribution
- [GitHub](https://github.com) for everything else

## Contribution

I am really happy to answer any questions or getting any kind of feedback. Feel free to open issues or suggest changes by opening a pull request!

## License

Just ZLib license, I do not care too much about it.

This game includes slightly modified textures from Minecraft, which is of course owned by Microsoft. Since this is a purely educational project, I deem this fair use.
