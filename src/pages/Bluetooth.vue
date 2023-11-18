<template>
  <q-page padding>
    <!-- <div class="row justify-center">
      <p class="text-h4 text-center col-12">Login</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <div class="full-width q-pt-md">
          <h1 class="text-h2">Testes Bluetooth</h1> -->
    <!-- <CanvasComponent
            :key="componentKey"
            @click="forceRerender"
            :ref="canvasComponentRef"
          /> -->
    <!-- <h3>Logs:</h3>

          <div id="output" class="output">
            <div id="content"></div>
            <div id="status"></div>
            <div id="log"></div>
          </div>

          <div class="espaco"></div>
        </div>
        <div class="full-width">
          <q-btn
            label="Ler info ver"
            color="primary"
            class="full-width"
            size="lg"
            @click="redesenhaCanvas"
          />
          <q-btn
            label="Conectar device"
            color="dark"
            class="full-width"
            size="lg"
            @click="testarBLE"
          />
          <q-btn
            label="Print device"
            color="dark"
            class="full-width"
            size="lg"
            @click="printDevice"
          />
          <q-btn
            label="Pedir coracao"
            color="primary"
            class="full-width"
            size="lg"
            @click="executarComandoEmLoop(bluetoothDevice)"
          />
        </div>
      </div>
    </div> -->
    <div class="absolute fit column flex-center no-wrap">
      <div class="column flex-center">
        <q-icon
          name="fab fa-bluetooth"
          :color="ble_enabled ? 'primary' : 'gray'"
          size="lg"
          class="q-ma-md"
        />
        Bluetooth is {{ ble_enabled ? "Active" : "Inactive" }}

        <q-btn
          :label="scanning ? 'Scanning...' : 'Start Scanning'"
          color="primary"
          :loading="scanning"
          :disable="!ble_enabled"
          class="q-ma-md"
          @click="scan"
        />
      </div>

      <div class="scroll">
        <q-list
          v-if="results.length"
          bordered
          separator
          class="rounded-borders"
        >
        </q-list>
        <span
          v-else-if="!scanning && tried_scanning"
          class="q-ma-lg text-subtitle1"
          >No devices found. Try again later!</span
        >
      </div>
      <q-btn
        v-if="results.length"
        :label="see_all ? 'Hide Unknown Devices' : 'See All'"
        flat
        color="primary"
        @click="see_all = !see_all"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, watch, nextTick } from "vue";

// import useAuthUser from "src/composables/UseAuthUser";
// import { useRouter } from "vue-router";

// import CanvasComponent from "src/components/CanvasComponent.vue";
// import {
//   testarBLE,
//   postCommandWriteHeart,
//   printDevice,
//   executarComandoEmLoop,
//   bluetoothDevice,
// } from "src/composables/UseConnectionBluetooth";

import { BleClient } from "@capacitor-community/bluetooth-le";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "PageBluetooth",

  components: {
    // CanvasComponent,
  },
  computed: {
    // filtered_results(): ScanResult[] {
    //   if (this.see_all) return this.results;
    //   else return this.results.filter((result) => result.localName);
    // },
  },
  setup() {
    const welcome = ref(true);
    const $q = useQuasar();

    const results = ref([]);
    const scanning = ref(false);
    const tried_scanning = ref(false);
    const ble_enabled = ref(false);
    const see_all = ref(false);
    const error = ref("");

    const init = async () => {
      try {
        await BleClient.initialize();

        ble_enabled.value = await BleClient.isEnabled();

        await BleClient.startEnabledNotifications((enabled) => {
          ble_enabled.value = enabled;
        });
      } catch (err) {
        error.value = err.message;
      }
    };

    const scan = async () => {
      results.value = [];
      scanning.value = true;
      tried_scanning.value = true;

      try {
        await BleClient.requestLEScan({}, (result) => {
          results.value.push(result);
        });

        setTimeout(() => {
          void BleClient.stopLEScan().then(() => {
            scanning.value = false;
          });
        }, 10000);
      } catch (err) {
        error.value = err.message;
      }
    };

    onMounted(init);

    // const router = useRouter();
    // const { login } = useAuthUser();
    // let componentKey = ref(0);
    // const form = ref({
    //   email: "",
    //   password: "",
    // });
    // let canvasComponentRef = ref(null);

    // const forceRerender = () => {
    //   console.log(componentKey.value);
    //   componentKey.value += 1;
    // };

    // const redesenhaCanvas = () => {
    //   forceRerender();
    //   // if (canvasComponentRef.value) {
    //   // canvasComponentRef.value.drawWaves();
    //   // }
    // };

    // onMounted(() => {
    //   redesenhaCanvas();

    //   setInterval(forceRerender(), 60000);

    //   watch(
    //     () => localStorage.getItem("meuObjeto"),
    //     (newData) => {
    //       const parsedData = JSON.parse(newData);
    //       objetoNoLocalStorage.value = parsedData || { dados: [] };
    //       forceRerender();
    //       redesenhaCanvas();
    //     }
    //   );
    // });

    // const handleLogin = async () => {
    //   try {
    //     await login(form.value);
    //     router.push({ name: "me" });
    //   } catch (error) {
    //     alert(error.message);
    //   }
    // };

    return {
      welcome,
      results,
      scanning,
      tried_scanning,
      ble_enabled,
      see_all,
      error,
      scan,
      // forceRerender,
      // form,
      // executarComandoEmLoop,
      // bluetoothDevice,
      // // handleLogin,
      // postCommandWriteHeart,
      // printDevice,
      // testarBLE,
      // redesenhaCanvas,
      // componentKey,
      // canvasComponentRef, // Adicione a referência ao componente CanvasComponent
    };
  },
});
</script>
