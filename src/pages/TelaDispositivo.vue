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
        label="Insira seu Código:"
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
          v-if="isLineChartVisible"
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
        <p class="text-h6">Funcionamento do dispositivo:</p>
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

// import useLocal from "src/composables/UseLocal";
// import useUtilitario from "src/composables/UseUtilitarios";
import useDispositivo from "src/composables/UseDispositivo";

export default defineComponent({
  //bom pra identificação no vue
  name: "PageHomePaciente",
  components: {
    // BarChart,
    LineChart,
  },

  setup() {
    const quasar$ = useQuasar();
    let numeroInputParametroSistolica = ref(0);
    let numeroInputParametroDiastolica = ref(0);

    // const arrayVariavelApoio = ref(0);
    // const arraySistolica = ref([]);
    // const arrayDiastolica = ref([]);

    let isLineChartVisible = ref(true);

    // ... other variables and functions ...

    // Function to toggle the visibility of the LineChart
    function toggleLineChart() {
      isLineChartVisible.value = !isLineChartVisible.value;
    }

    const {
      // novaFuncaoFoda,
      idPessoaInput,
      testarGetDevices,
      conectadoDispositivo,
      log,
      logData,
      inicalizarObjetoCoracaoLocalStorage,
      ObjetoCoracaoLocalStorage,
    } = useDispositivo();

    // let customData = ref({
    //   labels: ["January", "February", "March"],
    //   datasets: [{ data: [40, 20, 12] }],
    // });

    // let customOptions = ref({
    //   responsive: true,
    // });

    const arroz = ref(0);

    function somarArroz(e) {
      // arroz.value++;
      lineChartData.value.labels = ObjetoCoracaoLocalStorage.value.horas;
      lineChartData.value.datasets[0].data =
        ObjetoCoracaoLocalStorage.value.pressaoDiastolica;
      lineChartData.value.datasets[1].data =
        ObjetoCoracaoLocalStorage.value.pressaoSistolica;

      isLineChartVisible.value = false;
      arroz.value++;
      isLineChartVisible.value = true;
    }

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

    // isso aqui não vai mudar, são as opções do gráfico
    let lineChartOptions = {
      responsive: true,
      maintainAspectRatio: true,
    };

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

    onBeforeMount(() => {
      isLineChartVisible.value = false;
    });
    // TODO: ajeitar onMounted

    onMounted(() => {
      // log("TESTANDO.vue");
      // inicalizarObjetoCoracaoLocalStorage();
      // console.log(ObjetoCoracaoLocalStorage.value);
      // isLineChartVisible.value = true;
      // lineChartData.value.labels = ObjetoCoracaoLocalStorage.value.horas;
      // lineChartData.value.datasets[0].data =
      //   ObjetoCoracaoLocalStorage.value.pressaoDiastolica;
      // lineChartData.value.datasets[1].data =
      //   ObjetoCoracaoLocalStorage.value.pressaoSistolica;
      // somarArroz();
    });

    return {
      logData,

      inicalizarObjetoCoracaoLocalStorage,
      quasar$,

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
      isLineChartVisible,
    };
  },
});
</script>
