
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
