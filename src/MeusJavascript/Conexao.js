import { log, time } from './Utils.js';
import { handleNotifications } from './App.js';


let globalServer;
let globalDevice;
let globalService;
let globalCharacteristic;


let navigatorOptions = {
  // filters: [{ services: ['0x180D'] }]
  acceptAllDevices: true,
  optionalServices: ['5833ff01-9b8b-5191-6142-22a4536ef123', '6e400001-b5a3-f393-e0a9-e50e24dcca9d', '0000aaa0-0000-1000-8000-aabbccddeeff', 'battery_service', '0000180f-0000-1000-8000-00805f9b34fb']
}


function conectarDispositivo() {
  navigator.bluetooth.requestDevice(navigatorOptions)
    .then(device => {
      // Human-readable name of the device.
      console.log(device.name);

      // Attempts to connect to remote GATT Server.
      return device.gatt.connect();
    })
    .then(server => {
      // Getting Battery Service…
      return server.getPrimaryService('battery_service');
    })
    .then(service => {
      // Getting Battery Level Characteristic…
      return service.getCharacteristic('battery_level');
    })
    .then(characteristic => {
      // Set up event listener for when characteristic value changes.
      characteristic.addEventListener('characteristicvaluechanged',
        handleBatteryLevelChanged);
      // Reading Battery Level…
      return characteristic.readValue();
    })
    .catch(error => { console.error(error); });

  function handleBatteryLevelChanged(event) {
    const batteryLevel = event.target.value.getUint8(0);
    console.log('Battery percentage is ' + batteryLevel);
  }
}

function heartRateSensorTeste() {
  navigator.bluetooth.requestDevice(navigatorOptions)
    .then(device => device.gatt.connect())
    .then(server => server.getPrimaryService('heart_rate'))
    .then(service => service.getCharacteristic('heart_rate_measurement'))
    .then(characteristic => characteristic.startNotifications())
    .then(characteristic => {
      characteristic.addEventListener('characteristicvaluechanged',
        handleCharacteristicValueChanged);
      console.log('Notifications have been started.');
    })
    .catch(error => { console.error(error); });

  function handleCharacteristicValueChanged(event) {
    const value = event.target.value;
    console.log('Received ' + value);
    // TODO: Parse Heart Rate Measurement value.
    // See https://github.com/WebBluetoothCG/demos/blob/gh-pages/heart-rate-sensor/heartRateSensor.js
  }
}


function testarDesconexao() {
  navigator.bluetooth.requestDevice(navigatorOptions)
    .then(device => {
      // Set up event listener for when device gets disconnected.
      device.addEventListener('gattserverdisconnected', onDisconnected);

      // Attempts to connect to remote GATT Server.
      return device.gatt.connect();
    })
    .then(server => { /* … */ })
    .catch(error => { console.error(error); });

  function onDisconnected(event) {
    const device = event.target;
    console.log(`Device ${device.name} is disconnected.`);
  }
}


function getSupportedProperties(characteristic) {
  let supportedProperties = [];
  for (const p in characteristic.properties) {
    if (characteristic.properties[p] === true) {
      supportedProperties.push(p.toUpperCase());
    }
  }
  return '[' + supportedProperties.join(', ') + ']';
}


let bluetoothDevice;
let servicesWithCharacteristics = {}; // Objeto para mapear serviços e suas características

function testarGetDevices() {
  conectarDevice()
    .then(server => {
      log('Getting Services...');
      return server.getPrimaryServices();
    })
    .then(services => {
      log('Getting Characteristics...');
      let queue = Promise.resolve();
      services.forEach(service => {
        queue = queue.then(_ => service.getCharacteristics()
          .then(characteristics => {
            log('> Service: ' + service.uuid);
            servicesWithCharacteristics[service.uuid] = {
              service: service,
              characteristics: characteristics.map(characteristic => ({
                uuid: characteristic.uuid,
                properties: getSupportedProperties(characteristic)
              }))
            };

            characteristics.forEach(characteristic => {

              if (getSupportedProperties(characteristic) == "[NOTIFY]" || getSupportedProperties(characteristic) == "[READ, NOTIFY]") {
                characteristic.addEventListener('characteristicvaluechanged',
                  handleNotifications);
                characteristic.startNotifications().then(_ => {
                  log('> Notifications started for >> Characteristic: ' + characteristic.uuid + ' ' +
                    getSupportedProperties(characteristic));
                })
              } else {
                log('> Characteristic: ' + characteristic.uuid + ' ' +
                  getSupportedProperties(characteristic));
              }
            });
          }));
      });
      // console.log(servicesWithCharacteristics)
      return queue;
    })
    .catch(error => {
      log('Argh! ' + error);
    });
}


async function postCommandWriteHeart() {
  try {


    const serviceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9d';
    const characteristicUUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9d';

    const service = await bluetoothDevice.gatt.getPrimaryService(serviceUUID);
    const characteristic = await service.getCharacteristic(characteristicUUID);


    const byteArray = [0xCD, 0x00, 0x06, 0x12, 0x01, 0x18, 0x00, 0x01, 0x01];

    const value = new Uint8Array(byteArray);
    await characteristic.writeValue(value);

    console.log('Comando enviado com sucesso:', byteArray);
  } catch (error) {
    console.error('Erro ao enviar o comando:', error);
  }
}


function executarComandoEmLoop() {
  // Chame a função inicialmente
  postCommandWriteHeart();

  // Em seguida, configure um intervalo para executar a função a cada 1 minuto (60.000 milissegundos).
  setInterval(postCommandWriteHeart, 60000);
}











function conectarDevice() {
  bluetoothDevice = null;
  log('Requesting any Bluetooth Device...');
  return navigator.bluetooth.requestDevice(navigatorOptions)
    .then(device => {
      log('Connecting to GATT Server...');
      bluetoothDevice = device;
      bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
      return conectarBluetooth();
    });
}

function printDevice() {
  console.log(bluetoothDevice);
}

function conectarBluetooth() {
  return exponentialBackoff(3 /* max retries */, 2 /* seconds delay */,
    function toTry() {
      time('Connecting to Bluetooth Device... ');
      return bluetoothDevice.gatt.connect();
    },
    function success(result) {
      log('> Bluetooth Device connected. Try disconnect it now.');
      return result;
    },
    function fail() {
      time('Failed to reconnect.');
    });
}

function onDisconnected() {
  log('> Bluetooth Device disconnected');
  conectarBluetooth();
}

function exponentialBackoff(max, delay, toTry, success, fail) {
  return toTry()
    .then(result => success(result))
    .catch(_ => {
      if (max === 0) {
        return fail();
      }
      time('Retrying in ' + delay + 's... (' + max + ' tries left)');
      return new Promise(resolve => {
        setTimeout(function () {
          resolve(exponentialBackoff(--max, delay * 2, toTry, success, fail));
        }, delay * 1000);
      });
    });
}








document.querySelector('#conectarDevice').addEventListener('click', function (event) {
  event.stopPropagation();
  event.preventDefault();

  // if (isWebBluetoothEnabled()) {
  conectarDevice();
  // }
});


document.querySelector('#printDevice').addEventListener('click', function (event) {
  event.stopPropagation();
  event.preventDefault();

  // if (isWebBluetoothEnabled()) {
  printDevice();
  // }
});


document.querySelector('#coracaoPedir').addEventListener('click', function (event) {
  event.stopPropagation();
  event.preventDefault();

  // if (isWebBluetoothEnabled()) {
  executarComandoEmLoop();
  // }
});


















// const device = await navigator.bluetooth.requestDevice(options);
// log('> Name:             ' + device.name);
// log('> Id:               ' + device.id);
// log('> Conectado:        ' + device.gatt.connected);

async function botaoBateria() {
  try {
    log('Buscando dispositivo...');
    const device = await navigator.bluetooth.requestDevice({
      // filters: [{ services: ['0x180D'] }]
      acceptAllDevices: true,
      optionalServices: ['5833ff01-9b8b-5191-6142-22a4536ef123', '6e400001-b5a3-f393-e0a9-e50e24dcca9d', '0000aaa0-0000-1000-8000-aabbccddeeff', 'battery_service']
    });

    log('Connecting to GATT Server...');
    const server = await device.gatt.connect();

    log('Getting Battery Service...');
    const service = await server.getPrimaryService('battery_service');

    log('Getting Battery Level Characteristic...');
    const characteristic = await service.getCharacteristic('battery_level');

    log('Reading Battery Level...');
    const value = await characteristic.readValue();


    log('> Battery Level is ' + value.getUint8(0) + '%');
  } catch (error) {
    log('Argh! ' + error);
  }
}

// '5833ff01-9b8b-5191-6142-22a4536ef123'
// '5833ff03-9b8b-5191-6142-22a4536ef123'

// '6e400001-b5a3-f393-e0a9-e50e24dcca9d'
// '6e400003-b5a3-f393-e0a9-e50e24dcca9d'

// if (serviceUuid.startsWith('0x')) {
// serviceUuid = parseInt(serviceUuid);
// }

// if (characteristicUuid.startsWith('0x')) {
// characteristicUuid = parseInt(characteristicUuid);
// }











export { testarGetDevices }
