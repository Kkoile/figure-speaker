// This backend assumes you are running the RFIDShield Arduino sketch located in the support folder
// You can find install instructions there

const SerialPort = require('serialport')
const Readline = SerialPort.parsers.Readline

const listeners = []
let card = null
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
