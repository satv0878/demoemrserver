const expressdemoemrserver = require('.') /* the current working directory so that means main.js because of package.json */

console.log(require('.')(process.argv[2]))