<template>
  <div style="width: 100%" class="pa-4">
    <v-radio-group v-model="format">
      <v-radio
        v-for="(val, index) in optionList"
        :key="index"
        :value="index"
        class="pb-2"
      >
        <template v-slot:label>
          <span :class="format === index ? `active-radio body-2` : `body-2`">{{ val }}</span>
        </template>
      </v-radio>
    </v-radio-group>
    <a ref="saveData">
      <v-btn color="primary" small @click="onClickExport">Export</v-btn>
    </a>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "FooterExport",
  data() {
    return {
      format: 0,
      optionList: [ "Image(jpeg)", "Image(png)", "JSON", "SVG"]
    }
  },
  computed: {
    ...mapGetters(["filename"])
  },
  beforeDestroy() {
    this.revokeObjectURL();
  },
  methods: {
    onClickExport() {
      console.log("onClickExport:", this.format);
      this.revokeObjectURL();
      const canvas = document.getElementById("canvasEl").fabric;
      const a = this.$refs.saveData;
      a.download = this.filename;
      if (this.format === 2) {
        const jsonObj = JSON.stringify(canvas.toJSON());
        const blob = new Blob([jsonObj], { type: "text/plain" });
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      } else if (this.format === 3) {
        const svg = canvas.toSVG();
        const blob = new Blob([svg], {type: "image/svg+xml"});
        a.href = window.URL.createObjectURL(blob);
      } else {
        const options = {
          format: this.format === 0 ? "jpeg" : "png"
        };
        a.href = canvas.toDataURL(options);
      }
      // this.$refs.saveData.click();
    },
    revokeObjectURL() {
      const href = this.$refs.saveData.href
      if (href) {
        window.URL.revokeObjectURL(href);
      }
    }
  }
}
</script>

<style scoped>
.active-radio {
  color: #0d6c6c;
  border-bottom: 0.2px solid #0d6c6c;
}
</style>
