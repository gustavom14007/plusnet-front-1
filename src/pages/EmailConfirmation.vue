<template>
  <q-page padding>
    <p class="text-body1">Obrigado por se registrar!</p>
    <p class="text-body1">
      Por favor, confira sua caixa de entrada para finalizar seu cadastro:
      <strong>
        {{ $route.query.email }}
      </strong>
    </p>
    <div class="row justify-center">
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-btn
          label="Voltar para Login"
          color="primary"
          class="full-width"
          rounded
          size="lg"
          :to="{ name: 'login' }"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageEmailConfirmation",
});
</script>
