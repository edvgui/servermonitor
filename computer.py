import time
import psutil
import socket
from urllib.request import urlopen


time_format = "%Y-%m-%d %H:%M:%S"


class Computer:

    ref_realcores = u'realcores'
    ref_virtualcores = u'virtualcores'
    ref_publicip = u'publicip'
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
        self.totalmemory = psutil.virtual_memory().total
        self.freememory = psutil.virtual_memory().available
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

    def update_free_mem(self):
        self.freememory = psutil.virtual_memory().free
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
            self.ref_lastup: self.lastupdate
        }
