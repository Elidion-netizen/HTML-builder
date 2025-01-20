const fs = require('node:fs/promises');
const path = require('node:path');

const componentsDir = path.join(__dirname, 'components');
const templateFile = path.join(__dirname, 'template.html');
const distDir = path.join(__dirname, 'project-dist');

async function copyFolder(src, dest) {
  try {
    await fs.access(dest);
    await fs.rm(dest, { recursive: true });
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`Error checking or removing destination folder: ${err}`);
      return;
    }
  }
  try {
    const entries = await fs.readdir(src, { withFileTypes: true });
    await fs.mkdir(dest, { recursive: true });
    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await copyFolder(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    console.error(`Error copying folder: ${err}`);
  }
}

async function compareStyles() {
  let fileContent = '';
  const entries = await fs.readdir(path.join(__dirname, 'styles'));
  const outputPath = path.join(distDir, 'style.css');

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
}
async function templateBuild() {
  const templateContent = await fs.readFile(templateFile, { encoding: 'utf8' });
  const componentFiles = await fs.readdir(path.join(componentsDir));
  let newIndexContent = templateContent;
  for (const component of componentFiles) {
    const componentName = path.basename(component, path.extname(component));
    const componentContent = await fs.readFile(
      path.join(componentsDir, component),
      'utf-8',
    );
    const tagRegex = new RegExp(`{{${componentName}}}`, 'g');
    newIndexContent = newIndexContent.replace(tagRegex, componentContent);
  }
  await fs.writeFile(path.join(distDir, 'index.html'), newIndexContent);
}

copyFolder(path.join(__dirname, 'assets'), path.join(distDir, 'assets'));
compareStyles();
templateBuild();
