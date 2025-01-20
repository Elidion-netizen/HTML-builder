const fs = require('fs/promises');
const path = require('path');

async function compareStyles() {
  let fileContent = '';
  const entries = await fs.readdir(path.join(__dirname, 'styles'));
  const outputPath = path.join(__dirname, 'project-dist', 'bundle.css');

  await Promise.all(
    entries.map(async (file) => {
      const filePath = path.join(__dirname, 'styles', file);
      if (path.extname(file) === '.css') {
        const data = await fs.readFile(filePath, 'utf8');
        fileContent += data + '\n';
      }
    }),
  );

  await fs.writeFile(outputPath, fileContent, 'utf8');
  console.log('All files have been concatenated into bundle.css');
}

compareStyles();
