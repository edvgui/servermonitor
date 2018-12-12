import time
import psutil
import socket
import os
from urllib.request import urlopen


time_format = "%Y-%m-%d %H:%M:%S"


class Computer:

    ref_realcores = u'realcores'
    ref_virtualcores = u'virtualcores'
    ref_publicip = u'publicip'
    ref_localip = u'localip'
    ref_cpuload = u'cpuload'
    ref_freemem = u'freememory'
    ref_totmem = u'totalmemory'
    ref_freestorage = u'freestorage'
    ref_totstorage = u'totalstorage'
    ref_lastup = u'lastupdate'

    def __init__(self):
        self.name = socket.gethostname()
        try:
            self.publicip = u'{}'.format(urlopen('http://ip.42.pl/raw').read().decode("utf8"))
        except:
            self.publicip = u'Error'
        self.localip = '0.0.0.0'
        self.update_loc_IP()
        self.totalmemory = psutil.virtual_memory().total
        self.freememory = psutil.virtual_memory().available
        self.cpuload = psutil.cpu_percent()
        self.virtualcores = psutil.cpu_count()
        self.realcores = psutil.cpu_count(logical=False)
        self.totalstorage = psutil.disk_usage('/').total
        self.freestorage = psutil.disk_usage('/').free
        self.lastupdate = int(round(time.time() * 1000))

    def update_pub_IP(self):
        try:
            self.publicip = u'{}'.format(urlopen('http://ip.42.pl/raw').read().decode("utf8"))
        except:
            self.publicip = "Error"
        self.lastupdate = int(round(time.time() * 1000))

    def update_loc_IP(self):
        try:
            self.localip = [l for l in ([ip for ip in socket.gethostbyname_ex(socket.gethostname())[2] 
            if not ip.startswith("127.")][:1], [[(s.connect(('8.8.8.8', 53)), 
            s.getsockname()[0], s.close()) for s in [socket.socket(socket.AF_INET, 
            socket.SOCK_DGRAM)]][0][1]]) if l][0][0]
        except:
            self.localip = '0.0.0.0'

    def update_cpu_load(self):
        self.cpuload = psutil.cpu_percent()

    def update_free_mem(self):
        self.freememory = psutil.virtual_memory().available
        self.lastupdate = int(round(time.time() * 1000))

    def update_free_storage(self):
        self.freestorage = psutil.disk_usage('/').free
        self.lastupdate = int(round(time.time() * 1000))

    def get_name(self):
        return self.name

    def to_up(self):
        return {
            self.ref_realcores: self.realcores,
            self.ref_virtualcores: self.virtualcores,
            self.ref_totmem: self.totalmemory,
            self.ref_freemem: self.freememory,
            self.ref_totstorage: self.totalstorage,
            self.ref_freestorage: self.freestorage,
            self.ref_publicip: self.publicip,
            self.ref_localip: self.localip,
            self.ref_cpuload: self.cpuload,
            self.ref_lastup: self.lastupdate
        }
