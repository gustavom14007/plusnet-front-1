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
