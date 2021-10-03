/**
Takes three args

varName - variable name to use in the output file
path - the path to be scanned for file
fn - name of the output file

creates an array of items
if an item is a string then it is a file
if it is an object then it is a directory
the directory object contains
{
    "d": name of the directory
    "f" : an array of items (files and directories in that directory)
            [{"d":,"f:[]"},]
}

*/
let fs = require("fs");

let varName = process.argv[2];
let path = process.argv[3];
let fn = process.argv[4];

let _tab = "  ";
let first = true;
function printDir(path, tab) {
  let items = fs.readdirSync(path);
  let last = items.length - 1;
  let line = "";
  for (let i = 0; i < items.length; i++) {
    let p = path + "/" + items[i];
    let stats = fs.statSync(p);
    if (stats.isFile() && items[i].endsWith(".obj")) {
      if (first) {
        line = '"' + items[i] + '"';
        first = false;
      } else {
        line = ',"' + items[i] + '"';
      }
      stream.write(line + "\n");
    }
  }
}

//fs.unlinkSync(fn);
fs.writeFileSync(fn, varName + "=[" + "\n");
let stream = fs.createWriteStream(fn, { flags: "a" });
printDir(path, _tab);
stream.write("]");
stream.end();
