module.exports = function (db) {
    return {
        requires: function (req, resp, next) {
            var token = req.get('AUTH');
            db.user.findByToken(token).then(
                function (user) {
                    req.user = user;
                    next();
                },
                function (error) {
                    console.log("Not getting the user using the token " + token);
                    resp.status(401).send();
                }
            )
                .catch(function (error) {
                    resp.status(500).send();
                })
        }
    }
}