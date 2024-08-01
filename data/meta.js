export default () => {
  console.log(process.env.ELEVENTY_URL);
  return {
    url: process.env.ELEVENTY_RUN_MODE == "serve" ? "http://localhost:8080" : process.env.ELEVENTY_URL,
    lang: "fr",
    locale: "fr_FR",
    author: "Romain Breton",
    seoIndexing: "index, follow",
    title: "Eleventy Plus",
    description: "An Eleventy 3 Starter Project with Vite and Twig",
    ogTitle: "",
    ogDescription: "",
    ogCover: "/assets/images/jul.png"
  }
}
