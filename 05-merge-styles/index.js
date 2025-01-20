const fs = require('fs/promises');
const path = require('path');

const outputPath = path.join(__dirname, 'project-dist', 'bundle.css');
const inputPath = path.join(__dirname, 'styles');

async function compareStyles(inputPath, outputPath) {
  let fileContent = '';
  const entries = await fs.readdir(inputPath);

  await Promise.all(
    entries.map(async (file) => {
      const filePath = path.join(inputPath, file);
      if (path.extname(file) === '.css') {
        const data = await fs.readFile(filePath, 'utf8');
        fileContent += data + '\n';
      }
    }),
  );

  await fs.writeFile(outputPath, fileContent, 'utf8');
  console.log('All files have been concatenated into bundle.css');
}
if (require.main === module) {
  compareStyles(inputPath, outputPath);
}

module.exports = { compareStyles };
