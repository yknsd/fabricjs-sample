<template>
  <div style="width: 100%">
    <v-color-picker
      dot-size="38"
      hide-canvas
      hide-inputs
      mode="hexa"
      swatches-max-height="200"
      class="mb-3"
      :value="drawingColor"
      @input="setColor"
      style="background-color: rgba(1,1,1,0)"
    ></v-color-picker>
    <v-select
      :value="drawingWidth"
      :items="widthItems"
      :rules="[v => !!v || 'Item is required']"
      label="Width"
      required
      dense
      @change="setWidth"
      class="body-2 px-4"
    ></v-select>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "FooterDrawing",
  data() {
    return {
      widthItems: [ "2", "5", "10", "20", "50"],
      fabricCanvas: undefined
    }
  },
  created() {
    const canvas = document.getElementById("canvasEl").fabric;
    this.$set(this, "fabricCanvas", canvas);
  },
  computed: {
    ...mapGetters({
      drawingColor: "drawingColor",
      drawingWidth: "drawingWidth"
    })
  },
  methods: {
    setWidth(num) {
      console.log("setWidth:", num);
      this.$store.commit("SET_DRAWING_WIDTH", num);
      if (this.fabricCanvas.freeDrawingBrush) {
        this.$set(this.fabricCanvas.freeDrawingBrush, "width", num);
        this.fabricCanvas.requestRenderAll();
      }
    },
    setColor(code) {
      this.$store.commit("SET_DRAWING_COLOR", code);
      if (this.fabricCanvas.freeDrawingBrush) {
        this.$set(this.fabricCanvas.freeDrawingBrush, "color", code);
        this.fabricCanvas.requestRenderAll();
      }
    }
  }
}
</script>

<style scoped>
</style>
