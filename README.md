# email-monitor
Checks for email outages: whenever email-monitor sends you an email, your systems reply back with the original message and some metadata. email-monitor then tells you whenever there is an email outage. see https://doc.bmndr.com/upbuddy

## Usage
Make sure `/etc/hostname` is a domain that is publicly reachable on the Internet and points to the server hosting this. Also make your ISP doesn't block inbound or outbound traffic on port 25.

```bash
yarn
cp config.example.js config.js
# modify config.js...
./init.sh
sudo yarn emailserv
```

That starts the email server. Next start the part that interacts with the mail server in another terminal:

```bash
cd src
node index.js
```