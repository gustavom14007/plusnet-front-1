
import { onMounted, reactive, ref, onBeforeMount } from 'vue';
import { useQuasar } from "quasar";

import useNotify from './UseNotify';



export default function useLocal() {
  const quasar$ = useQuasar();
  const { notifyError, notifySuccess } = useNotify()

  const logData = ref([]);

  function log(texto) {
    // Push the log message to the logData array
    logData.value.push(`<strong>${texto}</strong>`);
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

  //  essa variável é pra pegar o ObjetoCoracao, ele inicializa no onMounted
  const ObjetoCoracaoLocalStorage = reactive({
    idPessoa: [],
    tipo: [],
    batimentos: [],
    saturacao: [],
    pressaoArterial: [],
    pressaoSistolica: [],
    pressaoDiastolica: [],
    horas: [],
    calendario: [],
  });

  const atualizarObjetoCoracaoLocalStorage = () => {
    console.log("ATUALIZAR ", ObjetoCoracaoLocalStorage.value)
    ObjetoCoracaoLocalStorage.value = quasar$.localStorage.getItem("ObjetoCoracao");
  };

  const setObjetoCoracaoLocalStorage = () => {
    console.log("SET ", ObjetoCoracaoLocalStorage.value)
    quasar$.localStorage.set("ObjetoCoracao", ObjetoCoracaoLocalStorage.value);
  };

  function adicionarObjetoCoracaoLocalStorage(
    idPessoa,
    tipo,
    batimentosPorMinuto,
    saturacaoOxigenio,
    pressaoArterial,
    pressaoSistolica,
    pressaoDiastolica
  ) {
    //garantir que o objeto está atualizado
    atualizarObjetoCoracaoLocalStorage();

    ObjetoCoracaoLocalStorage.value.idPessoa.push(idPessoa)
    ObjetoCoracaoLocalStorage.value.tipo.push(tipo)
    ObjetoCoracaoLocalStorage.value.batimentos.push(batimentosPorMinuto)
    ObjetoCoracaoLocalStorage.value.saturacao.push(saturacaoOxigenio)
    ObjetoCoracaoLocalStorage.value.pressaoArterial.push(pressaoArterial)
    ObjetoCoracaoLocalStorage.value.pressaoSistolica.push(pressaoSistolica)
    ObjetoCoracaoLocalStorage.value.pressaoDiastolica.push(pressaoDiastolica)
    ObjetoCoracaoLocalStorage.value.horas.push(getDataAtual())
    ObjetoCoracaoLocalStorage.value.calendario.push(getHorarioAtual())

    // Adicione os novos dados ao array dentro do objeto e depois bota no local storage
    setObjetoCoracaoLocalStorage();

    //garantir que o objeto está atualizado
    atualizarObjetoCoracaoLocalStorage();

    console.log("ADICIONAR ", ObjetoCoracaoLocalStorage.value)
  }


  // const inicalizarObjetoCoracaoLocalStorage = () => {
  //   //garantir que ta atualizado
  //   atualizarObjetoCoracaoLocalStorage()
  //   console.log("inicializazr")
  //   //checar se ele tem valor

  //   console.log("existe no local storage")
  //   if (ObjetoCoracaoLocalStorage.value == null || !!ObjetoCoracaoLocalStorage.value.idPessoa || ObjetoCoracaoLocalStorage.value.idPessoa.length <= 0) {
  //     console.log('existe idPessoa no local storage')

  //     console.log("<= 0")
  //     // inicializar com valores padrão? acho que bom perguntar pro usuário
  //     try {
  //       quasar$
  //         .dialog({
  //           title: "Confirmar",
  //           message: `Deseja inicializar com valores padrão para demonstração?`,
  //           cancel: true,
  //           persistent: true,
  //         })
  //         .onOk(() => {

  //           notifySuccess("Inicializado com valores padrão!");
  //           // iniciar valores padrão local storage
  //           ObjetoCoracaoLocalStorage.value = {
  //             idPessoa: [1, 1, 1, 1, 1],
  //             tipo: ['coracao', 'coracao', 'coracao', 'coracao', 'coracao'],
  //             batimentos: ['80', '73', '67', '77', '83'],
  //             saturacao: ['98%', '90%', '95%', '100%', '99%'],
  //             pressaoArterial: ["127/96", "118/74", "113/87", "116/89", "115/77"],
  //             pressaoSistolica: ['127', '118', '113', '116', '115'],
  //             pressaoDiastolica: ['96', '74', '87', '89', '77'],
  //             horas: ["17:10:18", "18:28:00", "19:25:19", "20:49:03", "21:59:59"],
  //             calendario: ["2023-11-07", "2023-11-07", "2023-11-07", "2023-11-07", "2023-11-07"],
  //           }

  //           setObjetoCoracaoLocalStorage()
  //           atualizarObjetoCoracaoLocalStorage()

  //         }).onDismiss(() => {

  //           notifySuccess("Inicializando com valores vazio!")
  //           //não precisa fazer nada

  //         })
  //     } catch (error) {
  //       notifyError(error.message);
  //     }
  //   } else {
  //     // nao fazer nada
  //     ObjetoCoracaoLocalStorage.value = {
  //       idPessoa: [1, 1, 1, 1, 1],
  //       tipo: ['coracao', 'coracao', 'coracao', 'coracao', 'coracao'],
  //       batimentos: ['80', '73', '67', '77', '83'],
  //       saturacao: ['98%', '90%', '95%', '100%', '99%'],
  //       pressaoArterial: ["127/96", "118/74", "113/87", "116/89", "115/77"],
  //       pressaoSistolica: ['127', '118', '113', '116', '115'],
  //       pressaoDiastolica: ['96', '74', '87', '89', '77'],
  //       horas: ["17:10:18", "18:28:00", "19:25:19", "20:49:03", "21:59:59"],
  //       calendario: ["2023-11-07", "2023-11-07", "2023-11-07", "2023-11-07", "2023-11-07"],
  //     }

  //     setObjetoCoracaoLocalStorage()
  //     atualizarObjetoCoracaoLocalStorage()
  //   }

  // }

  const inicalizarObjetoCoracaoLocalStorage = () => {
    // Ensure that it's updated
    atualizarObjetoCoracaoLocalStorage();
    console.log("inicializar");

    // Check if it exists in local storage
    if (
      !ObjetoCoracaoLocalStorage.value ||
      !ObjetoCoracaoLocalStorage.value.idPessoa ||
      ObjetoCoracaoLocalStorage.value.idPessoa.length <= 0
    ) {
      console.log('Não existe idPessoa no local storage');
      // Initialize with default values or ask the user
      try {
        quasar$
          .dialog({
            title: "Confirmar",
            message: `Deseja inicializar com valores padrão para demonstração?`,
            cancel: true,
            persistent: true,
          })
          .onOk(() => {
            notifySuccess("Inicializado com valores padrão!");
            // Initialize with default values
            ObjetoCoracaoLocalStorage.value = {
              idPessoa: [1, 1, 1, 1, 1],
              tipo: ['coracao', 'coracao', 'coracao', 'coracao', 'coracao'],
              batimentos: ['80', '73', '67', '77', '83'],
              saturacao: ['98%', '90%', '95%', '100%', '99%'],
              pressaoArterial: ["127/96", "118/74", "113/87", "116/89", "115/77"],
              pressaoSistolica: ['127', '118', '113', '116', '115'],
              pressaoDiastolica: ['96', '74', '87', '89', '77'],
              horas: ["17:10:18", "18:28:00", "19:25:19", "20:49:03", "21:59:59"],
              calendario: ["2023-11-07", "2023-11-07", "2023-11-07", "2023-11-07", "2023-11-07"],
            };
            setObjetoCoracaoLocalStorage();
            atualizarObjetoCoracaoLocalStorage();
          })
          .onDismiss(() => {
            notifySuccess("Inicializando com valores vazios!");
            // No need to do anything
          });
      } catch (error) {
        notifyError(error.message);
      }
    }
  };


  onMounted(() => {
    // log("UseLocal.js")
    inicalizarObjetoCoracaoLocalStorage()
  })



  return {
    log,
    logData,
    ObjetoCoracaoLocalStorage,
    atualizarObjetoCoracaoLocalStorage,
    setObjetoCoracaoLocalStorage,
    adicionarObjetoCoracaoLocalStorage,
    inicalizarObjetoCoracaoLocalStorage,



  }
}
