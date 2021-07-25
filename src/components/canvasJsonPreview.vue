<template>
  <v-card
    v-if="!isEmpty"
    class="json-card"
  >
    <v-card-title class="text-left">canvas.toJSON</v-card-title>
    <v-card-text class="text-left">
      {{ canvasJson }}
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters}from "vuex";

export default {
  computed: {
    ...mapGetters({
      canvasJson: "canvasJson"
    }),
    isEmpty(){
      console.log("canvasJson:", this.canvasJson);
      // eslint-disable-next-line no-prototype-builtins
      return !this.canvasJson || !this.canvasJson.hasOwnProperty("objects");
    }
  },
}
</script>

<style scoped>
.json-card {
  width      : 100%;
  min-height : 100px;
}
</style>
