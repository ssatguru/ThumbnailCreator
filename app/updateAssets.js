/**
Takes one args


path - the path to be scanned for file

reads the path to a get a list of files

for each file it create a folder with that filename

if the filename is like abc.obj.png in other words has three parts
it renames that as  thumbnail.png

copies the file to the new folder

*/
let fs = require("fs");

let path = process.argv[2];

function printDir(path) {
  let items = fs.readdirSync(path);
  let last = items.length - 1;
  let line = "";
  for (let i = 0; i < items.length; i++) {
    let p = path + "/" + items[i];
    let stats = fs.statSync(p);
    if (stats.isFile()) {
      let fpart = items[i].split(".");
      let fname = fpart[0];
      console.log(fname);
      let np = "";
      fs.mkdirSync(path + "/" + fname, { recursive: true });
      if (fpart.length === 3) {
        np = path + "/" + fname + "/" + "thumbnail.png";
      } else {
        np = path + "/" + fname + "/" + items[i];
      }
      fs.renameSync(p, np);
    }
  }
}

printDir(path);
