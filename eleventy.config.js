import EleventyVitePlugin from '@11ty/eleventy-plugin-vite'
import EleventyPluginTwig from '@factorial/eleventy-plugin-twig'

import Twig from 'twig'

import { ViteMinifyPlugin } from 'vite-plugin-minify'
// import brotli from 'rollup-plugin-brotli'
import sassGlobImports from 'vite-plugin-sass-glob-import'
import { visualizer } from 'rollup-plugin-visualizer'
import rollupPluginCritical from 'rollup-plugin-critical'

import filters from './utils/filters.js'
import transforms from './utils/transforms.js'
import shortcodes from './utils/shortcodes.js'

import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

/* ─────────────────────────────────────────────────────── */

const filename = fileURLToPath(import.meta.url)
const globDirname = dirname(filename)
const folder = path.resolve(globDirname, 'sources/')

export default function (eleventyConfig) {
	// eleventyConfig.setServerPassthroughCopyBehavior('copy');
	// eleventyConfig.addPassthroughCopy("public");

	// Plugins
	eleventyConfig.addPlugin(EleventyVitePlugin, {
		tempFolderName: '.11ty-vite', // Default name of the temp folder

		// Vite options (equal to vite.config.js inside project root)
		viteOptions: {
			resolve: {
				alias: {
					'@styles/': `${folder}/styles/`,
					'@scripts/': `${folder}/scripts/`,
				},
			},
			publicDir: 'public',
			clearScreen: false,
			server: {
				mode: 'development',
				middlewareMode: true,
			},
			appType: 'custom',
			build: {
				mode: 'production',
				emptyOutDir: true,
				sourcemap: false,
				manifest: false,
				rollupOptions: {
					output: {
						entryFileNames: 'assets/[name].[hash].js',
						chunkFileNames: 'assets/[name]-[hash].js',
						assetFileNames: (assetInfo) => {
							if (assetInfo.name.endsWith('.css')) {
								return 'assets/[name].[hash].[ext]'
							}

							return 'assets/images/[name].[ext]'
						}
					},
				},
			},
			plugins: [
				ViteMinifyPlugin({}),
				sassGlobImports(),
				// brotli(),
				visualizer({
					gzipSize: true,
					brotliSize: true,
					open: false,
					template: 'treemap',
				}),
				rollupPluginCritical({
					criticalUrl: './_dist/',
					criticalBase: './_dist/',
					criticalPages: [
						{ uri: 'index.html', template: 'index' },
						{ uri: 'about/index.html', template: 'about/index' },
						// { uri: '404.html', template: '404' },
					],
					criticalConfig: {
						inline: true,
						dimensions: [
							{ height: 900, width: 375},
							{ height: 720, width: 1280 },
							{ height: 1080, width: 1920 }
						],
						penthouse: {
							forceInclude: ['.fonts-loaded-1 body', '.fonts-loaded-2 body'],
						}
					}
				}),
			]
		}
	})

	eleventyConfig.addPlugin(EleventyPluginTwig, {
		twig: {
      namespaces: {
        layouts: "layouts",
        snippets: "snippets"
      }
    },
    dir: {
			input: 'views',
			// better not use "public" as the name of the output folder (see above...)
			output: '_dist',
			includes: '../snippets',
			layouts: '../layouts',
			data: '../data'
    }
	})

	// Filters
	Object.keys(filters).forEach((filterName) => {
		Twig.extendFilter(filterName, filters[filterName])
	})

	// Transforms
	Object.keys(transforms).forEach((transformName) => {
		eleventyConfig.addTransform(transformName, transforms[transformName])
	})

	// Shortcodes
	Object.keys(shortcodes).forEach((shortcodeName) => {
		Twig.extendFunction(shortcodeName, shortcodes[shortcodeName])
	})

	// Layouts
	eleventyConfig.addLayoutAlias('base', 'base.twig')

	// Copy/pass-through files
	eleventyConfig.addPassthroughCopy({
		'sources/styles': 'assets',
		'sources/scripts': 'assets',
		// 'sources/images': 'assets/images',
		'public': 'public',
	})

	return {
		templateFormats: ['twig'],
		htmlTemplateEngine: 'twig',
		passthroughFileCopy: true,
		dir: {
			input: 'views',
			// better not use "public" as the name of the output folder (see above...)
			output: '_dist',
			includes: '../snippets',
			layouts: '../layouts',
			data: '../data'
		}
	}
}
