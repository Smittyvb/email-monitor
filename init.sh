rm -rf harakaconf
mkdir harakaconf
yarn run haraka -i harakaconf
cp harakaplugins harakaconf/config/plugins
cp harakasmtp.ini harakaconf/config/smtp.ini
cp harakaquarantine.ini harakaconf/config/quarantine.ini
cp harakahost_list_regex harakaconf/config/host_list_regex
cp haraka-emonprercpt.js harakaconf/plugins/emonprercpt.js
HARAKA_PW=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
echo $HARAKA_PW > harakapw.txt
echo "[core]
methods=PLAIN,LOGIN

[users]
emon=$HARAKA_PW" > harakaconf/config/auth_flat_file.ini
