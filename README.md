# Server monitor
This repo contains a simple tool currently in developpment for monitoring some linux machines.  The docs/ folder contains a static website used as a client for different machines, displaying some basic informations about them.  The communication between the machines and the webclient is done via the [firestore api](https://firebase.google.com/).
![Web interface screenshot](mockup.png)

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
sudo apt install python3-pip
```

The python script need firebase_admin and psutil to work properly, you can install them by typing :
```Bash
pip3 install firebase-admin
pip3 install google-cloud-firebase
pip3 install psutil
```
### 3) Firestore configuration
Now you need to setup the firestore database and include it into yout project, I let your read the beautiful documentation already created by firebase.
In the process you will need to insert a .json file containing the private key needed to allow your app to access the online database, add it in a priv/ folder, at the root of the folder.  Then edit the line that's importing it in the main.py file so that it match your file name.
### 4) Testing the python script
To test if the python script works properly, execute it by typing : 
```Bash
python3 src/main.py
```
This shouln't display any output.  To check if all works properly, log in to your firebase console, and check if some data has been added to your firestore database.
### 5) Creating a service
The python script contains an infinite loop, with a thread sleep that stop the process for a minute at each iteration.  This way we would like it to be used as a background process.
First we want our program to be accessible even when we aren't logged in, there is several possibility to place it, we will choose the folder /opt :
```Bash
sudo mv servermonitor /opt/servermonitor
```
As we want this script to be executed as soon as the machin boot and automatically, we will create a script, [servermonitor](./tools/servermonitor) (this script is based on this template : [https://github.com/fhd/init-script-template/edit/master/template](https://github.com/fhd/init-script-template/edit/master/template)), to put in the /etc/init.d/  directory.  Then we will make sure that this script is executable and add it to the other starting script list.
```Bash
sudo cp /tools/servermonitor /etc/init.d/servermonitor
sudo chmod +x /etc/init.d/servermonitor
sudo update-rc.d servermonitor defaults
```
You can now restart your machine and the script sould be running normally.  If you want to start it manually immediatly you can also simply run :
```Bash
sudo /etc/init.d/servermonitor start
```
### 6) Using the webclient
To use the web client you will need to make again some firebase configuration.  In each .html file, find this :
```js
<script>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCAIt9lCBNwL2AweD6FdQFx5FkWAEqnFjY",
    authDomain: "servermonitor-d4fc6.firebaseapp.com",
    databaseURL: "https://servermonitor-d4fc6.firebaseio.com",
    projectId: "servermonitor-d4fc6",
    storageBucket: "servermonitor-d4fc6.appspot.com",
    messagingSenderId: "908283698573"
  };
  firebase.initializeApp(config);
</script>
```
And replace it by your proper web integration lines (you can retrieve it on your firebase console).  You will then need to add a new user, still with this firebase console.
That's it, open the index.html file in your browser, log in with the account you just created and you now have a nice and clean interface to get some basics infos about your different machines running the python script.
## Contributing
This app is more like a side project, just for fun and without any ambition.  It might thus never be complete.  If you feel like upgrading or correcting it, feel free to post issues or pull request.  
## License
