const fs = require('fs');
const path = require('path');

/**
 * Look ma, it's cp -R.
 * @param {string} src  The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 */
function copyDirectorySync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.lstatSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function (childItemName) {
      copyDirectorySync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

const CACHE_DIR = './.telephonist_cache/backup';

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

const LOCALES_FOLDER = path.join(CACHE_DIR, `locales${Math.floor(Date.now())}`);

copyDirectorySync('./locales', LOCALES_FOLDER);
