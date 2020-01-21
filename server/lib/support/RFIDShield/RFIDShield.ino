// This is the arduino sketch needed to use the AdafruitPN532ShieldConnection backend
// Note that you must use the I2C interface
// If you are new to arduino, the quickstart would be:
//
//    # install arduino-cli
//    curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | BINDIR=~/.local/bin sh
//
//    # update the config
//    arduino-cli core update-index
//
//    # compile this sketch 
//    arduino-cli compile -b arduino:avr:uno $PWD
// 
//    # upload to your arduino (try `arduino-cli board list` if this doesnt work)
//    arduino-cli upload -p /dev/ttyACM0 -b arduino:avr:uno RFIDShield

#include <Wire.h>
#include <SPI.h>
#include <Adafruit_PN532.h>

#define PN532_SCK  (2)
#define PN532_MOSI (3)
#define PN532_SS   (4)
#define PN532_MISO (5)

#define PN532_IRQ   (2)
#define PN532_RESET (3)

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
