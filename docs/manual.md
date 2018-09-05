# Manual
Here you find information about how to use figure-speaker.

Note: When I talk about a `figure` I always assume that this figure has an NFC tag attached to its bottom.
## Connect to Network
If you use figure-speaker for the first time, you need to connect it to your WiFi. The Raspberry Pi opens an AdHoc network named `Figure-Speaker`. Connect to it and you will automatically be redirected to a web page where all available WiFi networks are listed. Choose your network and provide its password. After you have connected it to the WiFi successfully, you can go to `http://raspberrypi.local:3000` where you can configure figure-speaker.

## Configure Figure Speaker
If figure-speaker is connected to your WiFi got to `http://raspberrypi.local:3000` (you need to be on the same network). Go to `Settings` tab on the left-hand side.

### Configure Spotify Credentials
In order to integrate with Spotify, you need to provide the credentials of your Spotify Premium account. Go to Spotify and choose `Manage Account`. Follow the instructions in order to receive the Client Id and Client Secret of your Spotify account. These are used by Mopidy to connect to Spotify (see more [here](https://www.mopidy.com/authenticate/)).

## Connect a Figure with an Audio Track
In order to connect a new or an existing figure with an audio track, place it on the top of figure-speaker. Then choose the track you want it play by providing the mp3 file name or browse through Spotify. If you found the preferred track press `Save`. The figure is now associated with this track. The next time you place this figure on the speaker, this track will be played.

## The Actual Use
If you want to listen to music via figure-speaker, make sure that it is turned on and connected to the network. Then simply place the preferred figure onto the speaker and the audio track associated with it will be played. You can stop the track by removing the figure from the top of your speaker.

What happens if you remove the figure, when the track was in the middle and replace it onto the speaker? This depends on the configuration. If your figure-speaker is configured to resume the track, then it will resume where you left off. But if the speaker is configured to reset the track, it will always be played from the beginning.

In order to change the volume you need to press either the "volume up" or "volume down" button. These are located in the ears of the figure-speaker. The smaller ear decreases the volume, while the bigger ear increases the volume.

If you need to recharge the figure-speaker plug in the cable to the power bank which is inside of the bank. Of course you can use the figure-speaker while charging.

And that's it! The figure-speaker is based on simplicity, to make it as intuitive for children as possible! 