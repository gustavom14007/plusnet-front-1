import { ref } from 'vue';
import useDataHandling from './UseDataHandling.js';
import useHandleNotifications from './UseHandleNotifications.js';

import { BleClient } from '@capacitor-community/bluetooth-le';

const { handleNotifications } = useHandleNotifications()
const { log, time } = useDataHandling()


let globalServer;
let globalDevice;
let globalService;
let globalCharacteristic;

// write 5833ff02-9b8b-5191-6142-22a4536ef123
// read, notify 00002a19-0000-1000-8000-00805f9b34fb
//notify 6e400003-b5a3-f393-e0a9-e50e24dcca9d
//notify 5833ff03-9b8b-5191-6142-22a4536ef123

const navigatorOptions = {
  acceptAllDevices: true,
  optionalServices: [
    '5833ff01-9b8b-5191-6142-22a4536ef123',
    '6e400001-b5a3-f393-e0a9-e50e24dcca9d',
    '0000aaa0-0000-1000-8000-aabbccddeeff',
    '0000180d-0000-1000-8000-00805f9b34fb',
    '0000180f-0000-1000-8000-00805f9b34fb'
  ]
};

const servicesWithCharacteristics = {}; // Objeto para mapear serviços e suas características



function getSupportedProperties(characteristic) {
  const supportedProperties = [];
  for (const p in characteristic.properties) {
    if (characteristic.properties[p] === true) {
      supportedProperties.push(p.toUpperCase());
    }
  }
  return '[' + supportedProperties.join(', ') + ']';
}



let bluetoothDevice;

async function testarBLE() {


  // esse vai ser só pra conectar em um device:
  try {

    await BleClient.initialize();

    await BleClient.isEnabled()

    //pegar device
    bluetoothDevice = await conectarBluetooth()
    console.log(bluetoothDevice.deviceId)
    console.log(bluetoothDevice)

    // connect gatt
    let server = await BleClient.connect(bluetoothDevice.deviceId)

    let services = await conectarServices(bluetoothDevice);
    console.log(services)

    tratarServices(services, bluetoothDevice.deviceId)

  } catch (error) {

  }

}



async function conectarBluetooth() {
  try {
    bluetoothDevice = await BleClient.requestDevice(navigatorOptions)
    await BleClient.connect(bluetoothDevice.deviceId);
    return bluetoothDevice;

  } catch (error) {
    console.log(error)
  }

}

async function conectarServices(bluetoothDevice) {
  try {

    log('Getting Services...');
    let services = await BleClient.getServices(bluetoothDevice.deviceId)
    return services;

  } catch (error) {
    console.log(error)
  }

}

let bluetoothDeviceId
async function tratarServices(services, deviceInput) {
  try {
    log('Getting Characteristics...');
    let queue = Promise.resolve();

    const deviceId = deviceInput; // Substitua por seu ID de dispositivo
    const device = bluetoothDevice // Solicita o dispositivo antes de iniciar notificações

    bluetoothDeviceId = deviceInput;

    if (!device) {
      log('Device not found. Request the device first.');
      return;
    }

    services.forEach(async (service) => {
      try {
        log('> Service: ' + service.uuid);
        servicesWithCharacteristics[service.uuid] = {
          service: service,
          characteristics: [],
        };

        service.characteristics.forEach(async (characteristic) => {
          const characteristicInfo = {
            uuid: characteristic.uuid,
            properties: getSupportedProperties(characteristic),
          };

          servicesWithCharacteristics[service.uuid].characteristics.push(characteristicInfo);

          if (
            getSupportedProperties(characteristic) === '[NOTIFY]' ||
            getSupportedProperties(characteristic) === '[READ, NOTIFY]'
          ) {
            const serviceUuid = service.uuid;
            const characteristicUuid = characteristic.uuid;

            const callback = (value) => {
              // Trate os dados recebidos aqui
              log('Received notification:', value);
            };

            try {
              await BleClient.startNotifications(deviceId, serviceUuid, characteristicUuid, (value) => {
                handleNotifications(value)
              });
              log('> Notifications started for >> Characteristic: ' + characteristic.uuid + ' ' + getSupportedProperties(characteristic));
            } catch (notifyError) {
              log('Failed to start notifications: ' + notifyError);
            }
          } else {
            log('> Characteristic: ' + characteristic.uuid + ' ' + getSupportedProperties(characteristic));
          }
        });
      } catch (serviceError) {
        log('Error processing service ' + service.uuid + ': ' + serviceError);
      }
    });

    await queue; // Aguarda o término de todas as operações em fila
  } catch (error) {
    log('Argh! ' + error);
  }
}





async function postCommandWriteHeart(bluetoothDevice) {
  try {

    if (!bluetoothDeviceId) {
      bluetoothDevice = conectarBluetooth()
      bluetoothDeviceId = bluetoothDevice.deviceId;
    }

    const serviceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9d';
    const characteristicUUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9d';

    const byteArray = [0xCD, 0x00, 0x06, 0x12, 0x01, 0x18, 0x00, 0x01, 0x01];
    const value = new Uint8Array(byteArray);

    // const dataView = numbersToDataView(byteArray);
    await BleClient.writeWithoutResponse(bluetoothDeviceId, serviceUUID, characteristicUUID, value);
    console.log('Comando enviado com sucesso:', byteArray);

  } catch (error) {
    console.error('Erro ao enviar o comando:', error);
  }
}

function executarComandoEmLoop(bluetoothDevice) {
  // Chame a função inicialmente
  postCommandWriteHeart(bluetoothDevice);

  // Em seguida, configure um intervalo para executar a função a cada 1 minuto (60.000 milissegundos).
  setInterval(postCommandWriteHeart(bluetoothDevice), 45000);
}

// let connecting = false;
// async function conectarDevice() {
//   if (connecting) {
//     return;
//   }
//   try {
//     connecting = true;
//     bluetoothDevice = null;
//     log('Requesting any Bluetooth Device...');
//     const device = await navigator.bluetooth.requestDevice(navigatorOptions);
//     log('Connecting to GATT Server...');
//     bluetoothDevice = device;
//     bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
//     await conectarBluetooth();
//   } catch (error) {
//     log('Argh! ' + error);
//   } finally {
//     connecting = false;
//   }
// }

function printDevice() {
  log(bluetoothDevice);
}






export { postCommandWriteHeart, executarComandoEmLoop, testarBLE, printDevice, bluetoothDevice };
