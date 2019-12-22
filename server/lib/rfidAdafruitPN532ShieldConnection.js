/** hex-reader.ino 
#include <Wire.h>
#include <SPI.h>
#include <Adafruit_PN532.h>

#define PN532_SCK  (2)
#define PN532_MOSI (3)
#define PN532_SS   (4)
#define PN532_MISO (5)

#define PN532_IRQ   (2)
#define PN532_RESET (3)

//Adafruit_PN532 nfc(PN532_SCK, PN532_MISO, PN532_MOSI, PN532_SS); // SPI
Adafruit_PN532 nfc(PN532_IRQ, PN532_RESET); // I2C

void setup(void) {
  #ifndef ESP8266
    while (!Serial); // for Leonardo/Micro/Zero
  #endif
  Serial.begin(115200);

  nfc.begin();

  uint32_t versiondata = nfc.getFirmwareVersion();
  if (! versiondata) { while (1); }

  nfc.SAMConfig();
}

void loop(void) {
  uint8_t success;
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };  // Buffer to store the returned UID
  uint8_t uidLength;                        // Length of the UID (4 or 7 bytes depending on ISO14443A card type)

  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);

  if (success) {
    Serial.print("uid is ");
    nfc.PrintHex(uid, uidLength);
    Serial.println("");
    Serial.flush();
    while (!Serial.available());
    // wait for '\n' before sending next read
    while  (Serial.available()) {
      Serial.read();
    }
    Serial.flush();
  }
}
*/

const SerialPort = require('serialport')
const Readline = SerialPort.parsers.Readline

const listeners = []
const card = null
let inactivityTimeoutId = null // timeout to tell listeners the card has been removed
let readyIntervalId = null     // interval to tell the card we are ready to read

exports.init = () => {
    const path = `/dev/ttyACM1`
    const baudRate = 115200
    const delimiter = '\r\n'
    const inactivityDuration = 400 // ms

    const serialport = new SerialPort(path, { baudRate })
    const readline = new Readline({ delimiter })
    const parser = serialport.pipe(readline)

    const informListenersOfTimeout = () => {
        card = null
        listeners.forEach(listener => {
            try {
                listener.onCardRemoved && listener.onCardRemoved.call(listener)
            } catch (error) {
                console.error(`Error while informing listener of card removal.` error)
            }
        })
    }

    const informListenersOfNewCard = () => {
        listeners.forEach(listener => {
            try {
                listener.onNewCardDetected && listener.onNewCardDetected.call(listener, card)
            } catch (error) {
                console.error(`Error while informing listener of card detected.`, error)
            }
        })
    }

    // anytime we get new info, store the uid and clear the timer 
    parser.on('data', data  => {
      const uid = data
        .split('uid is')
        .pop()
        .split(' 0x')
        .join('')

      if (inactivityTimeoutId) clearTimeout(inactivityTimeoutId)
      inactivityTimeoutId = setTimeout(informListenersOfTimeout, inactivityDuration)
  
      if (uid === card) return
      card = uid
      console.log(`New card detected.`, card)
      informListenersOfNewCard()
    })

    // tell the reader we are ready every 100ms
    readyIntervalId = setInterval(() => serialport.write('\n'), 100)
}

exports.stop = () => clearInterval(readyIntervalId)
exports.isCardDetected = () => !!card
exports.getCardId = () => card
exports.listenForScan = listener => listeners.push(listener)
