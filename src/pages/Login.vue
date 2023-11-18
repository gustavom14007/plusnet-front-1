<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleLogin">
      <p class="text-h4 text-center col-12">Bem vindo!</p>
      <p class="text-h5 text-center col-12">
        Para acessar o sistema, faça Login
      </p>

      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          outlined
          label="Email"
          v-model="form.email"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Insira um email válido!',
          ]"
          type="email"
        />
        <q-input
          outlined
          label="Senha"
          v-model="form.password"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Insira uma senha válida!',
          ]"
        />

        <div class="full-width q-pt-md">
          <q-btn
            label="Entrar"
            color="primary"
            class="full-width"
            rounded
            size="lg"
            type="submit"
          />
        </div>
        <div class="full-width">
          <q-btn
            label="Criar Conta"
            color="dark"
            class="full-width"
            rounded
            size="lg"
            to="/register"
          />
        </div>
        <div class="full-width">
          <q-btn
            label="Esqueceu sua senha?"
            color="primary"
            class="full-width"
            rounded
            flat
            size="lg"
            to="/forgot-password"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import useAuthUser from "src/composables/UseAuthUser";
import { useRouter } from "vue-router";
import useNotify from "src/composables/UseNotify";

export default defineComponent({
  //bom pra identificação no vue
  name: "PageLogin",

  setup() {
    const router = useRouter();

    // tamo usando nosso Composable useAuthUser pra acessar a instância login
    const { login, isLoggedIn } = useAuthUser();

    const { notifyError, notifySuccess } = useNotify();

    const form = ref({
      email: "",
      password: "",
    });

    onMounted(() => {
      if (isLoggedIn) {
        router.push({ name: "me" });
      }
    });

    const handleLogin = async () => {
      try {
        await login(form.value);
        notifySuccess("Login feito com sucesso!");
        router.push({ name: "me" });
      } catch (error) {
        // alert(error.message);
        notifyError(error.message);
      }
    };

    return {
      form,
      handleLogin,
    };
  },
});
</script>
