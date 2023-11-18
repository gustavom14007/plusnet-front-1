
import { onMounted, ref } from 'vue';
import useLocal from './UseLocal';
import useApi from './UseApi';
import useNotify from "src/composables/UseNotify";

export default function useUtilitario() {

  const {
    ObjetoCoracaoLocalStorage,
    adicionarObjetoCoracaoLocalStorage,
    log,
    logData,
    inicalizarObjetoCoracaoLocalStorage,

  } = useLocal();

  const { post, getById, update, list } = useApi();
  const { notifyError, notifySuccess } = useNotify();




  const handleSubmitDadoCoracao = async (id_paciente, bpm, saturacao, sistolica, diastolica, horas, dia) => {
    try {
      await post('coracao', {
        id_paciente,
        bpm,
        saturacao,
        sistolica,
        diastolica,
        horas,
        dia
      });
      notifySuccess("Salvo com sucesso!");
    } catch (error) {
      notifyError(error.message);
      console.log(error.message)
    }
  };















  // esta variável guarda um array com todos os LOG que foram enviados



  function verificarTipoComando(arrayValoresDecimal, arrayValoresHex) {
    let tipoDeDado = "desconhecido";
    //checar se é coração/passo:
    if (arrayValoresDecimal.length >= 20) {
      let primeirosCinco = arrayValoresDecimal.slice(0, 6);

      let tipoPassos = [205, 0, 17, 21, 1, 12];
      let tipoCoracao = [205, 0, 17, 21, 1, 14];

      if (checarArraysIguais(primeirosCinco, tipoCoracao)) {
        tipoDeDado = "coracao";
      } else if (checarArraysIguais(primeirosCinco, tipoPassos)) {
        tipoDeDado = "passos";
      } else {
        tipoDeDado = "desconhecido";
      }
    } else {
      let tipoAbrirCamera = [205, 0, 5, 28, 1, 3, 0, 0];
      let tipoTirarFoto = [205, 0, 5, 28, 1, 2, 0, 0];
      let tipoFecharCamera = [205, 0, 5, 28, 1, 4, 0, 0];
      let tipoBuscandoDispositivo = [205, 0, 5, 28, 1, 1, 0, 0];
      let tipoBuscandoDispositivo2 = [220, 0, 5, 18, 24, 0]
      let tipoBuscandoDispositivo3 = [220, 0, 5, 18, 24, 0, 9, 1]

      if (checarArraysIguais(arrayValoresDecimal, tipoAbrirCamera)) {
        tipoDeDado = "abrirCamera";
      } else if (checarArraysIguais(arrayValoresDecimal, tipoTirarFoto)) {
        tipoDeDado = "tirarFoto";
      } else if (checarArraysIguais(arrayValoresDecimal, tipoFecharCamera)) {
        tipoDeDado = "fecharCamera";
      } else if (
        checarArraysIguais(arrayValoresDecimal, tipoBuscandoDispositivo)
      ) {
        tipoDeDado = "buscandoDispositivo";
      } else if (checarArraysIguais(arrayValoresDecimal, tipoBuscandoDispositivo2)) {
        tipoDeDado = "buscandoDispositivo2"
      } else if (checarArraysIguais(arrayValoresDecimal, tipoBuscandoDispositivo3)) {
        tipoDeDado = "buscandoDispositivo3"
      }
    }

    return tipoDeDado;
  }

  function lidarComDadosCoracao(
    idPessoaInput,
    tipoComando,
    arrayValoresDecimal,
    arrayValoresHex,
    textoTempoAtual,
  ) {
    // converter os decimais nos valores que eu quero usar
    const idPessoa = idPessoaInput;
    const tipo = tipoComando
    const batimentosPorMinuto = `${arrayValoresDecimal[19]}`;
    const saturacaoOxigenio = `${arrayValoresDecimal[16]}%`;
    const pressaoArterial = `${arrayValoresDecimal[18]}/${arrayValoresDecimal[17]}`;
    const pressaoSistolica = `${arrayValoresDecimal[18]}`;
    const pressaoDiastolica = `${arrayValoresDecimal[17]}`;

    adicionarObjetoCoracaoLocalStorage(
      idPessoa,
      tipo,
      batimentosPorMinuto,
      saturacaoOxigenio,
      pressaoArterial,
      pressaoSistolica,
      pressaoDiastolica
    );

    let dadosCoracao = {
      idPessoa,
      tipo,
      batimentosPorMinuto,
      saturacaoOxigenio,
      pressaoArterial,
      pressaoSistolica,
      pressaoDiastolica,
      horas: getHorarioAtual(),
      calendario: getDataAtual(),
    };


    //LOGICA PARA ENVIAR PARA API VIA
    handleSubmitDadoCoracao(
      idPessoa,
      batimentosPorMinuto,
      arrayValoresDecimal[16],
      pressaoSistolica,
      pressaoDiastolica,
      getHorarioAtual(),
      getDataAtual()
    )

    return dadosCoracao;
  }

  function lidarComDadosPassos(
    tipoComando,
    arrayValoresDecimal,
    arrayValoresHex,
    textoTempoAtual
  ) {
    const passos = `${hexToDecimal(arrayValoresHex.slice(8, 14))}`;
    const calorias = `${hexToDecimal([
      arrayValoresDecimal[18],
      arrayValoresDecimal[19],
    ])}`;

    log("----");
    log(textoTempoAtual);
    log(`Tipo: ${tipoComando} `);
    log(`Passos: ${passos} `);
    log(`Calorias: ${calorias}`);
    log("----");

    let dadosPassos = {
      tipo: tipoComando,
      passos,
      calorias,
    };

    return dadosPassos;
  }

  function lidarComDadosDesconhecido(
    tipoComando,
    arrayValoresDecimal,
    arrayValoresHex,
    textoTempoAtual
  ) {
    let dadosDesconhecido = {
      tipo: tipoComando,
    };

    log("----");
    log(textoTempoAtual);
    log(`Tipo: ${tipoComando} `);
    log("----");

    return dadosDesconhecido;
  }




  function hexToDecimal(hexInput) {
    let hexArray = "";
    if (Array.isArray(hexInput)) {
      hexArray = hexInput;
    } else {
      hexArray = hexInput.split(" ");
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
      arrayValoresHex.push(
        "0x" + ("00" + value.getUint8(i).toString(16)).slice(-2)
      );
    }
    return arrayValoresHex;
  }

  function converterValueParaDecimal(value) {
    let arrayValoresDecimal = [];
    for (let i = 0; i < value.byteLength; i++) {
      arrayValoresDecimal.push(value.getUint8(i));
    }
    return arrayValoresDecimal;
  }

  function obterDiaSemana(numeroDia) {
    const diasDaSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return diasDaSemana[numeroDia] || "Desconhecido";
  }

  function checarArraysIguais(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }


  function getDataAtual() {
    const date = new Date();
    let day = date.getDate();
    let month = (date.getMonth() + 1);
    let year = date.getFullYear();
    let currentDate = `${year}-${month}-${day}`;

    return currentDate
  }


  function getHorarioAtual() {
    let horarioAtual = "" + new Date().toJSON().substr(11, 8) + "";

    return horarioAtual;
  }

  // ! TIME() APAGADA
  // function time() {
  //   let horarioAtual = "" + new Date().toJSON().substr(11, 8) + "";
  //   return horarioAtual;
  // }



  onMounted(() => {
    // log("UseUtilitarios.js")
  })


  return {
    logData,
    log,
    hexToDecimal,
    converterValueParaHex,
    converterValueParaDecimal,
    obterDiaSemana,
    checarArraysIguais,
    getDataAtual,
    getHorarioAtual,

    verificarTipoComando,
    lidarComDadosCoracao,
    lidarComDadosPassos,
    lidarComDadosDesconhecido,

    ObjetoCoracaoLocalStorage,
    adicionarObjetoCoracaoLocalStorage,
    inicalizarObjetoCoracaoLocalStorage,


  }
}
