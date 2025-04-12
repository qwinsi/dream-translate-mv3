# Dream Translator (Manifest V3)

This is a fork of [ryankeep/dream_translate](https://github.com/ryankeep/dream_translate) for support of Manifest V3.

## Limitations

The tremendous API changes from Manifest V2 to V3 have made it time-consuming to port the extension to V3. Currently, only part of translation and dictionary functions are ported completely, and the rest are unavailable. Ported functions include:

- Translation: Only supports Sogou. It won't work if you choose other translation services.
- Dictionary: Only supports Youdao. It won't work if you choose other dictionary services.

## Features

Along with the original features, this fork has added some new features:

- Support for dragging selected text to query.
- Normal color theme for popup window in websites with a dark color scheme. (e.g. GitHub in dark mode)
- Support for pressing `ESC` to close the popup window.
