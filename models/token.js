var crypto = require("crypto-js");
module.exports = function(sequelize, DataTypes) {
    var TOKEN = sequelize.define('token', {
            token: {
                type: DataTypes.VIRTUAL,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [1]
                },
                set: function(token) {
                    this.setDataValue('token', token); // Remember to set the data value, otherwise it won't be validated
                    this.setDataValue('token_hash', crypto.MD5(token).toString());
                }
            },
            token_hash: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        }, {
            classMethods: {
                findHashedToken: function(token) {
                    return new Promise(function(resolve, reject) {
                        var hashedToken = crypto.MD5(token).toString();
                        TOKEN.findOne({
                            where: {
                                token_hash: hashedToken
                            }
                        }).then(
                            function(res) {
                                if (res) {
                                    resolve(res);
                                } else {
                                    console.log("No valid token found in the header")
                                    reject();
                                }
                            },
                            function(err) {
                                reject(err);
                            }

                        )
                    });

                }

            }
        }


    );
    return TOKEN;
}