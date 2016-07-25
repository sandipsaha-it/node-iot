var bcrypt = require('bcrypt-nodejs');
var _ = require("underscore");
var crypto = require("crypto-js");
var jwt = require("jsonwebtoken");

// To make a to be used  by  Sequelize.import() it must satisfy the requirement of
// Exporting a funciton as follows the sunction takes two args sequelize nad DataTypes
module.exports = function (sequelize, DataTypes) {

    // Defining the 'user' model
    // Model is defined using sequelize.define which takes the Model name as the first argument
    var USER = sequelize.define('user',
        // Column definition might be the second argument
        {
            email: {
                // DATA TYPE of the column is set as STRING
                type: DataTypes.STRING,
                // makes the column NOT NULLABLE
                allowNull: false,
                // Specifying Unique constraint on the column
                unique: true,
                // we can specify the validations for a column
                validate: {
                    // Sequelize has this validation for email fields
                    isEmail: true
                }
            },
            password_hash:
            {
                type: DataTypes.STRING
            },
            salt:
            {
                type: DataTypes.STRING
            },
            password: {
                type: DataTypes.VIRTUAL,
                allowNull: false,
                set: function (val) {
                    this.setDataValue('password', val); // Remember to set the data value, otherwise it won't be validated
                    this.setDataValue('salt', bcrypt.genSaltSync(10));
                    this.setDataValue('password_hash', bcrypt.hashSync(val, this.salt));
                },
                validate: {
                    // Sequelize has this validation for max and min size of a column
                    len: [7, 100]
                }
            }
        },
        // Third arg can be a set of hooks
        // adding hooks for sequelize
        {
            hooks: {
                beforeValidate: function (user, options) {
                    if (typeof user.email === 'string') {
                        user.email = user.email.toLowerCase();
                    }
                }
            },
            // instance methods are use full when the caller is dealing with User Instances
            instanceMethods: {
                toBareUser: function () {
                    var userJson = this.toJSON();
                    return _.pick(userJson, 'id', 'email');
                },
                // generateJwtToken will generate a JWT token by encrypting some key information 
                // related to the user.One of the key attributes of the USER will be used ( I am using the ID field)
                // 
                // 'type' could be a predefined value ( here I am using 'Authentication)

                generateJwtToken: function (type) {

                    if (!_.isString(type)) {
                        return undefined;
                    }
                    try {
                        // creating the JSON String data that I want to encrypt in the json web token
                        var userJson = JSON.stringify({ id: this.id, type: type });
                        // returns the encrypted sting using Crypto
                        var encryptedData = crypto.AES.encrypt(userJson, 'cryptotokentodo#123*&').toString();
                        var token = jwt.sign({ token: encryptedData }, 'jwttokentodo#123*&');
                        console.log("generated ["+token+"]");
                        return token;
                    }
                    catch (e) {
                        return undefined;
                    }

                }
            }
            ,
            classMethods: {
                authenticate: function (body) {
                    return new Promise(function (resolve, reject) {

                        USER.findOne({
                            where: { email: body.email }
                        }).then(
                            function (user) {
                                if (user) {
                                    if (bcrypt.compareSync(body.password, user.getDataValue('password_hash'))) {
                                        resolve(user)
                                    }
                                    else {
                                        reject()
                                    }
                                }
                                else { reject() }
                            },
                            function (err) { reject() }
                            )

                    })
                },
                findByToken: function (token) {
                    return new Promise(function (resolve, reject) {
                        try {
                            var jwtDecoded = jwt.verify(token, 'jwttokentodo#123*&');
                            var bytes = crypto.AES.decrypt(jwtDecoded.token, 'cryptotokentodo#123*&');
                            var tokenData = JSON.parse(bytes.toString(crypto.enc.Utf8));
                            USER.findById(tokenData.id).then(
                                function (user) {
                                    if (user) {
                                        resolve(user)
                                    }
                                    else {
                                        console.log("user Could not be found");
                                        reject();
                                    }
                                },
                                function (err) {
                                    resject(err);
                                }
                            )

                        }
                        catch (ex)
                        {
                            console.log("----->>>>>" + ex, ex.stack.split("\n"));
                            
                            reject(ex);
                        }

                    })
                }
            }
        }
    );
    return USER;
}