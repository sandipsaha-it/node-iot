var bcrypt = require('bcrypt-nodejs');
var hash = bcrypt.hashSync("bacon");

console.log(hash);
console.log(bcrypt.compareSync("bacon", hash)); // true
console.log(bcrypt.compareSync("veggies", hash)); // false


bcrypt.compare("asdasd", hash, function (err, res) {
    if (res) {
        console.log(res)

    }
    else if (err) {
        console.log(err)

    }
    // res == true
});