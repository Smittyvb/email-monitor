# email-monitor
Checks for email outages: whenever email-monitor sends you an email, your systems reply back with the original message and some metadata. email-monitor then tells you whenever there is an email outage. see https://doc.bmndr.com/upbuddy

## Usage
```
yarn
cp config.example.js config.js
# modify config.js...
./init.sh
# modify harakaconf/config/smtp.ini...
# change the port from 25 to 5870
node index.js
```
