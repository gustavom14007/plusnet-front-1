<template>
  <q-page padding>
    <div class="justify-center row">
      <div class="text-left col-12 q-pa-sm">
        <q-avatar
          color="primary"
          text-color="white"
          icon="chevron_left"
          @click="router.go(-1)"
        />
        <q-avatar
          color="primary"
          text-color="white"
          icon="home"
          @click="filtrarDadosCoracoes(idPacienteRoxo)"
        />
      </div>
      <div class="col-12 row q-pa-sm">
        <q-img
          class="col-3"
          v-if="isUpdateImg_url"
          :src="isUpdateImg_url"
          fit="contain"
        ></q-img>
        <q-avatar
          class="col-3"
          v-else
          color="secondary"
          text-color="primary"
          icon="image"
        />
        <div class="col-5 q-pl-sm">
          <q-scroll-area style="height: 100%; max-width: 100%">
            <p><b>Id:</b> {{ isUpdateId }}</p>
            <p><b>Nome:</b> {{ isUpdateNome }}</p>
            <p><b>Sexo:</b> {{ isUpdateSexo }}</p>
            <p><b>Nascimento:</b>{{ isUpdateNascimento }}</p>
            <p><b>Profissão:</b> {{ isUpdateProfissao }}</p>
            <p><b>Clínica:</b> {{ isUpdateClinica_id }}</p>
            <p><b>Descrição:</b> {{ isUpdateDescricao }}</p>
            <!-- <p>{{ isUpdateImg_url }}</p> -->
          </q-scroll-area>
        </div>
      </div>
      <div class="full-width q-pa-sm row">
        <LineChart
          style="height: 350px"
          :key="banana"
          :chartData="lineChartDataComputed"
          :options="lineChartOptions"
          @click="atualizarGrafico"
        ></LineChart>
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
  onBeforeMount,
  computed,
  onUpdated,
  watch,
  watchEffect,
  toRef,
  toValue,
} from "vue";
import LineChart from "src/components/LineChart.vue";
import { useQuasar } from "quasar";
import { useRouter, useRoute } from "vue-router";
import useApi from "src/composables/UseApi";
import useNotify from "src/composables/UseNotify";
import useDispositivo from "src/composables/UseDispositivo";

export default defineComponent({
  name: "PageGraficoPaciente",
  components: {
    LineChart,
  },

  setup() {
    const quasar$ = useQuasar();
    const router = useRouter();
    const route = useRoute();
    const { notifyError, notifySuccess } = useNotify();
    const { list } = useApi();

    const { log, logData, conectadoDispositivo } = useDispositivo();

    const banana = ref(0);
    const table = "coracao";
    let idPacienteRoxo = 0;

    const isUpdateId = computed(() => {
      idPacienteRoxo = route.params.id;
      return route.params.id;
    });

    const isUpdateNome = computed(() => {
      return route.params.nome;
    });

    const isUpdateSexo = computed(() => {
      return route.params.sexo;
    });

    const isUpdateNascimento = computed(() => {
      return route.params.nascimento;
    });

    const isUpdateProfissao = computed(() => {
      return route.params.profissao;
    });

    const isUpdateClinica_id = computed(() => {
      return route.params.clinica_id;
    });

    const isUpdateDescricao = computed(() => {
      return route.params.descricao;
    });

    const isUpdateImg_url = computed(() => {
      return route.params.img_url;
    });

    const atualizarGrafico = () => {
      // console.log("arrozsss");
      banana.value++;
      // lineChartData.labels.push("25:25");
    };

    const coracoes = ref([
      {
        id: 1,
        id_paciente: 1,
        sistolica: "127",
        diastolica: "96",
        horas: "17:10",
        dia: null,
      },
      {
        id: 2,
        id_paciente: 1,
        sistolica: "127",
        diastolica: "96",
        horas: "17:10",
        dia: null,
      },
      {
        id: 3,
        id_paciente: 1,
        sistolica: "127",
        diastolica: "96",
        horas: "17:10",
        dia: null,
      },
      {
        id: 4,
        id_paciente: 2,
        sistolica: "127",
        diastolica: "96",
        horas: "17:10",
        dia: null,
      },
      {
        id: 5,
        id_paciente: 2,
        sistolica: "127",
        diastolica: "96",
        horas: "17:10",
        dia: null,
      },
    ]);

    let labelsApi = [];
    let dataDiastolica = [];
    let dataSiastolica = [];

    let listaApi;

    function filtrarDadosCoracoes(idInput) {
      console.log(coracoes.value);
      let guardarCoracao = coracoes.value;

      console.log(guardarCoracao);
      // guardarCoracao.forEach((atual) => {
      //   let idAtual = "" + atual.id_paciente;
      //   console.log(idAtual);
      //   if (idAtual == idInput || idAtual == parseInt(idInput)) {
      //     labelsApi.push(atual.horas);
      //     dataDiastolica.push(atual.diastolica);
      //     dataSiastolica.push(atual.sistolica);
      //   }
      // });

      labelsApi = guardarCoracao
        .filter((atual) => {
          const idAtual = "" + atual.id_paciente;
          return idAtual == idInput || idAtual == parseInt(idInput);
        })
        .map((atual) => atual.horas);

      dataDiastolica = guardarCoracao
        .filter((atual) => {
          const idAtual = "" + atual.id_paciente;
          return idAtual == idInput || idAtual == parseInt(idInput);
        })
        .map((atual) => atual.diastolica);

      dataSiastolica = guardarCoracao
        .filter((atual) => {
          const idAtual = "" + atual.id_paciente;
          return idAtual == idInput || idAtual == parseInt(idInput);
        })
        .map((atual) => atual.sistolica);

      // labelsApi = toValue(coracoes)
      // .filter((item) => item.id_paciente == id)
      // .map((item) => item.horas);
      // dataDiastolica = toValue(coracoes)
      // .filter((item) => item.id_paciente == id)
      // .map((item) => item.diastolica);
      // dataSiastolica = toValue(coracoes)
      // .filter((item) => item.id_paciente == id)
      // .map((item) => item.sistolica);

      lineChartData.labels = labelsApi;
      lineChartData.datasets[0].data = dataDiastolica;
      lineChartData.datasets[1].data = dataSiastolica;

      // console.log(coracoes.value);
      // coracoes = ref(guardarCoracao);

      atualizarGrafico();
    }

    const isRouteContainingGraficoPaciente = computed(() => {
      return route.path.includes("grafico-paciente");
    });

    const handleListCoracao = async () => {
      if (isRouteContainingGraficoPaciente.value) {
        try {
          console.log("Corações:");
          console.log(coracoes);
          coracoes.value = await list("coracao");
          filtrarDadosCoracoes(idPacienteRoxo);
          console.log(labelsApi);
          console.log(dataDiastolica);
          console.log(dataSiastolica);

          console.log("Lista API");
          console.log(listaApi);
        } catch (error) {
          notifyError(error.message);
          // loading.value = false;
        }
      } else {
        console.log("tentou ne");
      }
    };

    const lineChartData = {
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
      ],
    };

    const lineChartDataComputed = computed(() => {
      return lineChartData;
    });

    // isso aqui não vai mudar, são as opções do gráfico
    let lineChartOptions = {
      responsive: true,
      maintainAspectRatio: true,
    };

    // const el = ref();

    const executarDepois = async () => {
      // console.log(1);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // 3 sec
      // console.log(2);

      await handleListCoracao();
    };

    onMounted(() => {
      // console.log(isUpdateId.value);

      // console.log(el.value);

      // if (el.value != undefined) {
      // }

      // while (el.value == undefined) {
      //   handleListCoracao();
      // }

      // executarDepois();
      handleListCoracao();

      setInterval(async () => {
        handleListCoracao();
      }, 60000);
    });

    onUpdated(() => {
      // handleListCoracao();
    });

    // watchEffect(el, () => {
    // console.log("watch el mudou algo");
    // });

    return {
      lineChartOptions,
      lineChartData,

      isUpdateId,
      isUpdateNome,
      isUpdateSexo,
      isUpdateNascimento,
      isUpdateProfissao,
      isUpdateClinica_id,
      isUpdateDescricao,
      isUpdateImg_url,

      log,
      logData,

      conectadoDispositivo,

      atualizarGrafico,
      filtrarDadosCoracoes,
      coracoes,

      lineChartDataComputed,

      banana,
      router,

      // el,
      idPacienteRoxo,
    };
  },
});
</script>
