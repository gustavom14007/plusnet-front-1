<template>
  <q-page padding>
    <div class="row justify-center">
      <!-- <p class="text-h4 text-center col-12">Medtech Innovations</p> -->

      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
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
import { defineComponent, ref } from "vue";
import useAuthUser from "src/composables/UseAuthUser";
import { useRouter } from "vue-router";

export default defineComponent({
  //bom pra identificação no vue
  name: "PageHomeMed",

  setup() {
    const router = useRouter();

    const { login } = useAuthUser();

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
      form,
      handleLogin,
    };
  },
});
</script>
