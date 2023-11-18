<template>
  <q-page padding>
    <div class="justify-center row">
      <div class="text-center col-12">
        <p v-if="conectadoDispositivo">
          <!-- Botar cor e deixar redondo -->
          <q-avatar color="positive" text-color="white" icon="bluetooth" />
        </p>
        <p v-else>
          <!-- Botar cor e deixar redondo -->
          <q-avatar
            color="accent"
            text-color="white"
            icon="bluetooth_disabled"
          />
        </p>
      </div>
      <q-input
        class="col-6 q-gutter-y-md"
        label="ID de usuário"
        v-model="idPessoaInput"
      ></q-input>

      <div class="col-12 row justify-center q-pa-sm">
        <div class="col-6 q-pt-md">
          <q-btn
            :label="
              conectadoDispositivo
                ? 'Dispositivo Conectado'
                : 'Conectar Dispositivo'
            "
            :color="conectadoDispositivo ? 'positive' : 'accent'"
            class="full-width"
            rounded
            size="lg"
            @click="testarGetDevices"
          />
        </div>
      </div>

      <div class="full-width q-pa-xl row">
        <!-- <BarChart
            :chartData="customDataComputed"
            :chartOptions="customOptions"
            style="display: none"
          ></BarChart> -->

        <LineChart
          @click="somarArroz"
          :key="arroz"
          :chartData="lineChartData"
          :chartOptions="lineChartOptions"
        ></LineChart>

        <!-- <div class="col-12 row">
          <q-input
            class="col-6 q-pa-md"
            label="Sistólica"
            v-model="numeroInputParametroSistolica"
          />
          <q-input
            class="col-6 q-pa-md"
            label="Diastólica"
            v-model="numeroInputParametroDiastolica"
          />
        </div> -->

        <!-- <q-btn
          label="Inserir Parâmetro"
          color="primary"
          class="full-width"
          size="lg"
          @click="adicionarParametro"
        /> -->
      </div>

      <div class="full-width">
        <p class="text-h5">Log:</p>
        <div id="output" class="output">
          <div id="content"></div>
          <div id="status"></div>
          <div>
            <ul>
              <li
                v-for="(message, index) in logData"
                :key="index"
                v-html="message"
              ></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style></style>

<script>
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  onBeforeMount,
  toRefs,
  computed,
  watch,
} from "vue";
// import BarChart from "src/components/BarChart.vue";
import LineChart from "src/components/LineChart.vue";
import { useQuasar } from "quasar";

import useNotify from "src/composables/UseNotify";

export default defineComponent({
  //bom pra identificação no vue
  name: "PageHomePaciente",
  components: {
    // BarChart,
    LineChart,
  },

  setup() {
    const quasar$ = useQuasar();
    let arroz = ref(0);
    let numeroInputParametroSistolica = ref(0);
    let numeroInputParametroDiastolica = ref(0);

    const { notifyError, notifySuccess } = useNotify();

    const logData = ref([]);

    const lineChartData = ref({
      labels: ["12:30", "15:45", "17:00", "18:25", "19:40", "21:40", "22:10"],
      datasets: [
        {
          label: "Paciente Diastólica",
          backgroundColor: "#a60f35",
          data: [90, 78, 85, 88, 79, 77, 66],
        },
        {
          label: "Paciente Sistólica",
          backgroundColor: "#1236c7",
          data: [90, 78, 85, 88, 79, 77, 66],
        },
        // {
        //   label: "Parâmetros Diastólica",
        //   backgroundColor: "#04e06f",
        //   data: [80, 86, 77, 85, 95, 77, 80],
        // },
        // {
        //   label: "Parâmetros Sistólica",
        //   backgroundColor: "#0a8a25",
        //   data: [110, 115, 112, 117, 119, 125, 130],
        // },
      ],
    });

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
        let tipoBuscandoDispositivo2 = [220, 0, 5, 18, 24, 0];
        let tipoBuscandoDispositivo3 = [220, 0, 5, 18, 24, 0, 9, 1];

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
        } else if (
          checarArraysIguais(arrayValoresDecimal, tipoBuscandoDispositivo2)
        ) {
          tipoDeDado = "buscandoDispositivo2";
        } else if (
          checarArraysIguais(arrayValoresDecimal, tipoBuscandoDispositivo3)
        ) {
          tipoDeDado = "buscandoDispositivo3";
        }
      }

      return tipoDeDado;
    }

    function lidarComDadosCoracao(
      idPessoaInput,
      tipoComando,
      arrayValoresDecimal,
      arrayValoresHex,
      textoTempoAtual
    ) {
      // converter os decimais nos valores que eu quero usar
      const idPessoa = idPessoaInput;
      const tipo = tipoComando;
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

      // customData.value.datasets[0].data = objetoNoLocalStorage.value.dados.map(
      //   (dado) => dado.batimentosPorMinuto
      // );
      // customData.value.labels = objetoNoLocalStorage.value.dados.map(
      //   (dado) => "" + dado.horas
      // );
      // lineChartData.value.datasets[0].data =
      //   objetoNoLocalStorage.value.dados.map(
      //     (dado) => dado.batimentosPorMinuto
      //   );
      // lineChartData.value.labels = objetoNoLocalStorage.value.dados.map(
      //   (dado) => "" + dado.horas
      // );
      // lineChartData.value.datasets[0].label = "Paciente";
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
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let currentDate = `${year}-${month}-${day}`;

      return currentDate;
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

    // const lineChartDataComputed = computed(() => {
    //   // Compute and return the updated lineChartData based on ObjetoCoracaoLocalStorage
    //   const updatedLineChartData = { ...lineChartData.value };

    //   if (ObjetoCoracaoLocalStorage.value) {
    //     updatedLineChartData.labels = ObjetoCoracaoLocalStorage.value.horas;
    //     updatedLineChartData.datasets[0].data =
    //       ObjetoCoracaoLocalStorage.value.pressaoDiastolica;
    //     updatedLineChartData.datasets[1].data =
    //       ObjetoCoracaoLocalStorage.value.pressaoSistolica;
    //   }

    //   return updatedLineChartData;
    // });

    // const updateLineChartData = () => {
    //   if (ObjetoCoracaoLocalStorage.value) {
    //     lineChartData.labels = ObjetoCoracaoLocalStorage.value.horas;
    //     lineChartData.datasets[0].data =
    //       ObjetoCoracaoLocalStorage.value.pressaoDiastolica;
    //     lineChartData.datasets[1].data =
    //       ObjetoCoracaoLocalStorage.value.pressaoSistolica;
    //   }
    // };

    // isso aqui não vai mudar, são as opções do gráfico
    let lineChartOptions = {
      responsive: true,
      maintainAspectRatio: true,
    };

    //as options pra inicializar o bluetooth device
    let navigatorOptions = {
      acceptAllDevices: true,
      optionalServices: [
        "5833ff01-9b8b-5191-6142-22a4536ef123",
        "6e400001-b5a3-f393-e0a9-e50e24dcca9d",
        "0000aaa0-0000-1000-8000-aabbccddeeff",
        "battery_service",
        "0000180f-0000-1000-8000-00805f9b34fb",
      ],
    };

    let conectadoDispositivo = ref(false);
    let idPessoaInput = ref(0);

    let bluetoothDevice = ref(null);
    let bluetoothServer = ref(null);
    let bluetoothServices = ref(null);
    let bluetoothCharacteristics = reactive({});

    // Objeto para mapear serviços e suas características
    let bluetoothServicesWithCharacteristics = reactive({});

    let servicesWithCharacteristics = {};

    // TODO: ver onde taa sendo usado essa porra

    function log(texto) {
      // Push the log message to the logData array
      logData.value.push(`<strong>${texto}</strong>`);
    }

    function getDataAtual() {
      const date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let currentDate = `${year}-${month}-${day}`;

      return currentDate;
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
      console.log("ATUALIZAR ", ObjetoCoracaoLocalStorage.value);
      ObjetoCoracaoLocalStorage.value =
        quasar$.localStorage.getItem("ObjetoCoracao");
    };

    const setObjetoCoracaoLocalStorage = () => {
      console.log("SET ", ObjetoCoracaoLocalStorage.value);
      quasar$.localStorage.set(
        "ObjetoCoracao",
        ObjetoCoracaoLocalStorage.value
      );
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

      ObjetoCoracaoLocalStorage.value.idPessoa.push(idPessoa);
      ObjetoCoracaoLocalStorage.value.tipo.push(tipo);
      ObjetoCoracaoLocalStorage.value.batimentos.push(batimentosPorMinuto);
      ObjetoCoracaoLocalStorage.value.saturacao.push(saturacaoOxigenio);
      ObjetoCoracaoLocalStorage.value.pressaoArterial.push(pressaoArterial);
      ObjetoCoracaoLocalStorage.value.pressaoSistolica.push(pressaoSistolica);
      ObjetoCoracaoLocalStorage.value.pressaoDiastolica.push(pressaoDiastolica);
      ObjetoCoracaoLocalStorage.value.horas.push(getDataAtual());
      ObjetoCoracaoLocalStorage.value.calendario.push(getHorarioAtual());

      // Adicione os novos dados ao array dentro do objeto e depois bota no local storage
      setObjetoCoracaoLocalStorage();

      //garantir que o objeto está atualizado
      atualizarObjetoCoracaoLocalStorage();

      console.log("ADICIONAR ", ObjetoCoracaoLocalStorage.value);
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
        console.log("Não existe idPessoa no local storage");
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
                tipo: ["coracao", "coracao", "coracao", "coracao", "coracao"],
                batimentos: ["80", "73", "67", "77", "83"],
                saturacao: ["98%", "90%", "95%", "100%", "99%"],
                pressaoArterial: [
                  "127/96",
                  "118/74",
                  "113/87",
                  "116/89",
                  "115/77",
                ],
                pressaoSistolica: ["127", "118", "113", "116", "115"],
                pressaoDiastolica: ["96", "74", "87", "89", "77"],
                horas: [
                  "17:10:18",
                  "18:28:00",
                  "19:25:19",
                  "20:49:03",
                  "21:59:59",
                ],
                calendario: [
                  "2023-11-07",
                  "2023-11-07",
                  "2023-11-07",
                  "2023-11-07",
                  "2023-11-07",
                ],
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

    function printDevice() {
      console.log(bluetoothDevice.value);
    }

    async function postCommandWriteHeart() {
      try {
        const serviceUUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9d";
        const characteristicUUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9d";

        const service = await bluetoothDevice.value.gatt.getPrimaryService(
          serviceUUID
        );
        const characteristic = await service.getCharacteristic(
          characteristicUUID
        );

        const byteArray = [
          0xcd, 0x00, 0x06, 0x12, 0x01, 0x18, 0x00, 0x01, 0x01,
        ];

        const value = new Uint8Array(byteArray);
        await characteristic.writeValue(value);

        console.log("Comando enviado com sucesso:", byteArray);
      } catch (error) {
        console.error("Erro ao enviar o comando:", error);
      }
    }

    function executarComandoEmLoop() {
      // Chame a função inicialmente
      postCommandWriteHeart();

      // Em seguida, configure um intervalo para executar a função a cada 1 minuto (60.000 milissegundos).
      setInterval(postCommandWriteHeart, 60000);
    }

    // @@@@@@@@@@@@@@@@ n1

    function testarGetDevices() {
      conectarDevice()
        .then((server) => {
          log("Getting Services...");
          bluetoothServer.value = server;
          return server.getPrimaryServices();
        })
        .then((services) => {
          log("Getting Characteristics...");
          bluetoothServices.value = services;
          let queue = Promise.resolve();
          services.forEach((service) => {
            queue = queue.then((_) =>
              service.getCharacteristics().then((characteristics) => {
                log("> Service: " + service.uuid);
                // bluetoothServicesWithCharacteristics.value[service.uuid] = reactive({});
                servicesWithCharacteristics[service.uuid] = {
                  service: service,
                  characteristics: characteristics.map((characteristic) => ({
                    uuid: characteristic.uuid,
                    properties: getSupportedProperties(characteristic),
                  })),
                };

                bluetoothServicesWithCharacteristics.value =
                  servicesWithCharacteristics;

                bluetoothCharacteristics.value = characteristics;

                characteristics.forEach((characteristic) => {
                  if (
                    getSupportedProperties(characteristic) == "[NOTIFY]" ||
                    getSupportedProperties(characteristic) == "[READ, NOTIFY]"
                  ) {
                    characteristic.addEventListener(
                      "characteristicvaluechanged",
                      handleNotifications
                    );
                    characteristic.startNotifications().then((_) => {
                      log(
                        "> Notifications started for >> Characteristic: " +
                          characteristic.uuid +
                          " " +
                          getSupportedProperties(characteristic)
                      );
                    });
                  } else {
                    log(
                      "> Characteristic: " +
                        characteristic.uuid +
                        " " +
                        getSupportedProperties(characteristic)
                    );
                  }
                });
              })
            );
          });

          conectadoDispositivo.value = true;
          executarComandoEmLoop();
          // console.log(servicesWithCharacteristics)
          return queue;
        })
        .catch((error) => {
          // log("Argh! " + error);
          throw error;
        });
    }

    function conectarDevice() {
      bluetoothDevice.value = null;
      log("Requesting any Bluetooth Device...");
      return navigator.bluetooth
        .requestDevice(navigatorOptions)
        .then((device) => {
          conectadoDispositivo.value = true;
          log("Connecting to GATT Server...");
          bluetoothDevice.value = device;
          bluetoothDevice.value.addEventListener(
            "gattserverdisconnected",
            onDisconnected
          );
          return conectarBluetooth();
        });
    }

    function conectarBluetooth() {
      return exponentialBackoff(
        3 /* max retries */,
        2 /* seconds delay */,
        function toTry() {
          log("Connecting to Bluetooth Device... ");
          return bluetoothDevice.value.gatt.connect();
        },
        function success(result) {
          log("> Bluetooth Device connected. Try disconnect it now.");
          conectadoDispositivo.value = true;
          return result;
        },
        function fail() {
          log("Failed to reconnect.");
        }
      );
    }

    function onDisconnected() {
      log("> Bluetooth Device disconnected");
      //mudar para false aas coisas
      conectadoDispositivo.value = false;
      conectarBluetooth();
    }

    function exponentialBackoff(max, delay, toTry, success, fail) {
      return toTry()
        .then((result) => success(result))
        .catch((_) => {
          if (max === 0) {
            return fail();
          }
          log("Retrying in " + delay + "s... (" + max + " tries left)");
          return new Promise((resolve) => {
            setTimeout(function () {
              resolve(
                exponentialBackoff(--max, delay * 2, toTry, success, fail)
              );
            }, delay * 1000);
          });
        });
    }

    // @@@@@@@@@@@@@@@@ n1

    async function onGattServerDisconnected() {
      console.log("> Bluetooth Device disconnected");

      return await conectarGattServer();
    }

    async function conectarGattServer() {
      return await exponentialBackoff(
        3 /* max retries */,
        2 /* seconds delay */,
        async function toTry() {
          console.log("Connecting to Bluetooth Device... ");
          return await bluetoothDevice.value.gatt.connect();
        },
        async function success(result) {
          console.log("> Bluetooth Device connected. Try disconnect it now.");

          // definir os refs com valor
          conectadoDispositivo.value = true;
          bluetoothServer.value = result;

          return result;
        },
        async function fail() {
          console.log("Failed to reconnect.");
        }
      );
    }

    function getSupportedProperties(characteristic) {
      let supportedProperties = [];
      for (const p in characteristic.properties) {
        if (characteristic.properties[p] === true) {
          supportedProperties.push(p.toUpperCase());
        }
      }
      return "[" + supportedProperties.join(", ") + "]";
    }

    // async function exponentialBackoff(max, delay, toTry, success, fail) {
    //   try {
    //     const result = await toTry();
    //     success(result);
    //   } catch (error) {
    //     if (max === 0) {
    //       return fail();
    //     }
    //     console.log('Retrying in ' + delay + 's... (' + max + ' tries left)');
    //     setTimeout(function () {
    //       exponentialBackoff(--max, delay * 2, toTry, success, fail);
    //     }, delay * 1000);
    //   }
    // }

    function handleNotifications(event) {
      console.log("@@@@@");

      // console.log("@@@@@@");

      let value = event.target.value;
      console.log("Printando no console o VALUE: ", value);

      let arrayValoresHex = converterValueParaHex(value);
      console.log("Printando no console  o arrayValoresHex: ", arrayValoresHex);

      let arrayValoresDecimal = converterValueParaDecimal(value);
      console.log(
        "Printando no console  o arrayValoresDecimal: ",
        arrayValoresDecimal
      );

      let textoTempoAtual = getHorarioAtual();
      console.log("Printando no console o tempo atual", textoTempoAtual);

      console.log("@@@@@@");

      let tipoComando = verificarTipoComando(
        arrayValoresDecimal,
        arrayValoresHex
      );

      if (tipoComando == "coracao") {
        lidarComDadosCoracao(
          idPessoaInput.value,
          tipoComando,
          arrayValoresDecimal,
          arrayValoresHex,
          textoTempoAtual
        );
      } else if (tipoComando == "passos") {
        lidarComDadosPassos(
          tipoComando,
          arrayValoresDecimal,
          arrayValoresHex,
          textoTempoAtual
        );
      } else {
        lidarComDadosDesconhecido(
          tipoComando,
          arrayValoresDecimal,
          arrayValoresHex,
          textoTempoAtual
        );
      }

      console.log(
        "Valores em formato hexadecimal: " + arrayValoresHex.join(" ")
      );
      console.log(
        "Valores em formato Decimal: " + arrayValoresDecimal.join(" ")
      );
      console.log("@@@@@");
    }

    //como resolver: vou criar duas arraay local e dar watch sempre q elas mudar pra dai dar update no local storage e dai solto um somarArroz pós update

    function adicionarParametro() {
      if (
        ObjetoCoracaoLocalStorage.value &&
        numeroInputParametroSistolica.value !== null &&
        numeroInputParametroDiastolica.value !== null
      ) {
        console.log(
          numeroInputParametroSistolica.value,
          numeroInputParametroDiastolica.value
        );

        // arraySistolica.value.push(numeroInputParametroSistolica.value);

        // arrayDiastolica.value.push(numeroInputParametroDiastolica.value);

        // arrayVariavelApoio.value++;

        ObjetoCoracaoLocalStorage.value.pressaoDiastolica.push(
          numeroInputParametroDiastolica.value
        );
        ObjetoCoracaoLocalStorage.value.pressaoSistolica.push(
          numeroInputParametroSistolica.value
        );
      } else {
        console.log("Invalid data. Cannot add parameters.");
      }
    }

    function somarArroz() {
      // arroz.value++;
      arroz.value++;
    }

    onBeforeMount(() => {});
    // TODO: ajeitar onMounted

    onMounted(() => {
      log("TESTANDO.vue");
      log("UseLocal.js");
      inicalizarObjetoCoracaoLocalStorage();
      // inicalizarObjetoCoracaoLocalStorage();

      // console.log(ObjetoCoracaoLocalStorage.value);

      lineChartData.value.labels = ObjetoCoracaoLocalStorage.value.horas;
      lineChartData.value.datasets[0].data =
        ObjetoCoracaoLocalStorage.value.pressaoDiastolica;
      lineChartData.value.datasets[1].data =
        ObjetoCoracaoLocalStorage.value.pressaoSistolica;
      somarArroz();
    });

    // watch(arrayVariavelApoio, () => {
    //   ObjetoCoracaoLocalStorage.value.pressaoDiastolica.push(
    //     arrayDiastolica.value[arrayDiastolica.value.length - 1]
    //   );
    //   ObjetoCoracaoLocalStorage.value.pressaoSistolica.push(
    //     arraySistolica.value[arraySistolica.value.length - 1]
    //   );

    //   lineChartData.value.labels = ObjetoCoracaoLocalStorage.value.horas;
    //   lineChartData.value.datasets[0].data =
    //     ObjetoCoracaoLocalStorage.value.pressaoDiastolica;
    //   lineChartData.value.datasets[1].data =
    //     ObjetoCoracaoLocalStorage.value.pressaoSistolica;
    // });

    // watch(
    //   () => ObjetoCoracaoLocalStorage.value,
    //   () => {
    //     updateLineChartData();
    //   }
    // );

    return {
      //local storages
      // objetoNoLocalStorage,
      // adicionarAoLocalStorage,
      // obterBPMsDoLocalStorage,

      logData,
      // log,
      // hexToDecimal,
      // handleNotifications,
      // converterValueParaHex,
      // converterValueParaDecimal,
      // obterDiaSemana,
      // checarArraysIguais,
      // time,
      // verificarTipoComando,
      // lidarComDadosCoracao,
      // lidarComDadosPassos,
      // lidarComDadosDesconhecido,
      // testarGetDevices,
      // executarComandoEmLoop,
      // conectarDevice,
      // printDevice,

      // BarChart,

      // customData,
      // customDataComputed,
      // customOptions,
      inicalizarObjetoCoracaoLocalStorage,
      quasar$,

      // arroz,
      arroz,
      somarArroz,

      // linechart coisas
      LineChart,
      lineChartOptions,
      lineChartData,
      // lineChartDataComputed,

      numeroInputParametroSistolica,
      numeroInputParametroDiastolica,
      adicionarParametro,

      conectadoDispositivo,
      // novaFuncaoFoda,
      testarGetDevices,
      idPessoaInput,

      // arraySistolica,
      // arrayDiastolica,
      // arrayVariavelApoio,

      log,

      ObjetoCoracaoLocalStorage,
      atualizarObjetoCoracaoLocalStorage,
      setObjetoCoracaoLocalStorage,
      adicionarObjetoCoracaoLocalStorage,

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
    };
  },
});
</script>
