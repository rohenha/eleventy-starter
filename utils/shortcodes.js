import Image from "@11ty/eleventy-img"

export default {
  img: function (src, params = {}) {
		const options = {
			outputDir: '_dist/assets/images',
			useCache: false,
			urlPath: `assets/images`,
			widths: [500, 768, 1024],
			formats: ["webp", "jpeg"],
			transformOnRequest: process.env.ELEVENTY_RUN_MODE === "serve"
		}

		Image(src, options)
		const metadata = Image.statsSync(src, options)

		let additionalAttributes = ''
    Object.keys(params).forEach((param) => {
			if (param !== '_keys') {
				additionalAttributes += `${param}="${params[param]}" `
			}
    })

		const lowsrc = metadata.jpeg[0];
		const highsrc = metadata.jpeg[metadata.jpeg.length - 1];

		const sourceElements = `${Object.values(metadata)
			.map((imageFormat) => {
				return `<source type="${imageFormat[0].sourceType}" srcset="${imageFormat
					.map((entry) => entry.srcset)
					.join(", ")}">`;
			})
			.join("\n")}`;

		const imageElement = `<img
			src="${lowsrc.url}"
			width="${highsrc.width}"
			height="${highsrc.height}"
			${additionalAttributes}>`;

		return `<picture>
			${sourceElements}
			${imageElement}
		</picture>`;
  },
}
