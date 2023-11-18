<template>
  <q-page padding>
    <div class="row justify-center" @submit.prevent="handleLogin">
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <p class="text-h4 text-center col-12">Medico Home</p>
        <LineChart
          @click="somarArroz"
          :key="arroz2"
          :chartData="lineChartDataComputed"
          :chartOptions="lineChartOptions"
        ></LineChart>
      </div>
      <p class="text-h4">testando banana: {{ banana }}</p>
      <q-btn
        label="Somar Banana"
        color="dark"
        class="full-width"
        rounded
        size="lg"
        @click="testarBanana"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import useAuthUser from "src/composables/UseAuthUser";
import { useRouter } from "vue-router";

import PacienteHome from "pages/PacienteHome.vue";
let { LineChart, lineChartDataComputed, lineChartOptions, arroz2, somarArroz } =
  PacienteHome.setup();

import useTeste from "src/composables/UseTeste";

export default defineComponent({
  //bom pra identificação no vue
  name: "PageHomeMedico",
  components: {
    LineChart,
  },

  setup() {
    const router = useRouter();

    const { login } = useAuthUser();

    const { banana, testarBanana } = useTeste();

    const form = ref({
      email: "",
      password: "",
    });

    const handleLogin = async () => {
      try {
        await login(form.value);
        router.push({ name: "me" });
      } catch (error) {
        alert(error.message);
      }
    };

    return {
      LineChart,
      lineChartDataComputed,
      lineChartOptions,
      arroz2,
      somarArroz,
      form,
      handleLogin,
      banana,
      testarBanana,
    };
  },
});
</script>
