import { objetoNoLocalStorage, adicionarAoLocalStorage, obterBPMsDoLocalStorage } from './LocalStorage.js';
import { drawWaves } from './App.js';




function log(texto) {
  const item = document.createElement('li');
  item.innerHTML = `<strong>${texto}</strong>`;
  const lista = document.getElementById('log');
  lista.appendChild(item);
}

// converte a entrada de HEX para DECIMAL
function hexToDecimal(hexInput) {
  let hexArray = "";
  if (Array.isArray(hexInput)) {
    hexArray = hexInput;
  } else {
    hexArray = hexInput.split(' ');
  }

  let decimalValue = 0;
  for (let i = 0; i < hexArray.length; i++) {
    // Converte cada valor hexadecimal em decimal e acumula no valor final
    const hexValue = parseInt(hexArray[i], 16);
    decimalValue += hexValue * Math.pow(256, hexArray.length - 1 - i);
  }
  return decimalValue;
}

function converterValueParaHex(value) {
  let arrayValoresHex = [];
  // Mostrar os valores em formato hexadecimal
  for (let i = 0; i < value.byteLength; i++) {
    arrayValoresHex.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
  }
  return arrayValoresHex
}

function converterValueParaDecimal(value) {
  let arrayValoresDecimal = [];
  for (let i = 0; i < value.byteLength; i++) {
    arrayValoresDecimal.push(value.getUint8(i));
  }
  return arrayValoresDecimal;
}

function obterDiaSemana(numeroDia) {
  const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return diasDaSemana[numeroDia] || 'Desconhecido';
}

function checarArraysIguais(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function time() {
  let horarioAtual = '[' + new Date().toJSON().substr(11, 8) + ']'
  // log( horarioAtual );
  return horarioAtual
}



function verificarTipoComando(arrayValoresDecimal, arrayValoresHex) {

  let tipoDeDado = 'desconhecido';
  //checar se é coração/passo:
  if (arrayValoresDecimal.length >= 20) {
    let primeirosCinco = arrayValoresDecimal.slice(0, 6);

    let tipoPassos = [205, 0, 17, 21, 1, 12]
    let tipoCoracao = [205, 0, 17, 21, 1, 14]

    if (checarArraysIguais(primeirosCinco, tipoCoracao)) {
      tipoDeDado = 'coracao'
    } else if (checarArraysIguais(primeirosCinco, tipoPassos)) {
      tipoDeDado = 'passos'
    } else {
      tipoDeDado = 'desconhecido'
    }

  } else {

    let tipoAbrirCamera = [205, 0, 5, 28, 1, 3, 0, 0]
    let tipoTirarFoto = [205, 0, 5, 28, 1, 2, 0, 0]
    let tipoFecharCamera = [205, 0, 5, 28, 1, 4, 0, 0]
    let tipoBuscandoDispositivo = [205, 0, 5, 28, 1, 1, 0, 0]

    if (checarArraysIguais(arrayValoresDecimal, tipoAbrirCamera)) {
      tipoDeDado = "abrirCamera"
    } else if (checarArraysIguais(arrayValoresDecimal, tipoTirarFoto)) {
      tipoDeDado = "tirarFoto"
    } else if (checarArraysIguais(arrayValoresDecimal, tipoFecharCamera)) {
      tipoDeDado = "fecharCamera"
    } else if (checarArraysIguais(arrayValoresDecimal, tipoBuscandoDispositivo)) {
      tipoDeDado = "buscandoDispositivo"
    }

  }

  return tipoDeDado
}



function lidarComDadosCoracao(tipoComando, arrayValoresDecimal, arrayValoresHex, textoTempoAtual) {

  const pressaoArterial = `${arrayValoresDecimal[18]}/${arrayValoresDecimal[17]}`;
  const batimentosPorMinuto = `${arrayValoresDecimal[19]}`;
  const saturacaoOxigenio = `${arrayValoresDecimal[16]}%`;

  adicionarAoLocalStorage(tipoComando, pressaoArterial, batimentosPorMinuto, saturacaoOxigenio);
  drawWaves();

  log("----")
  log(textoTempoAtual)
  log(`Tipo: ${tipoComando} `)
  log(`Pressão Arterial: ${pressaoArterial} `)
  log(`Saturação: ${saturacaoOxigenio} `)
  log(`BPM:  ${batimentosPorMinuto} `)
  log("----")


  let dadosCoracao = {
    tipo: tipoComando,
    pressaoArterial,
    saturacaoOxigenio,
    batimentosPorMinuto,
  };



  return dadosCoracao;
}


function lidarComDadosPassos(tipoComando, arrayValoresDecimal, arrayValoresHex, textoTempoAtual) {

  const passos = `${hexToDecimal(arrayValoresHex.slice(8, 14))}`;
  const calorias = `${hexToDecimal([arrayValoresDecimal[18], arrayValoresDecimal[19]])}`

  log("----")
  log(textoTempoAtual)
  log(`Tipo: ${tipoComando} `)
  log(`Passos: ${passos} `)
  log(`Calorias: ${calorias}`)
  log("----")

  let dadosPassos = {
    tipo: tipoComando,
    passos,
    calorias
  }

  return dadosPassos;
}

function lidarComDadosDesconhecido(tipoComando, arrayValoresDecimal, arrayValoresHex, textoTempoAtual) {

  let dadosDesconhecido = {
    tipo: tipoComando
  }

  log("----")
  log(textoTempoAtual)
  log(`Tipo: ${tipoComando} `)
  log("----")

  return dadosDesconhecido
}





export {
  log, hexToDecimal, converterValueParaHex,
  converterValueParaDecimal, obterDiaSemana,
  checarArraysIguais, time,
  verificarTipoComando, lidarComDadosCoracao, lidarComDadosPassos, lidarComDadosDesconhecido
}






// Verifique se o objeto já existe no localStorage
let objetoNoLocalStorage = JSON.parse(localStorage.getItem('meuObjeto'));

// Se o objeto não existir, crie um novo objeto com um array vazio
if (!objetoNoLocalStorage) {
  const novoObjeto = {
    dados: [],
  };

  localStorage.setItem('meuObjeto', JSON.stringify(novoObjeto));
}



function adicionarAoLocalStorage(tipo, pressaoArterial, saturacaoOxigenio, batimentosPorMinuto) {

  // Recupere o objeto do localStorage
  objetoNoLocalStorage = JSON.parse(localStorage.getItem('meuObjeto'));

  const novoDado = {
    tipo,
    pressaoArterial,
    saturacaoOxigenio,
    batimentosPorMinuto,
    dateTime: new Date().toLocaleString(),
  };

  // Adicione os novos dados ao array dentro do objeto
  objetoNoLocalStorage.dados.push(novoDado);

  // Atualize o objeto no localStorage
  localStorage.setItem('meuObjeto', JSON.stringify(objetoNoLocalStorage));


  // Retorne o objeto atualizado
  return objetoNoLocalStorage;
}





// Função para recuperar os dados de BPM do localStorage
function obterBPMsDoLocalStorage() {
  // Recupere o objeto do localStorage
  objetoNoLocalStorage = JSON.parse(localStorage.getItem('meuObjeto'));

  // Verifique se o objeto e o array de dados existem
  if (objetoNoLocalStorage && Array.isArray(objetoNoLocalStorage.dados)) {
    // Crie um novo array com os valores de BPM
    const arrayDeBPMs = objetoNoLocalStorage.dados.map(dado => dado.batimentosPorMinuto);

    return arrayDeBPMs;
  } else {
    // Se o objeto ou o array não existirem, retorne um array vazio
    return [];
  }
}



// !TODO: enviar para API



export { objetoNoLocalStorage, adicionarAoLocalStorage, obterBPMsDoLocalStorage }


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





import {
  log, hexToDecimal, converterValueParaHex, converterValueParaDecimal,
  obterDiaSemana,
  checarArraysIguais, time,
  verificarTipoComando, lidarComDadosCoracao, lidarComDadosPassos, lidarComDadosDesconhecido
} from './Utils.js';
import { testarGetDevices } from './Conexao.js'
import { objetoNoLocalStorage, adicionarAoLocalStorage, obterBPMsDoLocalStorage } from './LocalStorage.js';



var mode = 'bar';
var canvas = document.querySelector('canvas');

log("Arquivo App.js aberto")
drawWaves()




function handleNotifications(event) {

  log("@@@@@")

  console.log('@@@@@@')

  let value = event.target.value;
  console.log("Printando no console o VALUE: ", value);

  let arrayValoresHex = converterValueParaHex(value);
  console.log("Printando no console  o arrayValoresHex: ", arrayValoresHex);

  let arrayValoresDecimal = converterValueParaDecimal(value);
  console.log("Printando no console  o arrayValoresDecimal: ", arrayValoresDecimal)

  let textoTempoAtual = time();
  console.log("Printando no console o tempo atual", textoTempoAtual)

  console.log('@@@@@@')



  let tipoComando = verificarTipoComando(arrayValoresDecimal, arrayValoresHex)


  if (tipoComando == 'coracao') {
    lidarComDadosCoracao(tipoComando, arrayValoresDecimal, arrayValoresHex, textoTempoAtual)
  }
  else if (tipoComando == 'passos') {
    lidarComDadosPassos(tipoComando, arrayValoresDecimal, arrayValoresHex, textoTempoAtual)
  }
  else {
    lidarComDadosDesconhecido(tipoComando, arrayValoresDecimal, arrayValoresHex, textoTempoAtual)
  }




  log('Valores em formato hexadecimal: ' + arrayValoresHex.join(' '));
  log('Valores em formato Decimal: ' + arrayValoresDecimal.join(' '));


  log("@@@@@")

}







canvas.addEventListener('click', event => {
  mode = mode === 'bar' ? 'line' : 'bar';
  drawWaves();
});

function drawWaves() {
  requestAnimationFrame(() => {
    let arrayBPMCoracao = obterBPMsDoLocalStorage();
    canvas.width = parseInt(getComputedStyle(canvas).width.slice(0, -2)) * devicePixelRatio;
    canvas.height = parseInt(getComputedStyle(canvas).height.slice(0, -2)) * devicePixelRatio;

    var context = canvas.getContext('2d');
    var margin = 2;
    var max = Math.max(0, Math.round(canvas.width / 11));
    var offset = Math.max(0, arrayBPMCoracao.length - max);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = '#00796B';
    if (mode === 'bar') {
      for (var i = 0; i < Math.max(arrayBPMCoracao.length, max); i++) {
        var barHeight = Math.round(arrayBPMCoracao[i + offset] * canvas.height / 200);
        context.rect(11 * i + margin, canvas.height - barHeight, margin, Math.max(0, barHeight - margin));
        context.stroke();
      }
    } else if (mode === 'line') {
      context.beginPath();
      context.lineWidth = 6;
      context.lineJoin = 'round';
      context.shadowBlur = '1';
      context.shadowColor = '#333';
      context.shadowOffsetY = '1';
      for (var i = 0; i < Math.max(arrayBPMCoracao.length, max); i++) {
        var lineHeight = Math.round(arrayBPMCoracao[i + offset] * canvas.height / 200);
        if (i === 0) {
          context.moveTo(11 * i, canvas.height - lineHeight);
        } else {
          context.lineTo(11 * i, canvas.height - lineHeight);
        }
        context.stroke();
      }
    }
  });
}

window.onresize = drawWaves;

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    drawWaves();
  }
})












document.querySelector('#lerInfo').addEventListener('click', function (event) {
  event.stopPropagation();
  event.preventDefault();

  // if (isWebBluetoothEnabled()) {
  testarGetDevices();
  // }
});






// Exemplo de dados a serem adicionados







export { handleNotifications, drawWaves }
