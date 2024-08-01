// import Image from "@11ty/eleventy-img"

export default {
  // imgtest: async function (src, paramsUser = {}) {
	// 	// Image generation options
	// 	const options = {
	// 		outputDir: '_dist/assets/images',
	// 		useCache: true,
	// 		urlPath: `assets/images`,
	// 		widths: [500, 768, 1024],
	// 		formats: ["webp", "auto"],
	// 		transformOnRequest: process.env.ELEVENTY_RUN_MODE === "serve"
	// 	}

	// 	// Image element attributes
	// 	const paramsDefault = {
	// 		class: 'a-image',
	// 		sizes: '100vw',
	// 	}
	// 	const params = Object.assign(paramsDefault, paramsUser)

	// 	// Generate image
	// 	const metadata = await Image(src, options)
	// 	// const metadata = Image.statsSync(src, options)

	// 	// Generate attributes
	// 	let additionalAttributes = ''
  //   Object.keys(params).forEach((param) => {
	// 		if (param !== '_keys') {
	// 			additionalAttributes += `${param}="${params[param]}" `
	// 		}
  //   })

  //   return Image.generateHTML(metadata, additionalAttributes)
  // },
}
