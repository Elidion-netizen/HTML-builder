const fs = require('node:fs/promises');
const path = require('node:path');
const { copyFolder } = require('../04-copy-directory/index');
const { compareStyles } = require('../05-merge-styles/index');

const componentsDir = path.join(__dirname, 'components');
const templateFile = path.join(__dirname, 'template.html');
const distDir = path.join(__dirname, 'project-dist');
const outputPath = path.join(distDir, 'style.css');
const inputPath = path.join(__dirname, 'styles')

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
compareStyles(inputPath, outputPath);
templateBuild();
