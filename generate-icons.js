const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgString = `
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" rx="28" fill="#065fd4"/>
  <path d="M34 66 l20 20 l44 -44" fill="none" stroke="#ffffff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const sizes = [16, 48, 128];
const outputDir = path.join(__dirname, 'assets');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const baseImage = Buffer.from(svgString);

sizes.forEach(size => {
  sharp(baseImage)
    .resize(size, size)
    .png()
    .toFile(path.join(outputDir, `icon-${size}.png`))
    .then(info => console.log(`icon-${size}.png gerado com sucesso.`))
    .catch(err => console.error(err));
});