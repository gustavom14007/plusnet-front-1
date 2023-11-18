
import { ref } from "vue";


import useLocalStorage from "./UseLocalStorage.js";

const { objetoNoLocalStorage, adicionarAoLocalStorage } = useLocalStorage();

import useDataHandling from "./UseDataHandling.js";

const { log,
  hexToDecimal,
  converterValueParaHex,
  converterValueParaDecimal,
  obterDiaSemana,
  checarArraysIguais,
  time,
  verificarTipoComando,
  lidarComDadosCoracao,
  lidarComDadosPassos,
  lidarComDadosDesconhecido } = useDataHandling();


export default function useHandleNotifications() {
  function handleNotifications(event) {
    log("@@@@@")

    // console.log('@@@@@@')

    // console.log(event)

    let value = event;
    // console.log("Printando no console o VALUE: ", value);

    let arrayValoresHex = converterValueParaHex(value);
    // console.log("Printando no console o arrayValoresHex: ", arrayValoresHex);

    let arrayValoresDecimal = converterValueParaDecimal(value);
    // console.log("Printando no console o arrayValoresDecimal: ", arrayValoresDecimal)

    let textoTempoAtual = time();
    // console.log("Printando no console o tempo atual", textoTempoAtual)

    // console.log('@@@@@@')

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

  return {
    handleNotifications,
  };
}
