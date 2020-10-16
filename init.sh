rm -rf harakaconf
mkdir harakaconf
yarn run haraka -i harakaconf
cp harakaplugins harakaconf/config/plugins
cp harakasmtp.ini harakaconf/config/smtp.ini