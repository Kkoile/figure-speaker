#!/bin/bash

echo "--- Start setting up raspberry pi ---"

echo "Setting audio volume to 100% ..."
amixer set PCM -- 100%

echo "Enabling SPI for RFID Reader ..."
echo "dtparam=spi=on" | sudo tee -a /boot/config.txt >/dev/null

echo "Installing Mopidy ..."
sudo wget -q -O - https://apt.mopidy.com/mopidy.gpg | sudo apt-key add -
sudo wget -q -O /etc/apt/sources.list.d/mopidy.list https://apt.mopidy.com/stretch.list
sudo apt-get update
sudo apt-get install -y mopidy

echo "Installing Mopidy Spotify Extension ..."
sudo apt-get install -y mopidy-spotify

echo "[local]" | sudo tee -a ~/.config/mopidy/mopidy.conf >/dev/null
echo "media_dir = ~/.config/figure-speaker/files" | sudo tee -a ~/.config/mopidy/mopidy.conf >/dev/null
mopidy local scan

echo "Installing Node.js ..."
sudo curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "Configuring NPM ..."
mkdir ~/.npm-global
npm config set prefix "/home/pi/.npm-global"

echo "Installing Figure Speaker ..."
npm install -g figure-speaker

echo "Create Service File for Figure Speaker ..."
sudo touch /etc/systemd/system/figure-speaker.service
sudo chmod 664 /etc/systemd/system/figure-speaker.service

echo "[Service]" | sudo tee -a /etc/systemd/system/figure-speaker.service >/dev/null
echo "WorkingDirectory=/home/pi/" | sudo tee -a /etc/systemd/system/figure-speaker.service >/dev/null
echo "ExecStart=/home/pi/.npm-global/bin/figure-speaker" | sudo tee -a /etc/systemd/system/figure-speaker.service >/dev/null
echo "Restart=always" | sudo tee -a /etc/systemd/system/figure-speaker.service >/dev/null
echo "StandardOutput=syslog" | sudo tee -a /etc/systemd/system/figure-speaker.service >/dev/null
echo "StandardError=syslog" | sudo tee -a /etc/systemd/system/figure-speaker.service >/dev/null
echo "SyslogIdentifier=figure-speaker" | sudo tee -a /etc/systemd/system/figure-speaker.service >/dev/null
echo "User=pi" | sudo tee -a /etc/systemd/system/figure-speaker.service >/dev/null
echo "Group=pi" | sudo tee -a /etc/systemd/system/figure-speaker.service >/dev/null
echo "Environment=NODE_ENV=production GPIO_INCREASE_VOLUME_BUTTON=27 GPIO_DECREASE_VOLUME_BUTTON=22" | sudo tee -a /etc/systemd/system/figure-speaker.service >/dev/null
echo "[Install]" | sudo tee -a /etc/systemd/system/figure-speaker.service >/dev/null
echo "WantedBy=multi-user.target" | sudo tee -a /etc/systemd/system/figure-speaker.service >/dev/null

sudo systemctl enable figure-speaker



echo "Installing Figure Speaker Update Manager ..."
npm install -g figure-speaker-update-manager

echo "Create Service File for Figure Speaker Update Manager ..."
sudo touch /etc/systemd/system/figure-speaker-update-manager.service
sudo chmod 664 /etc/systemd/system/figure-speaker-update-manager.service

echo "[Service]" | sudo tee -a /etc/systemd/system/figure-speaker-update-manager.service >/dev/null
echo "WorkingDirectory=/home/pi/" | sudo tee -a /etc/systemd/system/figure-speaker-update-manager.service >/dev/null
echo "ExecStart=/home/pi/.npm-global/bin/figure-speaker-update-manager" | sudo tee -a /etc/systemd/system/figure-speaker-update-manager.service >/dev/null
echo "Restart=always" | sudo tee -a /etc/systemd/system/figure-speaker-update-manager.service >/dev/null
echo "StandardOutput=syslog" | sudo tee -a /etc/systemd/system/figure-speaker-update-manager.service >/dev/null
echo "StandardError=syslog" | sudo tee -a /etc/systemd/system/figure-speaker-update-manager.service >/dev/null
echo "SyslogIdentifier=figure-speaker-update-manager" | sudo tee -a /etc/systemd/system/figure-speaker-update-manager.service >/dev/null
echo "User=pi" | sudo tee -a /etc/systemd/system/figure-speaker-update-manager.service >/dev/null
echo "Group=pi" | sudo tee -a /etc/systemd/system/figure-speaker-update-manager.service >/dev/null
echo "Environment=NODE_ENV=production" | sudo tee -a /etc/systemd/system/figure-speaker-update-manager.service >/dev/null
echo "[Install]" | sudo tee -a /etc/systemd/system/figure-speaker-update-manager.service >/dev/null
echo "WantedBy=multi-user.target" | sudo tee -a /etc/systemd/system/figure-speaker-update-manager.service >/dev/null

sudo systemctl enable figure-speaker-update-manager


echo "Installing Figure Speaker Wifi Connector ..."
npm install -g figure-speaker-wifi-connector

echo "Create Service File for Figure Speaker Wifi Connector ..."
sudo touch /etc/systemd/system/figure-speaker-wifi-connector.service
sudo chmod 664 /etc/systemd/system/figure-speaker-wifi-connector.service

echo "[Service]" | sudo tee -a /etc/systemd/system/figure-speaker-wifi-connector.service >/dev/null
echo "WorkingDirectory=/home/pi/" | sudo tee -a /etc/systemd/system/figure-speaker-wifi-connector.service >/dev/null
echo "ExecStart=/home/pi/.npm-global/bin/figure-speaker-wifi-connector" | sudo tee -a /etc/systemd/system/figure-speaker-wifi-connector.service >/dev/null
echo "Restart=always" | sudo tee -a /etc/systemd/system/figure-speaker-wifi-connector.service >/dev/null
echo "StandardOutput=syslog" | sudo tee -a /etc/systemd/system/figure-speaker-wifi-connector.service >/dev/null
echo "StandardError=syslog" | sudo tee -a /etc/systemd/system/figure-speaker-wifi-connector.service >/dev/null
echo "SyslogIdentifier=figure-speaker-wifi-connector" | sudo tee -a /etc/systemd/system/figure-speaker-wifi-connector.service >/dev/null
echo "User=root" | sudo tee -a /etc/systemd/system/figure-speaker-wifi-connector.service >/dev/null
echo "Group=root" | sudo tee -a /etc/systemd/system/figure-speaker-wifi-connector.service >/dev/null
echo "Environment=NODE_ENV=production" | sudo tee -a /etc/systemd/system/figure-speaker-wifi-connector.service >/dev/null
echo "[Install]" | sudo tee -a /etc/systemd/system/figure-speaker-wifi-connector.service >/dev/null
echo "WantedBy=multi-user.target" | sudo tee -a /etc/systemd/system/figure-speaker-wifi-connector.service >/dev/null

sudo systemctl enable figure-speaker-wifi-connector


echo "Setup AdHoc Network ..."

sudo apt-get update
sudo apt-get --assume-yes install hostapd -f
sudo apt-get --assume-yes install dnsmasq -f

sudo systemctl disable hostapd
sudo systemctl disable dnsmasq

sudo touch /etc/hostapd/hostapd.conf
echo "#2.4GHz setup wifi 80211 b,g,n" | sudo tee -a /etc/hostapd/hostapd.conf >/dev/null
echo "interface=wlan0" | sudo tee -a /etc/hostapd/hostapd.conf >/dev/null
echo "driver=nl80211" | sudo tee -a /etc/hostapd/hostapd.conf >/dev/null
echo "ssid=FigureSpeaker" | sudo tee -a /etc/hostapd/hostapd.conf >/dev/null
echo "hw_mode=gchannel=8" | sudo tee -a /etc/hostapd/hostapd.conf >/dev/null
echo "wmm_enabled=0" | sudo tee -a /etc/hostapd/hostapd.conf >/dev/null
echo "macaddr_acl=0" | sudo tee -a /etc/hostapd/hostapd.conf >/dev/null
echo "auth_algs=1" | sudo tee -a /etc/hostapd/hostapd.conf >/dev/null
echo "ignore_broadcast_ssid=0" | sudo tee -a /etc/hostapd/hostapd.conf >/dev/null
echo "wpa=2" | sudo tee -a /etc/hostapd/hostapd.conf >/dev/null
echo "wpa_passphrase=1234567890" | sudo tee -a /etc/hostapd/hostapd.conf >/dev/null
echo "wpa_key_mgmt=WPA-PSK" | sudo tee -a /etc/hostapd/hostapd.conf >/dev/null
echo "wpa_pairwise=CCMP TKIP" | sudo tee -a /etc/hostapd/hostapd.conf >/dev/null
echo "rsn_pairwise=CCMP" | sudo tee -a /etc/hostapd/hostapd.conf >/dev/null
echo "#80211n - Change GB to your WiFi country code" | sudo tee -a /etc/hostapd/hostapd.conf >/dev/null
echo "country_code=GB" | sudo tee -a /etc/hostapd/hostapd.conf >/dev/null
echo "ieee80211n=1" | sudo tee -a /etc/hostapd/hostapd.conf >/dev/null
echo "ieee80211d=1" | sudo tee -a /etc/hostapd/hostapd.conf >/dev/null


echo "DAEMON_CONF=\"/etc/hostapd/hostapd.conf\"" | sudo tee -a /etc/dnsmasq.conf >/dev/null


echo "#AutoHotspot Config" | sudo tee -a /etc/dnsmasq.conf >/dev/null
echo "#stop DNSmasq from using resolv.conf" | sudo tee -a /etc/dnsmasq.conf >/dev/null
echo "no-resolv" | sudo tee -a /etc/dnsmasq.conf >/dev/null
echo "#Interface to use" | sudo tee -a /etc/dnsmasq.conf >/dev/null
echo "interface=wlan0" | sudo tee -a /etc/dnsmasq.conf >/dev/null
echo "bind-interfaces" | sudo tee -a /etc/dnsmasq.conf >/dev/null
echo "dhcp-range=10.0.0.50,10.0.0.150,12h" | sudo tee -a /etc/dnsmasq.conf >/dev/null

sudo rm /etc/network/interfaces
sudo touch /etc/network/interfaces
sudo chmod 664 /etc/network/interfaces

echo "nohook wpa_supplicant" | sudo tee -a /etc/dhcpcd.conf >/dev/null


sudo apt-get --assume-yes install iw -f

echo "#!/bin/bash" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "#version 0.95-4-N/HS" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "#You may share this script on the condition a reference to RaspberryConnect.com" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "#must be included in copies or derivatives of this script." | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "#A script to switch between a wifi network and a non internet routed Hotspot" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "#Works at startup or with a seperate timer or manually without a reboot" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "#Other setup required find out more at" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "#http://www.raspberryconnect.com" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "wifidev=\"wlan0\" #device name to use. Default is wlan0." | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "#use the command: iw dev ,to see wifi interface name" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "IFSdef=\$IFS" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "cnt=0" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "#These four lines capture the wifi networks the RPi is setup to use" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "wpassid=\$(awk '/ssid=\"/{ print \$0 }' /etc/wpa_supplicant/wpa_supplicant.conf | awk -F'ssid=' '{ print \$2 }' ORS=',' | sed 's/\\\"/''/g' | sed 's/,\$//')" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "IFS=\",\"" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "ssids=(\$wpassid)" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "IFS=\$IFSdef #reset back to defaults" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "#Note:If you only want to check for certain SSIDs" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "#Remove the # in in front of ssids=('mySSID1'.... below and put a # infront of all four lines above" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "# separated by a space, eg ('mySSID1' 'mySSID2')" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "#ssids=('mySSID1' 'mySSID2' 'mySSID3')" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "#Enter the Routers Mac Addresses for hidden SSIDs, seperated by spaces ie" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "#( '11:22:33:44:55:66' 'aa:bb:cc:dd:ee:ff' )" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "mac=()" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "ssidsmac=(\"\${ssids[@]}\" \"\${mac[@]}\") #combines ssid and MAC for checking" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "createAdHocNetwork()" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "{" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "    echo \"Creating Hotspot\"" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "    ip link set dev \"\$wifidev\" down" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "    ip a add 10.0.0.5/24 brd + dev \"\$wifidev\"" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "    ip link set dev \"\$wifidev\" up" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "    dhcpcd -k \"\$wifidev\" >/dev/null 2>&1" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "    systemctl start dnsmasq" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "    systemctl start hostapd" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "}" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "KillHotspot()" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "{" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "    echo \"Shutting Down Hotspot\"" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "    ip link set dev \"\$wifidev\" down" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "    systemctl stop hostapd" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "    systemctl stop dnsmasq" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "    ip addr flush dev \"\$wifidev\"" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "    ip link set dev \"\$wifidev\" up" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "    dhcpcd  -n \"\$wifidev\" >/dev/null 2>&1" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "}" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "ChkWifiUp()" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "{" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "	echo \"Checking WiFi connection ok\"" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "        sleep 20 #give time for connection to be completed to router" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "	if ! wpa_cli -i \"\$wifidev\" status | grep 'ip_address' >/dev/null 2>&1" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "        then #Failed to connect to wifi (check your wifi settings, password etc)" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "	       echo 'Wifi failed to connect, falling back to Hotspot.'" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "               wpa_cli terminate \"\$wifidev\" >/dev/null 2>&1" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "	       createAdHocNetwork" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "	fi" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "}" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "FindSSID()" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "{" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "#Check to see what SSID's and MAC addresses are in range" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "ssidChk=('NoSSid')" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "i=0; j=0" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "until [ \$i -eq 1 ] #wait for wifi if busy, usb wifi is slower." | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "do" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "        ssidreply=\$((iw dev \"\$wifidev\" scan ap-force | egrep \"^BSS|SSID:\") 2>&1) >/dev/null 2>&1" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "        echo \"SSid's in range: \" \$ssidreply" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "        echo \"Device Available Check try \" \$j" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "        if ((\$j >= 10)); then #if busy 10 times goto hotspot" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "                 echo \"Device busy or unavailable 10 times, going to Hotspot\"" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "                 ssidreply=\"\"" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "                 i=1" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "	elif echo \"\$ssidreply\" | grep \"No such device (-19)\" >/dev/null 2>&1; then" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "                echo \"No Device Reported, try \" \$j" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "		NoDevice" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "        elif echo \"\$ssidreply\" | grep \"Network is down (-100)\" >/dev/null 2>&1 ; then" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "                echo \"Network Not available, trying again\" \$j" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "                j=\$((j + 1))" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "                sleep 2" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "	elif echo \"\$ssidreplay\" | grep \"Read-only file system (-30)\" >/dev/null 2>&1 ; then" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "		echo \"Temporary Read only file system, trying again\"" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "		j=\$((j + 1))" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "		sleep 2" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "	elif ! echo \"\$ssidreply\" | grep \"resource busy (-16)\"  >/dev/null 2>&1 ; then" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "               echo \"Device Available, checking SSid Results\"" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "		i=1" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "	else #see if device not busy in 2 seconds" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "                echo \"Device unavailable checking again, try \" \$j" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "		j=\$((j + 1))" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "		sleep 2" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "	fi" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "done" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "for ssid in \"\${ssidsmac[@]}\"" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "do" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "     if (echo \"\$ssidreply\" | grep \"\$ssid\") >/dev/null 2>&1" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "     then" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "	      #Valid SSid found, passing to script" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "              echo \"Valid SSID Detected, assesing Wifi status\"" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "              ssidChk=\$ssid" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "              return 0" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "      else" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "	      #No Network found, NoSSid issued\"" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "              echo \"No SSid found, assessing WiFi status\"" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "              ssidChk='NoSSid'" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "     fi" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "done" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "}" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "NoDevice()" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "{" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "	#if no wifi device,ie usb wifi removed, activate wifi so when it is" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "	#reconnected wifi to a router will be available" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "	echo \"No wifi device connected\"" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "	wpa_supplicant -B -i \"\$wifidev\" -c /etc/wpa_supplicant/wpa_supplicant.conf >/dev/null 2>&1" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "	exit 1" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "}" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "FindSSID" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "#Create Hotspot or connect to valid wifi networks" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "if [ \"\$ssidChk\" != \"NoSSid\" ]" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "then" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "       if systemctl status hostapd | grep \"(running)\" >/dev/null 2>&1" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "       then #hotspot running and ssid in range" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "              KillHotspot" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "              echo \"Hotspot Deactivated, Bringing Wifi Up\"" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "              wpa_supplicant -B -i \"\$wifidev\" -c /etc/wpa_supplicant/wpa_supplicant.conf >/dev/null 2>&1" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "              ChkWifiUp" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "       elif { wpa_cli -i \"\$wifidev\" status | grep 'ip_address'; } >/dev/null 2>&1" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "       then #Already connected" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "              echo \"Wifi already connected to a network\"" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "       else #ssid exists and no hotspot running connect to wifi network" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "              echo \"Connecting to the WiFi Network\"" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "              wpa_supplicant -B -i \"\$wifidev\" -c /etc/wpa_supplicant/wpa_supplicant.conf >/dev/null 2>&1" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "              ChkWifiUp" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "       fi" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "else #ssid or MAC address not in range" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "       if systemctl status hostapd | grep \"(running)\" >/dev/null 2>&1" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "       then" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "              echo \"Hostspot already active\"" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "       elif { wpa_cli status | grep \"\$wifidev\"; } >/dev/null 2>&1" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "       then" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "              echo \"Cleaning wifi files and Activating Hotspot\"" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "              wpa_cli terminate >/dev/null 2>&1" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "              ip addr flush \"\$wifidev\"" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "              ip link set dev \"\$wifidev\" down" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "              rm -r /var/run/wpa_supplicant >/dev/null 2>&1" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "              createAdHocNetwork" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "       else #\"No SSID, activating Hotspot\"" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "              createAdHocNetwork" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "       fi" | sudo tee -a /usr/bin/autohotspot >/dev/null
echo "fi" | sudo tee -a /usr/bin/autohotspot >/dev/null

# TODO: does not work properly. Has to be executed again
sudo chmod +x /usr/bin/autohotspot

echo "Create Service File for Autohotspot ..."
sudo touch /etc/systemd/system/autohotspot.service
sudo chmod 664 /etc/systemd/system/autohotspot.service

echo "[Unit]" | sudo tee -a /etc/systemd/system/autohotspot.service >/dev/null
echo "Description=Automatically generates an internet Hotspot when a valid ssid is not in range" | sudo tee -a /etc/systemd/system/autohotspot.service >/dev/null
echo "After=multi-user.target" | sudo tee -a /etc/systemd/system/autohotspot.service >/dev/null
echo "[Service]" | sudo tee -a /etc/systemd/system/autohotspot.service >/dev/null
echo "Type=oneshot" | sudo tee -a /etc/systemd/system/autohotspot.service >/dev/null
echo "RemainAfterExit=yes" | sudo tee -a /etc/systemd/system/autohotspot.service >/dev/null
echo "ExecStart=/usr/bin/autohotspot" | sudo tee -a /etc/systemd/system/autohotspot.service >/dev/null
echo "[Install]" | sudo tee -a /etc/systemd/system/autohotspot.service >/dev/null
echo "WantedBy=multi-user.target" | sudo tee -a /etc/systemd/system/autohotspot.service >/dev/null

sudo systemctl enable autohotspot.service

sudo sed -i 's/.*/figure-speaker/g' /etc/hostname

sudo sed -i 's/\(127\.0\.0\.1\s*\).*$/\1figure-speaker/g' /etc/hosts