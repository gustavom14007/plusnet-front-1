<template>
  <q-page padding>
    <div class="row justify-center">
      <p class="text-h5 text-center col-12"></p>

      <q-table
        :rows="pacientes"
        :columns="columnsPaciente"
        row-key="id"
        class="col-12"
        :loading="loading"
        @row-click.prevent="handleGrafico"
      >
        <template v-slot:top>
          <span class="text-h6">Paciente</span>
          <!-- <q-space /> -->
          <!-- <q-input
            borderless
            dense
            debounce="300"
            color="primary"
            v-model="filter"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input> -->
          <q-space />
          <q-btn
            v-if="quasar$.platform.is.desktop"
            icon="add"
            color="info"
            label="Adicionar"
            to="form-paciente"
          />
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              icon="edit"
              color="dark"
              round
              size="md"
              @click="handleEdit(props.row)"
              ><q-tooltip> Editar </q-tooltip></q-btn
            >
            <q-btn
              icon="delete"
              color="negative"
              round
              size="md"
              @click="handleRemovePaciente(props.row)"
            >
              <q-tooltip> Deletar </q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:body-cell-img_url="props">
          <q-td :props="props">
            <!-- <q-avatar> -->
            <q-img
              v-if="props.row.img_url"
              :src="props.row.img_url"
              fit="contain"
            ></q-img>
            <q-avatar
              v-else
              color="secondary"
              text-color="primary"
              icon="image"
            />
            <!-- </q-avatar> -->
          </q-td>
        </template>

        <template v-slot:body-cell-descricao="props">
          <q-td :props="props" style="max-width: 50px; overflow: auto">
            {{ props.row.descricao }}
          </q-td>
        </template>
      </q-table>
    </div>

    <q-page-sticky
      position="bottom-right"
      :offset="[18, 18]"
      v-if="quasar$.platform.is.mobile"
    >
      <q-btn fab icon="add" color="info" to="form-paciente" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import useApi from "src/composables/UseApi";
import useNotify from "src/composables/UseNotify";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

import { columnsPaciente } from "./table";

export default defineComponent({
  //bom pra identificação no vue
  name: "PagePacienteList",
  setup() {
    const { notifyError, notifySuccess } = useNotify();

    const quasar$ = useQuasar();

    const pacientes = ref([]);
    const { list, remove } = useApi();
    const loading = ref(true);
    const table = "paciente";

    const addRow = async () => {};

    const router = useRouter();

    const handleListPacientes = async () => {
      try {
        loading.value = true;
        pacientes.value = await list(table);
        loading.value = false;
      } catch (error) {
        notifyError(error.message);
        loading.value = false;
      }
    };

    const handleEdit = (paciente) => {
      router.push({ name: "form-paciente", params: { id: paciente.id } });
    };

    const handleGrafico = (event, row, index) => {
      const paciente = pacientes.value[index];
      console.log(paciente);

      router.push({
        name: "grafico-paciente",
        params: {
          id: paciente.id,
          nome: paciente.nome,
          sexo: paciente.sexo,
          nascimento: paciente.nascimento,
          profissao: paciente.profissao,
          clinica_id: paciente.clinica_id,
          descricao: paciente.descricao,
          img_url: paciente.img_url,
        },
      });
    };

    const handleRemovePaciente = async (paciente) => {
      try {
        quasar$
          .dialog({
            title: "Confirmar",
            message: `Você tem certeza de que quer excluir  ${paciente.nome} ?`,
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            await remove(table, paciente.id);
            notifySuccess("Clínica removida com sucesso!");
            handleListPacientes();
          });
      } catch (error) {
        notifyError(error.message);
      }
    };

    onMounted(() => {
      //primeiro exemplo que eu fiz de pedir dados na hora de iniciar
      handleListPacientes();
    });

    return {
      columnsPaciente,
      pacientes,
      handleListPacientes,
      addRow,
      loading,
      handleEdit,
      handleRemovePaciente,
      quasar$,
      handleGrafico,
    };
  },
});
</script>
