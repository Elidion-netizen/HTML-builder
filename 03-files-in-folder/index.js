const fs = require('node:fs/promises');
const path = require('node:path');

async function readFilesInDirectory() {
  const directoryPath = path.join(__dirname, 'secret-folder');

  try {
    await fs.access(directoryPath);

    const files = await fs.readdir(directoryPath);
    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const fileStats = await fs.stat(filePath);
      if (!fileStats.isFile()) continue;
      const fileName = path.basename(file, path.extname(file));
      const fileExtension = path.extname(file).slice(1) || 'no extension';
      const fileSizeKB = fileStats.size / 1024;
      console.log(
        `${fileName} - ${fileExtension} - ${fileSizeKB.toFixed(3)} KB`,
      );
    }
  } catch (err) {
    console.error(err);
  }
}

readFilesInDirectory();
