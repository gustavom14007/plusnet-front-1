<template>
  <div>
    <!-- <button @click="handleCanvasClick">Toggle Mode</button> -->
    <!-- <canvas ref="canvas"></canvas> -->
  </div>
</template>
<!--
<script>
import {
  ref,
  defineComponent,
  onUnmounted,
  onMounted,
  watchEffect,
  watch,
} from "vue";

import useLocalStorage from "src/composables/UseLocalStorage";

export default {
  name: "CanvasComponent",

  setup() {
    const BAR_WIDTH = 11;
    const MAX_HEIGHT = 200;
    const LINE_WIDTH = 6;
    const SHADOW_BLUR = 1;
    const SHADOW_COLOR = "#333";
    const SHADOW_OFFSET_Y = 1;
    let mode = ref("bar");
    let canvas = ref(null);
    let arrayBPM = ref([]);
    let teste = ref(""); // Declare teste como uma variável reativa

    // Composable useLocalStorage
    const {
      objetoNoLocalStorage,
      adicionarAoLocalStorage,
      obterBPMsDoLocalStorage,
    } = useLocalStorage();

    onMounted(() => {
      teste.value = localStorage.getItem("meuObjeto");

      watchEffect(() => {
        const newData = localStorage.getItem("meuObjeto");
        teste.value = newData;

        if (newData) {
          const parsedData = JSON.parse(newData);
          const bpmArray = parsedData.dados.map((dado) =>
            parseInt(dado.batimentosPorMinuto)
          );
          arrayBPM.value = bpmArray;
          drawWaves();
        }
      });

      window.addEventListener("resize", drawWaves);
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
          drawWaves();
        }
      });
      drawWaves();
    });

    const drawWaves = () => {
      let arrayBPMCoracao = arrayBPM.value;
      requestAnimationFrame(() => {
        if (!canvas.value) return;

        const devicePixelRatio = window.devicePixelRatio || 1;
        const canvasWidth =
          parseInt(getComputedStyle(canvas.value).width.slice(0, -2)) *
          devicePixelRatio;
        const canvasHeight =
          parseInt(getComputedStyle(canvas.value).height.slice(0, -2)) *
          devicePixelRatio;

        canvas.value.width = canvasWidth;
        canvas.value.height = canvasHeight;

        const context = canvas.value.getContext("2d");
        const margin = 2;
        const max = Math.max(0, Math.round(canvasWidth / BAR_WIDTH));
        const offset = Math.max(0, arrayBPMCoracao.length - max);

        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.strokeStyle = "#00796B";

        if (mode.value === "bar") {
          for (let i = 0; i < Math.max(arrayBPMCoracao.length, max); i++) {
            const barHeight = Math.round(
              (arrayBPMCoracao[i + offset] * canvasHeight) / MAX_HEIGHT
            );
            context.rect(
              BAR_WIDTH * i + margin,
              canvasHeight - barHeight,
              margin,
              Math.max(0, barHeight - margin)
            );
            context.stroke();
          }
        } else if (mode.value === "line") {
          context.beginPath();
          context.lineWidth = LINE_WIDTH;
          context.lineJoin = "round";
          context.shadowBlur = SHADOW_BLUR;
          context.shadowColor = SHADOW_COLOR;
          context.shadowOffsetY = SHADOW_OFFSET_Y;

          for (let i = 0; i < Math.max(arrayBPMCoracao.length, max); i++) {
            const lineHeight = Math.round(
              (arrayBPMCoracao[i + offset] * canvasHeight) / MAX_HEIGHT
            );
            if (i === 0) {
              context.moveTo(BAR_WIDTH * i, canvasHeight - lineHeight);
            } else {
              context.lineTo(BAR_WIDTH * i, canvasHeight - lineHeight);
            }
            context.stroke();
          }
        }
      });
    };

    onUnmounted(() => {
      window.removeEventListener("resize", drawWaves);
    });

    const handleCanvasClick = () => {
      mode.value = mode.value === "bar" ? "line" : "bar";
      drawWaves();
    };

    return {
      mode,
      teste,
      arrayBPM,
      canvas,
      drawWaves,
      handleCanvasClick,
      adicionarAoLocalStorage,
      obterBPMsDoLocalStorage,
    };
  },
};
</script> -->
