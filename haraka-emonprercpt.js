exports.register = function() { this.register_hook("queue", "emonprercpt"); };

exports.emonprercpt = function (next, connection, params) {
    if (!connection.relaying) {
        connection.notes.quarantine = 1;
        connection.notes.quarantine_action = [ OK, "Saved email to disk" ];
    }
    next();
};
