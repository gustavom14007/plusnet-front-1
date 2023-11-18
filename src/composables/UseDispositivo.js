
import { onMounted, reactive, ref } from 'vue';

import useUtilitario from './UseUtilitarios';




export default function useDispositivo() {

  const {
    getDataAtual,
    getHorarioAtual,
    log,
    logData,
    converterValueParaDecimal,
    converterValueParaHex,
    verificarTipoComando,
    lidarComDadosCoracao,
    lidarComDadosDesconhecido,
    lidarComDadosPassos,
    ObjetoCoracaoLocalStorage,
    adicionarObjetoCoracaoLocalStorage,
    inicalizarObjetoCoracaoLocalStorage,

  } = useUtilitario()



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

  let servicesWithCharacteristics = {}

  // TODO: ver onde taa sendo usado essa porra



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
      // somarArroz()
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

  // const novaFuncaoFoda = async () => {
  //   try {
  //     //desconectar dispositivo anterior? acho que sim
  //     // bluetoothDevice.value = null

  //     // definir o novo device:
  //     bluetoothDevice.value = await navigator.bluetooth.requestDevice(navigatorOptions)

  //     //colocar um event listener que me fala quando foi desconectado:
  //     bluetoothDevice.value.addEventListener(
  //       "gattserverdisconnected",
  //       onGattServerDisconnected
  //     );

  //     //conectar no server GATT, e definir o bluetoothServer.value
  //     bluetoothServer.value = await conectarGattServer()


  //     //pegar Serviços todos
  //     //   pegar características todas
  //     //       se for notify, começar a ouvir
  //     //
  //     const delay = ms => new Promise(res => setTimeout(res, ms));
  //     if (bluetoothServer.value == undefined) {
  //       console.log('aguardando')
  //       bluetoothServer.value = await bluetoothDevice.value.gatt.connect();
  //       await delay(5000);
  //       console.log(bluetoothServer.value)
  //     }

  //     bluetoothServices.value = await bluetoothServer.value.getPrimaryServices();


  //     for (const service of bluetoothServices.value) {
  //       console.log("> Service: " + service.uuid);


  //       bluetoothCharacteristics.value = await service.getCharacteristics();
  //       bluetoothServicesWithCharacteristics.value[service.uuid] = {
  //         service: service,
  //         characteristics: bluetoothCharacteristics.value.map((characteristic) => ({
  //           uuid: characteristic.uuid,
  //           properties: getSupportedProperties(characteristic),
  //         }))
  //       }

  //       for (const characteristic of bluetoothCharacteristics.value) {
  //         console.log(
  //           "> Characteristic: " +
  //           characteristic.uuid +
  //           " " +
  //           getSupportedProperties(characteristic)
  //         );

  //         if (
  //           getSupportedProperties(characteristic) == "[NOTIFY]" ||
  //           getSupportedProperties(characteristic) == "[READ, NOTIFY]"
  //         ) {
  //           characteristic.addEventListener("characteristicvaluechanged", handleNotifications);
  //           characteristic.startNotifications().then(() => {
  //             console.log(
  //               "> Notifications started for >> Characteristic: " +
  //               characteristic.uuid +
  //               " " +
  //               getSupportedProperties(characteristic)
  //             );
  //           });
  //         }
  //       }
  //     }


  //     // ajeitar OU começar a enviar coração..
  //     executarComandoEmLoop();

  //   } catch (error) {

  //     console.log("Argh! " + error.message)
  //   }
  // }



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

              bluetoothServicesWithCharacteristics.value = servicesWithCharacteristics;

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
        throw error
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
    conectadoDispositivo.value = false
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
    console.log('> Bluetooth Device disconnected');

    return await conectarGattServer();
  }

  async function conectarGattServer() {
    return await exponentialBackoff(3 /* max retries */, 2 /* seconds delay */,
      async function toTry() {
        console.log('Connecting to Bluetooth Device... ');
        return await bluetoothDevice.value.gatt.connect();
      },
      async function success(result) {
        console.log('> Bluetooth Device connected. Try disconnect it now.');

        // definir os refs com valor
        conectadoDispositivo.value = true;
        bluetoothServer.value = result;


        return result;
      },
      async function fail() {
        console.log('Failed to reconnect.');
      });
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

    console.log("Valores em formato hexadecimal: " + arrayValoresHex.join(" "));
    console.log("Valores em formato Decimal: " + arrayValoresDecimal.join(" "));
    console.log("@@@@@");
  }




  onMounted(() => {
    // log("UseDispositivo.js")

  })


  return {
    navigatorOptions,
    log,
    logData,

    bluetoothDevice,
    bluetoothServer,
    bluetoothServices,
    bluetoothCharacteristics,
    bluetoothServicesWithCharacteristics,

    printDevice,
    postCommandWriteHeart,
    executarComandoEmLoop,

    conectadoDispositivo,
    // novaFuncaoFoda,
    testarGetDevices,

    ObjetoCoracaoLocalStorage,
    adicionarObjetoCoracaoLocalStorage,
    inicalizarObjetoCoracaoLocalStorage,

    idPessoaInput,


  }
}
