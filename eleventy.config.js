import EleventyVitePlugin from '@11ty/eleventy-plugin-vite'
import EleventyPluginTwig from '@factorial/eleventy-plugin-twig'

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
	eleventyConfig.setServerPassthroughCopyBehavior('copy');
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
						chunkFileNames: 'assets/chunk-[hash].js',
						assetFileNames: 'assets/[name].[hash].[ext]',
					},
				},
			}
		}
	})

	eleventyConfig.addPlugin(EleventyPluginTwig, {
		twig: {
      namespaces: {
        layouts: "layouts",
        snippets: "snippets"
      }
    },
    // mixManifest: "mix-manifest.json",
    // assets: {
    //   root: "public",
    //   base: "assets",
    //   css: "styles",
    //   js: "scripts",
    //   images: "images",
    // },
		images: {
			widths: [300, 600, 900],
			formats: ["webp", "avif", "jpeg"],
			additionalAttributes: "",
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
		eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName])
	})

	// Layouts
	eleventyConfig.addLayoutAlias('base', 'base.twig')

	// Copy/pass-through files
	eleventyConfig.addPassthroughCopy({
		'sources/styles': 'assets',
		'sources/scripts': 'assets',
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
