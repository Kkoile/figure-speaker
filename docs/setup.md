# How to Setup Figure-Speaker on a Raspberry Pi Image
These steps need to be followed in order to setup a raspberry pi image with the figure speaker environment. 
## Flash Raspberry Pi Image
The project is only tested with a raspbian image. However, other raspberry pi images should work as well.

Follow the instructions at [Raspberry Pi Setup Instructions](https://www.raspberrypi.org/documentation/installation/installing-images/) in order to flash an image. 
Download the lite image from [Raspberry Pi Downloads](https://www.raspberrypi.org/downloads/raspbian/). There is no need for the Desktop version, because the figure-speaker won't have a display attached.

Connect the SD card of your raspberry pi to your computer and flash the image via etcher.

### Create an SSH File
Create an empty file named `ssh` at root level of the sd card in order to access the raspberry pi later on.

### Provide WiFi Credentials (optional)
In order to directly access your raspberry pi over via ssh, you can provide the wifi credentials on sd card level. Without doing this you need to plug in your raspberry pi to your network via ethernet.

Create a file called `wpa_supplicant.conf` at root level of the sd card. Edit the file and place the following content with your modifications regarding the credentials:
```
country=DE
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
    ssid="<SSID>"
    psk="<PASSWORD>"
}

```

### Start Raspberry Pi
Put the sd card into your raspberry pi and start it. It should connect to the configured wifi automatically.
Connect to the raspberry pi via ssh:
```
ssh pi@raspberrypi.local
```
Use the default password `raspberry` for authentication.
You should directly change the default password by entering the command `passwd`

From now on, all commands in the setup chapter are executed on the raspberry via ssh.

## Set Audio Volume to Maximum
The volume will be handled later by our application. In order to be able to get the maximum volume you should set it on the raspberry pi:
```
amixer set PCM -- 100%
```

## Enable SPI Interface
Type `sudo raspi-config` and go to `Interfacing Options`. Select `SPI` and make sure to enable it. 

## Install Mopidy
Mopidy is the audio server which connects to spotify and other providers. You can find more about mopidy [here](https://docs.mopidy.com/en/latest/).
In order to install mopidy on the raspberry pi follow the [instructions](https://docs.mopidy.com/en/latest/installation/debian/#debian-install).

Depending on the mopidy extensions you want to include you should install them. For example the spotify extension:
```
sudo apt-get install mopidy-spotify
``` 

### Install MPC (Optional)
In order to test if mopidy is working, you can install a mopidy client like `mpc`:
```
sudo apt-get install mpc
```
This allows you to play mp3 files on your raspberry pi, or if already configured, extensions like spotify.
For the full documentation type `man mpc`. If you only want to test the audio output you can use the following code snippet:
```
curl https://www.sample-videos.com/audio/mp3/crowd-cheering.mp3 -o test.mp3
mpc add file:///home/pi/test.mp3
mpc play
```
Use `mpc stop` to stop playing the current audio file.

## Install Node.js
Node.js is the environment in which figure-speaker is written. Hence, to be able to execute the application you need to install it. 
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```
Change the directory of installing global npm modules, in order to reduce permission errors. Follow this [link](https://docs.npmjs.com/getting-started/fixing-npm-permissions#option-two-change-npms-default-directory) to do so.

## Install Figure-Speaker
Figure-Speaker is written as a global npm module. So we can install it by executing the following command:
```
sudo npm install -g figure-speaker
```
Don't mind the vast amount of error logs...

Create a configuration file figure-speaker will use to save the configuration in:
```
mkdir ~/.config/figure-speaker && touch ~/.config/figure-speaker/figures.conf
```
You can test the installation by typing `figure-speaker` in the command line. This should start the server. The frontend should now be available at `http://raspberrypi.local:3000`.

We want our application to always start when booting raspberry pi. To achieve this, we create a service file which we can then manage with `systemctl`.
Create a file `figure-speaker.service`:
 ```
 sudo touch /etc/systemd/system/figure-speaker.service
 sudo chmod 664 /etc/systemd/system/figure-speaker.service
 ```
And paste the following content in it. You should change the spotify credentials according to your spotify app.
//TODO: link to another chapter where this is explained
```
[Service]
WorkingDirectory=/home/pi/
ExecStart=/home/pi/.npm-global/bin/figure-speaker
Restart=always
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=figure-speaker
User=pi
Group=pi
Environment=NODE_ENV=production SPOTIFY_CLIENT_ID=<SPOTIFY_CLIENT_ID> SPOTIFY_CLIENT_SECRET=<SPOTIFY_CLIENT_SECRET> GPIO_INCREASE_VOLUME_BUTTON=27 GPIO_DECREASE_VOLUME_BUTTON=22

[Install]
WantedBy=multi-user.target
```

Execute the following command:
```
sudo systemctl enable figure-speaker
```
Now, either start the service directly with `sudo systemctl start figure-speaker`, or reboot the raspberry pi.
 
You can always see the current logs by executing `journalctl -u figure-speaker -f`

## Install Update Manager
```
sudo npm install -g figure-speaker-update-manager
```
Create a file `figure-speaker-update-manager.service`:
 ```
 sudo touch /etc/systemd/system/figure-speaker-update-manager.service
 sudo chmod 664 /etc/systemd/system/figure-speaker-update-manager.service
 ```
And paste the following content in it.
```
[Service]
WorkingDirectory=/home/pi/
ExecStart=/home/pi/.npm-global/bin/figure-speaker-update-manager
Restart=always
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=figure-speaker-update-manager
User=pi
Group=pi
Environment=NODE_ENV=production 

[Install]
WantedBy=multi-user.target
```

Execute the following command:
```
sudo systemctl enable figure-speaker-update-manager
```
Now, either start the service directly with `sudo systemctl start figure-speaker-update-manager`, or reboot the raspberry pi.
 
You can always see the current logs by executing `journalctl -u figure-speaker-update-manager -f`

## Install WiFi Connector
```
sudo npm install -g figure-speaker-wifi-connector
```
Create a file `figure-speaker-wifi-connector.service`:
 ```
 sudo touch /etc/systemd/system/figure-speaker-wifi-connector.service
 sudo chmod 664 /etc/systemd/system/figure-speaker-wifi-connector.service
 ```
And paste the following content in it.
```
[Service]
WorkingDirectory=/home/pi/
ExecStart=/home/pi/.npm-global/bin/figure-speaker-wifi-connector
Restart=always
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=figure-speaker-wifi-connector
User=pi
Group=pi
Environment=NODE_ENV=production 

[Install]
WantedBy=multi-user.target
```

Execute the following command:
```
sudo systemctl enable figure-speaker-wifi-connector
```
Now, either start the service directly with `sudo systemctl start figure-speaker-wifi-connector`, or reboot the raspberry pi.
 
You can always see the current logs by executing `journalctl -u figure-speaker-wifi-connector -f`

## Configure Ad Hoc Wifi
//TODO document how to configure ad hoc network and expose figure-speaker-wifi-connector

https://lcdev.dk/2012/11/18/raspberry-pi-tutorial-connect-to-wifi-or-create-an-encrypted-dhcp-enabled-ad-hoc-network-as-fallback/