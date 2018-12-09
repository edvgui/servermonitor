# Server monitor
This repo contains a simple tool currently in developpment for monitoring some linux machines.  The docs/ folder contains a static website used as a client for different machines, displaying some basic informations about them.  The communication between the machines and the webclient is done via the [firestore api](https://firebase.google.com/).

## Installation
The following installation steps are those needed for an installation on ubuntu 18.04, if you have another debian distribution, it should work the same way.
### 1) Cloning the repository
First, you will need to clone the repository : 
```Bash
git clone https://github.com/edvgui/servermonitor.git
```
### 2) Installing the dependencies
The client script works with python3, you can check if you have installed it by typing this command in yout terminal :
```Bash
python3 --version
```
If you don't have it, install it : 
```Bash
sudo apt install python3
```
You will also need pip3 to install the needed dependencies, you can check if you have it the same way : 
```Bash
pip3 --version
```
If you don't have it, install it : 
```Bash
sudo apt install pip3
```

The python script need firebase_admin and psutil to work properly, you can install them by typing :
```Bash
pip3 install --upgrade firebase_admin
pip3 install psutil
```
### 3) Firestore configuration
Now you need to setup the firestore database and include it into yout project, I let your read the beautiful documentation already created by firebase.
In the process you will need to insert a .json file containing the private key needed to allow your app to access the online database, add it in a priv/ folder, at the root of the folder.  Then edit the line that's importing it in the main.py file so that it match your file name.
### 4) Testing the python script
To test if the python script works properly, execute it by typing : 
```Bash
python3 main.py
```
This shouln't display any output.  To check if all works properly, log in to your firebase console, and check if some data has been added to your firestore database.
#### 5) Creating a service

## Contributing

## License