<template>
  <v-card
    v-if="!isEmpty"
    class="json-card"
    dark
  >
    <v-card-title class="text-left">canvas.toJSON</v-card-title>
    <v-card-text class="text-left json-text">
      {{ colorizedJson }}
    </v-card-text>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";
import colorize from "json-colorizer";

export default {
  data() {
    return {
      colorizedJson: {},
      colorizeOptions: {
        colors: {
          STRING_KEY: 'green',
          STRING_LITERAL: 'magenta.bold',
          NUMBER_LITERAL: '#FF0000'
        },
        pretty: true
      }
    };
  },
  mounted() {
    this.$set(this, "colorizedJson", colorize(this.canvasJson, this.colorizeOptions));
    console.log(this.colorizedJson);
  },
  computed: {
    ...mapGetters({
      canvasJson: "canvasJson"
    }),
    isEmpty() {
      // eslint-disable-next-line no-prototype-builtins
      return !this.canvasJson || !this.canvasJson.hasOwnProperty("objects");
    }
  },
  watch: {
    canvasJson(newJson) {
      this.$set(this, "colorizedJson", colorize(newJson, this.colorizeOptions));
      console.log(this.colorizedJson);
    }
  }
}
</script>

<style scoped>
.json-card {
  width      : 100%;
  min-height : 100px;
}
.json-text {
  color: chartreuse !important;
}
</style>
