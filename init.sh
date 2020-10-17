rm -rf harakaconf
mkdir harakaconf
yarn run haraka -i harakaconf
cp harakaplugins harakaconf/config/plugins
cp harakasmtp.ini harakaconf/config/smtp.ini
cp harakaquarantine.ini harakaconf/config/quarantine.ini
cp harakahost_list_regex harakaconf/config/host_list_regex
cp haraka-emonprercpt.js harakaconf/plugins/emonprercpt.js
