<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleRegister">
      <p class="text-h4 text-center col-12">Crie sua Conta!</p>
      <p class="text-h5 text-center col-12">Depois, verifique seu email</p>

      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          outlined
          label="Nome"
          v-model="form.name"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Insira um nome válido!',
          ]"
        />
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
            label="Finalizar Cadastro"
            color="primary"
            class="full-width"
            rounded
            size="lg"
            type="submit"
          />
        </div>
        <div class="full-width">
          <q-btn
            label="Voltar para Login"
            color="dark"
            class="full-width"
            rounded
            size="lg"
            :to="{ name: 'login' }"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import useAuthUser from "src/composables/UseAuthUser";
import { useRouter } from "vue-router";
import useNotify from "src/composables/UseNotify";

export default defineComponent({
  name: "PageRegister",

  setup() {
    const router = useRouter();
    const { register } = useAuthUser();

    const { notifyError, notifySuccess } = useNotify();

    const form = ref({
      name: "",
      email: "",
      password: "",
    });

    const handleRegister = async () => {
      try {
        await register(form.value);
        notifySuccess("Conta criada com sucesso!");
        router.push({
          name: "email-confirmation",
          query: { email: form.value.email },
        });
      } catch (error) {
        // alert(error);
        notifyError(error.message);
      }
    };

    return {
      form,
      handleRegister,
    };
  },
});
</script>
