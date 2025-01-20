const fs = require('node:fs');
const path = require('node:path');
const file = path.join('01-read-file', 'text.txt');
const reader = fs.createReadStream(path.resolve(file), { highWaterMark: 8 });
reader.on('error', (err) => {
  console.error('Error:', err);
});
reader.on('data', (chunk) => process.stdout.write(chunk.toString()));
