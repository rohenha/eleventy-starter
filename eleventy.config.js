// const EleventyVitePlugin = require('@11ty/eleventy-plugin-vite')

// const filters = require('./utils/filters.js')
// const transforms = require('./utils/transforms.js')
// const shortcodes = require('./utils/shortcodes.js')

import EleventyVitePlugin from '@11ty/eleventy-plugin-vite'

import filters from './utils/filters.js'
import transforms from './utils/transforms.js'
import shortcodes from './utils/shortcodes.js'

export default function (eleventyConfig) {
	eleventyConfig.setServerPassthroughCopyBehavior('copy');
	eleventyConfig.addPassthroughCopy("public");

	// Plugins
	eleventyConfig.addPlugin(EleventyVitePlugin, {
		tempFolderName: '.11ty-vite', // Default name of the temp folder

		// Vite options (equal to vite.config.js inside project root)
		viteOptions: {
			// resolve: {
			// 	alias: {
			// 		'@styles/': `${folder}/styles/`,
			// 		'@scripts/': `${folder}/scripts/`,
			// 	},
			// },
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
				manifest: true,
				rollupOptions: {
					output: {
						entryFileNames: 'assets/[name].[hash].js',
						chunkFileNames: 'assets/chunk-[hash].js',
						assetFileNames: 'assets/[name].[hash].[ext]',
					},
				},
			}
		}
	})

	// Filters
	Object.keys(filters).forEach((filterName) => {
		eleventyConfig.addFilter(filterName, filters[filterName])
	})

	// Transforms
	Object.keys(transforms).forEach((transformName) => {
		eleventyConfig.addTransform(transformName, transforms[transformName])
	})

	// Shortcodes
	Object.keys(shortcodes).forEach((shortcodeName) => {
		eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName])
	})

	// Layouts
	eleventyConfig.addLayoutAlias('base', 'base.njk')

	// Copy/pass-through files
	eleventyConfig.addPassthroughCopy({
		'sources/styles': 'assets',
		'sources/scripts': 'assets',
	})

	return {
		templateFormats: ['njk'],
		htmlTemplateEngine: 'njk',
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
