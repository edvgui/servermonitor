systemctl stop monitor.service
sleep 5
git fetch origin master
git reset --hard origin/master
chmod +x main.py
systemctl daemon-reload
systemctl start monitor.service