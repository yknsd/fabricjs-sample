<template>
  <div style="width: 100%">
    <v-color-picker
      dot-size="38"
      hide-canvas
      hide-inputs
      mode="hexa"
      swatches-max-height="200"
      class="mb-3"
      :value="colorCode"
      @input="setColor"
      style="background-color: rgba(1,1,1,0)"
    ></v-color-picker>
    <v-btn-toggle class="mb-3" dense dark multiple background-color="rgba(1,1,1,0)">
      <v-btn small @click="setWeight()"><v-icon small>{{ icons[0]}}</v-icon></v-btn>
      <v-btn small @click="setUnderLine"><v-icon small>{{ icons[1]}}</v-icon></v-btn>
      <v-btn small @click="setLineThrough"><v-icon small>{{ icons[2]}}</v-icon></v-btn>
      <v-btn small @click="setStyle"><v-icon small>{{ icons[3]}}</v-icon></v-btn>
    </v-btn-toggle>
    <v-btn-toggle class="mb-3" dense dark background-color="rgba(1,1,1,0)" :value="alignIndex">
      <v-btn
        v-for="(val, index) in alignIcons"
        :key="index"
        small
        @click="setAlign(index)"
      >
        <v-icon small>{{ val }}</v-icon>
      </v-btn>
    </v-btn-toggle>
    <v-select
      :value="fontFamily"
      :items="fontFamilyList"
      :rules="[v => !!v || 'Item is required']"
      label="Font"
      required
      @change="setFontFamily"
      class="body-2 px-4"
    ></v-select>
<!--    <v-select-->
<!--      v-model="size"-->
<!--      :items="sizeItems"-->
<!--      :rules="[v => !!v || 'Item is required']"-->
<!--      label="Size"-->
<!--      required-->
<!--      dense-->
<!--      class="body-2"-->
<!--      @change="setSize"-->
<!--    ></v-select>-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "FooterText",
  data() {
    return {
      sizeItems: ["10", "20", "30", "40"],
      weightItems: ["100", "200", "400", "600", "800"],
      icons: ["mdi-format-bold", "mdi-format-underline", "mdi-format-strikethrough", "mdi-format-italic"],
      alignIcons: ["mdi-format-align-left", "mdi-format-align-center", "mdi-format-align-right"],
      fabricCanvas: undefined,
    }
  },
  computed: {
    ...mapGetters({
      fontFamilyList: "wText/fontFamilyList",
      fontFamily:"wText/fontFamily",
      underline: "wText/underline",
      lineThrough: "wText/lineThrough",
      fontStyle: "wText/fontStyle",
      colorCode: "wText/colorCode",
      fontWeight: "wText/textWeight",
      fontAlign: "wText/fontAlign"
    }),
    alignIndex() {
      switch (this.fontAlign) {
        case "center":
          return 1;
        case "right":
          return 0;
        default:
          return 2;
      }
    }
  },
  created() {
    const canvas = document.getElementById("canvasEl").fabric;
    this.$set(this, "fabricCanvas", canvas);
  },
  methods: {
    setFontFamily(name) {
      console.log("name:", name);
      this.$store.commit("wText/SET_FONT_FAMILY", name);
      this.updateActiveObject("fontFamily", name);
    },
    setColor(code) {
      console.log("setColor:", code);
      this.$store.commit("wText/SET_COLOR_CODE", code);
      this.updateActiveObject("fill", code);
    },
    setSize(val) {
      console.log("val:", val);
      this.$store.commit("wText/SET_TEXT_SIZE", val);
      this.updateActiveObject("fontSize", val);
    },
    setWeight() {
      console.log("fontWeight:", this.fontWeight);
      const weight = this.fontWeight === 200 ? 600 : 200;
      this.$store.commit("wText/SET_TEXT_WEIGHT", weight);
      this.updateActiveObject("fontWeight", weight);
    },
    setUnderLine() {
      const bol = !this.underline;
      this.$store.commit("wText/SET_UNDERLINE", bol);
      this.updateActiveObject("underline", bol);
    },
    setLineThrough() {
      const bol = !this.lineThrough;
      this.$store.commit("wText/SET_LINE_THROUGH", bol);
      this.updateActiveObject("linethrough", bol);
    },
    setStyle() {
      const style = this.fontStyle === "normal" ? "italic" : "normal";
      this.$store.commit("wText/SET_FONT_STYLE", style);
      this.updateActiveObject("fontStyle", style);
    },
    setAlign(index) {
      const val = index === 0 ? "left" : index === 2 ? "right" : "center";
      this.$store.commit("wText/SET_FONT_ALIGN", val);
      this.updateActiveObject("textAlign", val);
    },
    /**
     * @param option
     * @param val
     */
    updateActiveObject(option, val) {
      const textBox = this.fabricCanvas.getActiveObject();
      if (textBox) {
        textBox.set(option, val);
        textBox.setCoords();
        this.fabricCanvas.requestRenderAll();
      }
    }
  }
}
</script>

<style scoped>
</style>
