module.exports = {
    // name displayed
    name: "Upbuddy",
    // contact email
    contact: "me@smitop.com",
    // ways of sending email (one will be randomly selected each time)
    sendingMethods: [
        {
            id: "smtp"
        }
    ],
    // way of receiving email, uncomment exactly one:

    // NFSN webhooks:
    // 1. Go to https://members.nearlyfreespeech.net/
    // 2. Manage the email
    // 3. Add a forwarding address for x@example.com, going to https://backend.example.com/nfsn
    // receivingMethod: {
    //     id: "nfsn",
    // }
};
