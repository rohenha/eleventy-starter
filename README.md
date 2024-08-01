# Elevitwig


## Features
- Eleventy 3.0.0-beta.1 [@11ty/eleventy](https://github.com/11ty/eleventy)
- Vite 5.3 [@11ty/eleventy-plugin-vite](https://github.com/11ty/eleventy-plugin-vite/tree/alpha)
- Twig templating 0.1.3 [@factorial/eleventy-plugin-twig](https://github.com/factorial-io/eleventy-plugin-twig)
- Twig JS 1.17
- Dotenv support [dotenv](https://github.com/motdotla/dotenv)
- HTML/CSS/JS minification [vite-plugin-minify](https://github.com/zhuweiyou/vite-plugin-minify)
- CSS/JS minification with Vite JS
- CSS/SASS glob import [vite-plugin-sass-glob-import](https://github.com/cmalven/vite-plugin-sass-glob-import)
- Critical CSS with [rollup-plugin-critical](https://github.com/nystudio107/rollup-plugin-critical)
- CSS/Sass post-processing with PostCSS incl. [@fullhuman/postcss-purgecss](https://github.com/FullHuman/postcss-purgecss), [autoprefixer](https://github.com/postcss/autoprefixer), [postcss-combine-media-query](https://github.com/SassNinja/postcss-combine-media-query), [postcss-inline-svg](https://github.com/TrySound/postcss-inline-svg), [postcss-sort-media-queries](https://github.com/yunusga/postcss-sort-media-queries)
- Images optimisation with srcsets generations [@11ty/eleventy-img](https://github.com/11ty/eleventy-img)


## Dev 
Dev mode
```shell
npm run dev
```
Prod mode
```shell
npm run build
```
Clean prod dir
```shell
npm run clean
```
Benchmark for build process
```shell
npm run bench
```

## Notes
In dev mode a bug occurs for now, you can't exit process. To do it, CTRL+C as usual + kill terminal


## Data 
### Data global
in `data/meta.js`
### Data to override per page
---
template: home
templateClass: home
priority: 1
title: Page d'accueil
description: description
ogTitle: title for social medias
ogDescription: description for social medias
ogCover: /assets/images/example.png
---
