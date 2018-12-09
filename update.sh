git fetch origin master
git reset --hard origin/master
chmod +x main.py
systemctl stop monitor.service
systemctl daemon-reload
systemctl start monitor.service