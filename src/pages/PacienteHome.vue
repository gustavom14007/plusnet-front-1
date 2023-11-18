<template>
  <q-page padding>
    <div class="justify-center">
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <p v-if="conectadoDispositivo" class="text-h4 text-center col-12">
          Conectado
        </p>
        <p v-else class="text-h4 text-center col-12">Desconectado</p>
      </div>

      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <div class="full-width q-pt-md">
          <q-btn
            label="Conectar Dispositivo"
            color="info"
            class="full-width"
            rounded
            size="lg"
            @click="testarGetDevices"
          />
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
        <div class="full-width q-pt-md">
          <BarChart
            :chartData="customDataComputed"
            :chartOptions="customOptions"
            style="display: none"
          ></BarChart>
          <LineChart
            @click="somarArroz"
            :key="arroz2"
            :chartData="lineChartDataComputed"
            :chartOptions="lineChartOptions"
          ></LineChart>
          <q-input v-model="numeroInputParametro" />
          <q-btn
            label="Inserir Parâmetro"
            color="primary"
            class="full-width"
            size="lg"
            @click="adicionarParametro"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<style>
/* #container { */
/* z-index: -1; */
/* position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0; */
/* display: block; */
/* width: 100%; */
/* height: 200px; */
/* background-color: #333333; */
/* font-family: Roboto; */
/* } */

/* #waves { */
/* width: 100%; */
/* height: 100%; */
/* display: block; */
/* } */

/* .espaco { */
/* margin-top: 150px; */
/* background-color: #08a737; */
/* margin-bottom: 150px; */
/* } */
</style>

<script>
import {
  defineComponent,
  ref,
  onMounted,
  computed,
  watch,
  watchEffect,
  reactive,
} from "vue";
import useAuthUser from "src/composables/UseAuthUser";
import { useRouter } from "vue-router";

import BarChart from "src/components/BarChart.vue";

import LineChart from "src/components/LineChart.vue";

export default defineComponent({
  //bom pra identificação no vue
  name: "PageHomePaciente",
  components: {
    BarChart,
    LineChart,
  },

  setup() {
    let arroz2 = ref(0);

    function somarArroz() {
      // arroz.value++;
      arroz2.value++;
    }

    let conectadoDispositivo = ref(false);

    const logData = ref([]);
    let objetoNoLocalStorage = JSON.parse(localStorage.getItem("meuObjeto"));

    let bluetoothDevice;
    let servicesWithCharacteristics = {}; // Objeto para mapear serviços e suas características

    let globalServer;
    let globalDevice;
    let globalService;
    let globalCharacteristic;

    let navigatorOptions = {
      // filters: [{ services: ['0x180D'] }]
      acceptAllDevices: true,
      optionalServices: [
        "5833ff01-9b8b-5191-6142-22a4536ef123",
        "6e400001-b5a3-f393-e0a9-e50e24dcca9d",
        "0000aaa0-0000-1000-8000-aabbccddeeff",
        "battery_service",
        "0000180f-0000-1000-8000-00805f9b34fb",
      ],
    };

    let customData = ref({
      labels: ["January", "February", "March"],
      datasets: [{ data: [40, 20, 12] }],
    });
    let customOptions = ref({
      responsive: true,
    });

    let lineChartData = ref({
      labels: ["12:30", "15:45", "17:00", "18:25", "19:40", "21:40", "22:10"],
      datasets: [
        {
          label: "Paciente",
          backgroundColor: "#f87979",
          data: [90, 78, 85, 88, 79, 77, 66],
        },
        {
          label: "Parâmetros",
          backgroundColor: "#08a737",
          data: [80, 86, 77, 85, 95, 77, 80],
        },
      ],
    });
    let lineChartOptions = ref({
      responsive: true,
      maintainAspectRatio: true,
    });

    // const hexInput = ref("1A 2B 3C 4D");

    function log(texto) {
      // Push the log message to the logData array
      logData.value.push(`<strong>${texto}</strong>`);
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

    function time() {
      let horarioAtual = "" + new Date().toJSON().substr(11, 8) + "";
      // log( horarioAtual );
      return horarioAtual;
    }

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
        }
      }

      return tipoDeDado;
    }

    function lidarComDadosCoracao(
      tipoComando,
      arrayValoresDecimal,
      arrayValoresHex,
      textoTempoAtual
    ) {
      const pressaoArterial = `${arrayValoresDecimal[18]}/${arrayValoresDecimal[17]}`;
      const batimentosPorMinuto = `${arrayValoresDecimal[19]}`;
      const saturacaoOxigenio = `${arrayValoresDecimal[16]}%`;

      adicionarAoLocalStorage(
        tipoComando,
        pressaoArterial,
        saturacaoOxigenio,
        batimentosPorMinuto
      );
      // drawWaves();

      log("----");
      log(textoTempoAtual);
      log(`Tipo: ${tipoComando} `);
      log(`Pressão Arterial: ${pressaoArterial} `);
      log(`Saturação: ${saturacaoOxigenio} `);
      log(`BPM:  ${batimentosPorMinuto} `);
      log("----");

      let dadosCoracao = {
        tipo: tipoComando,
        pressaoArterial,
        saturacaoOxigenio,
        batimentosPorMinuto,
      };

      customData.value.datasets[0].data = objetoNoLocalStorage.dados.map(
        (dado) => dado.batimentosPorMinuto
      );
      customData.value.labels = objetoNoLocalStorage.dados.map(
        (dado) => "" + dado.dateTime
      );
      lineChartData.value.datasets[0].data = objetoNoLocalStorage.dados.map(
        (dado) => dado.batimentosPorMinuto
      );
      lineChartData.value.labels = objetoNoLocalStorage.dados.map(
        (dado) => "" + dado.dateTime
      );
      lineChartData.value.datasets[0].label = "Paciente";
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

    function adicionarAoLocalStorage(
      tipo,
      pressaoArterial,
      saturacaoOxigenio,
      batimentosPorMinuto
    ) {
      // Recupere o objeto do localStorage
      objetoNoLocalStorage = JSON.parse(localStorage.getItem("meuObjeto"));

      const novoDado = {
        tipo,
        pressaoArterial,
        saturacaoOxigenio,
        batimentosPorMinuto,
        dateTime: time(),
      };

      // Adicione os novos dados ao array dentro do objeto
      objetoNoLocalStorage.dados.push(novoDado);

      // Atualize o objeto no localStorage
      localStorage.setItem("meuObjeto", JSON.stringify(objetoNoLocalStorage));

      // Retorne o objeto atualizado
      return objetoNoLocalStorage;
    }

    // Função para recuperar os dados de BPM do localStorage
    function obterBPMsDoLocalStorage() {
      // Recupere o objeto do localStorage
      objetoNoLocalStorage = JSON.parse(localStorage.getItem("meuObjeto"));

      // Verifique se o objeto e o array de dados existem
      if (objetoNoLocalStorage && Array.isArray(objetoNoLocalStorage.dados)) {
        // Crie um novo array com os valores de BPM
        const arrayDeBPMs = objetoNoLocalStorage.dados.map(
          (dado) => dado.batimentosPorMinuto
        );

        return arrayDeBPMs;
      } else {
        // Se o objeto ou o array não existirem, retorne um array vazio
        return [];
      }
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

    function testarGetDevices() {
      conectarDevice()
        .then((server) => {
          log("Getting Services...");
          return server.getPrimaryServices();
        })
        .then((services) => {
          log("Getting Characteristics...");
          let queue = Promise.resolve();
          services.forEach((service) => {
            queue = queue.then((_) =>
              service.getCharacteristics().then((characteristics) => {
                log("> Service: " + service.uuid);
                servicesWithCharacteristics[service.uuid] = {
                  service: service,
                  characteristics: characteristics.map((characteristic) => ({
                    uuid: characteristic.uuid,
                    properties: getSupportedProperties(characteristic),
                  })),
                };

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

          executarComandoEmLoop();
          // console.log(servicesWithCharacteristics)
          return queue;
        })
        .catch((error) => {
          log("Argh! " + error);
        });
    }

    async function postCommandWriteHeart() {
      try {
        const serviceUUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9d";
        const characteristicUUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9d";

        const service = await bluetoothDevice.gatt.getPrimaryService(
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

    function conectarDevice() {
      bluetoothDevice = null;
      log("Requesting any Bluetooth Device...");
      return navigator.bluetooth
        .requestDevice(navigatorOptions)
        .then((device) => {
          log("Connecting to GATT Server...");
          bluetoothDevice = device;
          bluetoothDevice.addEventListener(
            "gattserverdisconnected",
            onDisconnected
          );
          return conectarBluetooth();
        });
    }

    function printDevice() {
      console.log(bluetoothDevice);
    }

    function conectarBluetooth() {
      return exponentialBackoff(
        3 /* max retries */,
        2 /* seconds delay */,
        function toTry() {
          time("Connecting to Bluetooth Device... ");
          return bluetoothDevice.gatt.connect();
        },
        function success(result) {
          log("> Bluetooth Device connected. Try disconnect it now.");
          return result;
        },
        function fail() {
          time("Failed to reconnect.");
        }
      );
    }

    function onDisconnected() {
      log("> Bluetooth Device disconnected");
      conectarBluetooth();
    }

    function exponentialBackoff(max, delay, toTry, success, fail) {
      return toTry()
        .then((result) => success(result))
        .catch((_) => {
          if (max === 0) {
            return fail();
          }
          time("Retrying in " + delay + "s... (" + max + " tries left)");
          return new Promise((resolve) => {
            setTimeout(function () {
              resolve(
                exponentialBackoff(--max, delay * 2, toTry, success, fail)
              );
            }, delay * 1000);
          });
        });
    }

    function handleNotifications(event) {
      log("@@@@@");

      console.log("@@@@@@");

      let value = event.target.value;
      console.log("Printando no console o VALUE: ", value);

      let arrayValoresHex = converterValueParaHex(value);
      console.log("Printando no console  o arrayValoresHex: ", arrayValoresHex);

      let arrayValoresDecimal = converterValueParaDecimal(value);
      console.log(
        "Printando no console  o arrayValoresDecimal: ",
        arrayValoresDecimal
      );

      let textoTempoAtual = time();
      console.log("Printando no console o tempo atual", textoTempoAtual);

      console.log("@@@@@@");

      let tipoComando = verificarTipoComando(
        arrayValoresDecimal,
        arrayValoresHex
      );

      if (tipoComando == "coracao") {
        lidarComDadosCoracao(
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

      log("Valores em formato hexadecimal: " + arrayValoresHex.join(" "));
      log("Valores em formato Decimal: " + arrayValoresDecimal.join(" "));
      somarArroz();
      log("@@@@@");
    }

    // const decimalValue = computed(() => {
    //   return hexToDecimal(hexInput.value);
    // });

    onMounted(() => {
      log("onMounted");

      objetoNoLocalStorage = JSON.parse(localStorage.getItem("meuObjeto"));

      // Se o objeto não existir, crie um novo objeto com um array vazio
      if (!objetoNoLocalStorage) {
        const novoObjeto = {
          dados: [],
        };

        localStorage.setItem("meuObjeto", JSON.stringify(novoObjeto));

        lineChartData.value = {
          labels: [
            "12:30",
            "15:45",
            "17:00",
            "18:25",
            "19:40",
            "21:40",
            "22:10",
          ],
          datasets: [
            {
              label: "Paciente",
              backgroundColor: "#f87979",
              data: [90, 78, 85, 88, 79, 77, 66],
            },
            {
              label: "Parâmetros",
              backgroundColor: "#08a737",
              data: [80, 86, 77, 85, 95, 77, 80],
            },
          ],
        };
        lineChartOptions.value = {
          responsive: true,
          maintainAspectRatio: true,
        };
      } else {
        customData.value.datasets[0].data = objetoNoLocalStorage.dados.map(
          (dado) => dado.batimentosPorMinuto
        );
        customData.value.labels = objetoNoLocalStorage.dados.map(
          (dado) => "" + dado.dateTime
        );
        lineChartData.value.datasets[0].data = objetoNoLocalStorage.dados.map(
          (dado) => dado.batimentosPorMinuto
        );
        lineChartData.value.labels = objetoNoLocalStorage.dados.map(
          (dado) => "" + dado.dateTime
        );
        lineChartData.value.datasets[0].label = "Paciente";

        if (lineChartData.value.datasets[0].data.length == 0) {
          lineChartData.value = {
            labels: [
              "12:30",
              "15:45",
              "17:00",
              "18:25",
              "19:40",
              "21:40",
              "22:10",
            ],
            datasets: [
              {
                label: "Paciente",
                backgroundColor: "#f87979",
                data: [90, 78, 85, 88, 79, 77, 66],
              },
              {
                label: "Parâmetros",
                backgroundColor: "#08a737",
                data: [80, 86, 77, 85, 95, 77, 80],
              },
            ],
          };
          lineChartOptions.value = {
            responsive: true,
            maintainAspectRatio: true,
          };
        }

        somarArroz();
      }

      //   lineChartData = ref({
      //   labels: ["January", "February", "March", "April", "May", "June", "July"],
      //   datasets: [
      //     {
      //       label: "Data One",
      //       backgroundColor: "#f87979",
      //       data: [40, 39, 10, 40, 39, 80, 40],
      //     },
      //   ],
      // });
      // lineChartOptions = ref({
      //   responsive: true,
      //   maintainAspectRatio: true,
      // });

      console.log(customData.value);
    });

    const customDataComputed = computed(() => {
      // You can perform any calculations or transformations here
      return customData.value; // Example: returning as is
    });

    const lineChartDataComputed = computed(() => {
      // You can perform any calculations or transformations here
      return lineChartData.value; // Example: returning as is
    });

    let numeroInputParametro = ref(0);

    let arrayEsquisitoParametro = ref([]);

    function adicionarParametro() {
      console.log(numeroInputParametro.value);

      // arrayEsquisitoParametro.value.push(numeroInputParametro.value);
      // lineChartData.value.datasets[1].data = arrayEsquisitoParametro.value;
    }

    return {
      objetoNoLocalStorage,
      adicionarAoLocalStorage,
      obterBPMsDoLocalStorage,
      logData,
      log,
      hexToDecimal,
      handleNotifications,
      converterValueParaHex,
      converterValueParaDecimal,
      obterDiaSemana,
      checarArraysIguais,
      time,
      verificarTipoComando,
      lidarComDadosCoracao,
      lidarComDadosPassos,
      lidarComDadosDesconhecido,
      testarGetDevices,
      executarComandoEmLoop,
      conectarDevice,
      printDevice,
      BarChart,
      customData,
      customOptions,
      // arroz,
      arroz2,
      somarArroz,
      LineChart,
      lineChartData,
      lineChartOptions,
      customDataComputed,
      lineChartDataComputed,
      numeroInputParametro,
      adicionarParametro,
      conectadoDispositivo,
    };
  },
});
</script>
