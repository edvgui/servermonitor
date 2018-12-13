#!/usr/bin/python3

import sys
import os
import firebase_admin
import time
from firebase_admin import credentials
from firebase_admin import firestore
from computer import Computer

# Use a service account
cred = credentials.Certificate('{0}/{1}'.format(os.path.dirname(os.path.abspath(__file__)), '../priv/servermonitor-d4fc6-firebase-adminsdk-2y65x-22ea747033.json'))
firebase_admin.initialize_app(cred)
db = firestore.client()

if __name__ == "__main__":
    my_comp = Computer()
    doc_ref = db.collection(u'computers').document(my_comp.name)
    try:
        doc_ref.set(my_comp.to_up())
    except:
        print("An error occured : ", sys.exc_info()[0])

    to_wait = 60
    while True:
        time.sleep(to_wait)
        my_comp.update_free_mem()
        my_comp.update_free_storage()
        my_comp.update_pub_IP()
        my_comp.update_loc_IP()
        try:
            doc_ref.update(my_comp.to_up())
        except:
            print("An error occured : ", sys.exc_info()[0])
