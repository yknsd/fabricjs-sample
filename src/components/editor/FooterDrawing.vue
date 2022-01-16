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
  components: {},
  data() {
    return {
      // color: "#42A5F5",
      // width: 10,
      widthItems: [ "2", "5", "10", "20", "50"]
    }
  },
  computed: {
    ...mapGetters({
      drawingColor: "drawingColor",
      drawingWidth: "drawingWidth"
    })
  },
  methods: {
    setWidth(val) {
      console.log("setWidth:", val);
      this.$store.commit("SET_DRAWING_WIDTH", val);
    },
    setColor(val) {
      this.$store.commit("SET_DRAWING_COLOR", val);
    }
  }
}
</script>

<style scoped>
</style>
