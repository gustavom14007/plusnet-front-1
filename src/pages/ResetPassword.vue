<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handlePasswordReset">
      <p class="text-h4 text-center col-12">Insira sua nova senha!</p>

      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          outlined
          label="Nova Senha"
          v-model="password"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Insira uma senha válida!',
          ]"
        />

        <div class="full-width q-pt-md">
          <q-btn
            label="Confirmar nova senha"
            color="primary"
            class="full-width"
            rounded
            size="lg"
            type="submit"
          />
        </div>
        <div class="full-width"></div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import useAuthUser from "src/composables/UseAuthUser";
import { useRouter, useRoute } from "vue-router";
import useNotify from "src/composables/UseNotify";

export default defineComponent({
  name: "PageResetPassword",

  setup() {
    const { resetPassword } = useAuthUser();
    const router = useRouter();
    const route = useRoute();
    const token = route.query.token;

    const password = ref("");

    const { notifyError, notifySuccess } = useNotify();

    const handlePasswordReset = async () => {
      try {
        await resetPassword(token, password.value);
        notifySuccess("Senha redefinida com sucesso!");
        router.push({ name: "login" });
      } catch (error) {
        notifyError(error.message);
      }
    };

    return {
      password,
      handlePasswordReset,
    };
  },
});
</script>
