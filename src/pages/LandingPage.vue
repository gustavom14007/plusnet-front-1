<template>
  <q-page padding>
    <!-- todo: fazer uma landing page aqui -->
    <!-- colocar um botão que manda pra página MedHome no header -->
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import useAuthUser from "src/composables/UseAuthUser";
import { useRouter } from "vue-router";

export default defineComponent({
  //bom pra identificação no vue
  name: "PageLandingPage",

  setup() {
    const router = useRouter();

    // tamo usando nosso Composable useAuthUser pra acessar a instância login
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
