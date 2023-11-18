<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleForgotPassword">
      <p class="text-h4 text-center col-12">Redefinir Senha!</p>
      <p class="text-h5 text-center col-12">
        Depois de enviado, verifique seu email
      </p>

      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          outlined
          label="Email"
          v-model="email"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Insira um email válido!',
          ]"
          type="email"
        />

        <div class="full-width q-pt-md">
          <q-btn
            label="Enviar email para resetar senha"
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
import useNotify from "src/composables/UseNotify";

export default defineComponent({
  setup() {
    const { sendPasswordRestEmail } = useAuthUser();
    const { notifyError, notifySuccess } = useNotify();

    const email = ref("");

    const handleForgotPassword = async () => {
      try {
        await sendPasswordRestEmail(email.value);
        // alert(
        //   `Foi enviado ao email ${email.value} uma solicitação para redefinição de senha`
        // );
        notifySuccess(
          `Foi enviado ao email ${email.value} uma solicitação para redefinição de senha`
        );
      } catch (error) {
        notifyError(error.message);
      }
    };

    return {
      email,
      handleForgotPassword,
    };
  },
});
</script>
