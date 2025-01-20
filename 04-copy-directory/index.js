const fs = require('node:fs/promises');
const path = require('node:path');

async function copyFolder(src, dest) {
  try {
    await fs.access(dest);
    await fs.rmdir(dest, { recursive: true });
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
    console.log(`Folder copied from ${src} to ${dest}`);
  } catch (err) {
    console.error(`Error copying folder: ${err}`);
  }
}

copyFolder(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
