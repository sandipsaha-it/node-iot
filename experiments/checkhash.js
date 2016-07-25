var bcrypt = require('bcrypt-nodejs');
var hash = bcrypt.hashSync("bacon");
var _promise = require('bluebird');

console.log(hash);
console.log(bcrypt.compareSync("bacon", hash)); // true
console.log(bcrypt.compareSync("veggies", hash)); // false




bcrypt.compare("asdasd", hash, function (err, res) {
    if (res) {
        console.log(" - " + res)

    }
    
    else if (err) {
        console.log("--"+err)

    }
    else {
        console.log(" - " + res)
    }
    // res == true
});

var promiseComp = _promise.promisify(require('bcrypt-nodejs').compare);
promiseComp("bacon", hash).then(function (res) { console.log(res) });
