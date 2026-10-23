# minicraft

![Screenshot](https://l3p3.de/media/minicraft1.png)

Minecraft, but in JavaScript, with raymarching, without GPU.

[>>> START MINICRAFT <<<](https://l3p3.de/minicraft)

[How to use](https://github.com/L3P3/minicraft/wiki)

[How it works](docs/README.md)

## How to run locally

I highly recommend using Visual Studio Code and the extension "Live Server". Start it via "Go Live" and open "http://localhost:5500/app-dev.html" to see the result.

If that does not work, you may also once do `sudo apt install esbuild`, then run `npm start` and click the link and open `app-dev.html`.

A temporary http server is only needed because `import` statements are not allowed in `file://` protocol.

## My tools

- Browser + DevTools for testing and debugging
- [code-server](https://github.com/cdr/code-server) for development on any device
- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for developer preview
- [lui](https://github.com/L3P3/lui) for GUI
- [Minecraft-Font](https://github.com/IdreesInc/Minecraft-Font)
- [Closure Compiler](https://github.com/google/closure-compiler) for packing JS
- [bun](https://bun.sh) for packing CSS
- [GitHub Actions](https://github.com/features/actions) for automatic building
- [jsDelivr](https://www.jsdelivr.com) for distribution
- [GitHub Copilot](https://code.visualstudio.com/docs/agents/overview) sometimes
- [GitHub](https://github.com) for everything else

## Contribution

I am really happy to answer any questions or getting any kind of feedback. Feel free to open issues or suggest changes by opening a pull request!

## License

Just ZLib license, I do not care too much about it.

Heavily inspired by and somewhat based on the work of [@xNotch](https://github.com/xNotch).

This game uses slightly modified surface artwork from Minecraft, which is of course owned by Microsoft. Since this is a purely educational project, I deem this fair use.
