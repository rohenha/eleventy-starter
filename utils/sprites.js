import fs from 'fs'
import path from 'path'
import SVGSpriter from 'svg-sprite'

const config = {
  sprite: {
    input: 'sources/sprite',
    output: 'snippets/organisms/',
    file: 'sprite.twig',
    name: (id) => `icon-${id}`,
  },
}

const files = fs.readdirSync(config.sprite.input).filter(file => file.endsWith('.svg'));

const sprite = SVGSpriter({
  mode: {
    symbol: true,
    inline: true
  },
  svg: { // General options for created SVG files
    xmlDeclaration: false, // Add XML declaration to SVG sprite
    doctypeDeclaration: false, // Add DOCTYPE declaration to SVG sprite
    dimensionAttributes: false, // Width and height attributes on the sprite
    rootAttributes: {
      style: 'position:absolute; top:0; left:0; width:0; height:0;'
    }
  },
});

// Parcourez chaque fichier SVG et ajoutez-le au sprite
files.forEach((file) => {
  const filePath = path.join(config.sprite.input, file);
  const svg = fs.readFileSync(filePath, 'utf8');
  const id = config.sprite.name(path.parse(file).name); // Utilisez le nom de fichier comme ID
  sprite.add(id, null, svg);
});

sprite.compile((error, result) => {
  for (const mode of Object.values(result)) {
      for (const resource of Object.values(mode)) {
          fs.mkdirSync(config.sprite.output, { recursive: true });
          fs.writeFileSync(config.sprite.output + config.sprite.file, resource.contents);
      }
  }
});

// Enregistrez le sprite dans un fichier de sortie
// fs.writeFileSync(config.sprite.output, sprite.toString());

console.log(`Sprite SVG généré avec succès : ${config.sprite.output + config.sprite.file}`);
