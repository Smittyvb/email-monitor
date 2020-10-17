exports.register = function() { this.register_hook("rcpt", "emonprercpt"); };

exports.emonprercpt = function (next, connection, params) {
    connection.notes.quarantine = 1;
    next();
};
