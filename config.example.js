module.exports = {
    // name displayed
    name: "Upbuddy",
    // contact email
    contact: "me@smitop.com",
    // checks to perform:
    checks: [
        {
            to: "upbuddy@smitop.com",
            interval: 10 * 60 * 1000, // every 10 minutes
        }
    ]
};
