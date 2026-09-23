const fs = require('fs');
const path = require('path');
const https = require('https');

const fonts = [
  { id: 'sora', variants: ['regular', '600', '700', '800'] },
  { id: 'manrope', variants: ['regular', '500', '600', '700'] },
  { id: 'caveat', variants: ['600', '700'] }
];

const destDir = path.join(__dirname, 'public', 'assets', 'fonts');
const formats = ['woff2', 'woff', 'ttf', 'eot', 'svg'];
let cssContent = '/* FONTES LOCAIS */\n';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const font of fonts) {
    try {
      const res = await new Promise((resolve, reject) => {
        https.get(`https://gwfh.mranv.com/api/fonts/${font.id}?subsets=latin`, (response) => {
          let data = '';
          response.on('data', chunk => data += chunk);
          response.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
      });

      for (const variantId of font.variants) {
        const variant = res.variants.find(v => v.id === variantId);
        if (!variant) continue;

        cssContent += `\n/* ${font.id} - ${variantId} */\n@font-face {\n  font-family: '${res.family}';\n  font-style: ${variant.fontStyle};\n  font-weight: ${variant.fontWeight};\n`;
        
        let srcLines = [];
        srcLines.push(`  src: url('/assets/fonts/${font.id}-${variantId}.eot');`);
        
        let localSrc = `  src: local(''),\n       url('/assets/fonts/${font.id}-${variantId}.eot?#iefix') format('embedded-opentype'),\n`;
        localSrc += `       url('/assets/fonts/${font.id}-${variantId}.woff2') format('woff2'),\n`;
        localSrc += `       url('/assets/fonts/${font.id}-${variantId}.woff') format('woff'),\n`;
        localSrc += `       url('/assets/fonts/${font.id}-${variantId}.ttf') format('truetype'),\n`;
        localSrc += `       url('/assets/fonts/${font.id}-${variantId}.svg#${font.id}') format('svg');\n`;
        
        cssContent += srcLines.join('\n') + '\n' + localSrc + '}\n';

        for (const format of formats) {
          if (variant[format]) {
            const fileName = `${font.id}-${variantId}.${format}`;
            const filePath = path.join(destDir, fileName);
            console.log(`Downloading ${fileName}...`);
            await download(variant[format], filePath);
          }
        }
      }
    } catch (e) {
      console.error(`Failed to download ${font.id}:`, e);
    }
  }

  // Append font CSS to global.css
  const globalCssPath = path.join(__dirname, 'src', 'styles', 'global.css');
  fs.appendFileSync(globalCssPath, '\n\n' + cssContent);
  console.log('Fonts downloaded and CSS appended!');
}

run();
