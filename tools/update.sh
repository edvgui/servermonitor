/etc/init.d/servermonitor stop
git fetch origin master
git reset --hard origin/master
chmod +x main.py
chmod +x tools/update.sh
/etc/init.d/servermonitor start