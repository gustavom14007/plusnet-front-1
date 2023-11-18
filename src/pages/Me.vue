<template>
  <q-page>
    <div class="row justify-center">
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <p class="full-width q-pt-xl text-center" v-if="user">
          Olá, {{ user.email }}!
        </p>

        <!-- <p class="text-h4 text-center col-12">Medtech Innovations</p> -->

        <div class="full-width q-pt-md">
          <q-btn
            label="Cadastro de Clínica"
            color="primary"
            class="full-width"
            rounded
            size="lg"
            to="/clinica"
          />
        </div>
        <div class="full-width">
          <q-btn
            label="Cadastro de Paciente"
            color="primary"
            class="full-width"
            rounded
            size="lg"
            to="/paciente"
          />
        </div>
        <div class="full-width">
          <q-btn
            label="Dispositivo"
            color="primary"
            class="full-width"
            rounded
            size="lg"
            to="/dispositivo"
          />
        </div>
        <div class="full-width">
          <!-- <q-btn
            label="Paciente"
            color="primary"
            class="full-width"
            rounded
            size="lg"
            to="/PacienteHome"
          /> -->
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import useAuthUser from "src/composables/UseAuthUser";
import useTeste from "src/composables/UseTeste";

export default defineComponent({
  name: "PageMe",

  setup() {
    // const { banana, testarBanana } = useTeste();

    const { user } = useAuthUser();

    console.log(user);

    return {
      user,
      // banana,
      // testarBanana,
    };
  },
});
</script>
