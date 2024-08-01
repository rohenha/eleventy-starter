// import Image from "@11ty/eleventy-img"

export default {
	img: (src, paramsUser = {}) => {
		const paramsDefault = {
			class: 'a-image',
			sizes: '100vw',
			// loading: "lazy",
			// decoding: "async",
		}
		const params = Object.assign(paramsDefault, paramsUser)

		// Generate attributes
		let additionalAttributes = ''
    Object.keys(params).forEach((param) => {
			if (param !== '_keys') {
				additionalAttributes += `${param}="${params[param]}" `
			}
    })
		return `<img src="../sources/images/${src}" ${additionalAttributes}>`
	}
  // img: async function (src, paramsUser = {}) {
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
	// 	Image(src, options)
	// 	const metadata = Image.statsSync(src, options)

	// 	// Generate attributes
	// 	let additionalAttributes = ''
  //   Object.keys(params).forEach((param) => {
	// 		if (param !== '_keys') {
	// 			additionalAttributes += `${param}="${params[param]}" `
	// 		}
  //   })

	// 	// Generate picture element
	// 	const defaultFormat = metadata.jpeg ? 'jpeg' : 'png';
	// 	const lowsrc = metadata[defaultFormat][0];
	// 	const highsrc = metadata[defaultFormat][metadata[defaultFormat].length - 1];

	// 	const sourceElements = Object.values(metadata).reduce((acc, imageFormat) => {
	// 		return acc + `<source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map((entry) => entry.srcset).join(", ")}">\n`
	// 	}, '')

	// 	return `<picture>
	// 		${sourceElements}
	// 		<img src="${lowsrc.url}" width="${highsrc.width}" height="${highsrc.height}" ${additionalAttributes}>
	// 	</picture>`;
  // },
}
