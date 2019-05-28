const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaginPath = path.resolve(__dirname,'contracts','Campaign.sol');
const source = fs.readFileSync(campaginPath, 'utf8');

const output = solc.compile(source,1).contracts;

// ensureDirSync() checks if the file exist in the directory or not and if not exist than creates one
fs.ensureDirSync(buildPath);


console.log(output);
for(let contract in output) {
let name = contract.replace(':', '');
  fs.outputJsonSync(
    path.resolve(buildPath, name + '.json'),
    output[contract]
  );
}
