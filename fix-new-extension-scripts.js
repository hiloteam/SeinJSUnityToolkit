/**
 * Fix component script missing error from old version to v1.0.0
 */

const fs = require('fs');
const path = require('path');

// [old, new]
const GUIDS = [
  ['cc9e06ce6d1164ae3acb4cc703aeeb56', '2c9c2a060d5234abf96a35acd112c9b0'],
  ['ec7c6c61c49e041c8a6a2df1a5f8efd5', '579c29830ece94d37a6a5d94c47bfb8d'],
  ['6c530171abc834ce28c307dc2f6f1629', '926a0cc730444472c915c2c45ef8b174'],
  ['b54f8a870e21f4012b9b7e61e683a7c6', '21321c3ef2c784442ab0a7e04a505eac'],
  ['02952fecf0ffd4fa2ad0ca26893677f1', '9d2d3424d88d74f258cbbf455af5aaa2'],
  ['01b50a75b58934dddafb6c08bc2a363a', '02f9bf28e1f504983ac96821296a22a4']
];

function walk(root, callback) {
  fs.readdir(root, (err, items) => {
    items.forEach((item) => {
      let itemPath = path.join(root, item);
      fs.stat(itemPath, (e, stats) => {
        if (stats.isDirectory()) {
          // if so walk that too, by calling this
          // method recursively
          walk(itemPath, callback);
        } else {
          callback(itemPath);
        }
      });
    });
  });
};

walk('./Assets', fp => {
  if (path.extname(fp) !== '.prefab') {
    return;
  }

  let content = fs.readFileSync(fp, {encoding: 'utf8'});
  GUIDS.forEach(g => {
    content = content.replace(new RegExp(g[0], 'g'), g[1]);
  });

  fs.writeFileSync(fp, content);
});
