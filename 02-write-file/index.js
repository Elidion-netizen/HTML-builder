const fs = require('node:fs');
const readline = require('node:readline');
const path = require('node:path');

const file = path.join('02-write-file', 'text.txt');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const writeStream = fs.createWriteStream(path.resolve(file), { flags: 'a' });

fs.writeFile(path.resolve(file), '', (err) => {
  if (err) throw err;
  console.log('Enter text:');
});

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('Input finished');
    rl.close();
    writeStream.end();
  } else {
    writeStream.write(input + '\n', 'utf-8', (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      }
    });
  }
});

rl.on('SIGINT', () => {
  console.log('Input finished');
  rl.close();
  writeStream.end();
});
