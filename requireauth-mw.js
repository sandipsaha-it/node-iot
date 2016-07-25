module.exports = function(db) {
    return {
        requires: function(req, resp, next) {
            var tokenHeader = req.get('AUTH');
            console.log("received token" + tokenHeader);
            /// add the logic of finding the hash of the token is valid or not based on DB
            db.token.findHashedToken(tokenHeader).
            then(function(token) {
                        req.token = token;
                        console.log("token---> " + tokenHeader);
                        db.user.findByToken(tokenHeader).
                        then(
                            function(user) {
                                req.user = user;
                                next();
                            },
                            function(error) {
                                console.log("Not getting the user using the token " + token);
                                resp.status(401).send();
                            }
                        )
                    },
                    function(error) {
                        resp.status(401).send();
                    })
                .catch(function(error) {
                    console.log("ERROR REPORTED");
                    resp.status(500).send();
                })
        }
    }
}