<template>
  <div style="width: 100%">
    <v-color-picker
      dot-size="38"
      hide-canvas
      hide-inputs
      mode="hexa"
      swatches-max-height="200"
      class="mb-3"
      :value="colorRgba"
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
// import { debounce } from "lodash";

export default {
  data() {
    return {
      font: "TimesNewRoman",
      rgba: "",
      size: "20",
      sizeItems: ["10", "20", "30", "40"],
      weight: "200",
      weightItems: ["100", "200", "400", "600", "800"],
      icons: ["mdi-format-bold", "mdi-format-underline", "mdi-format-strikethrough", "mdi-format-italic"],
      alignIcons: ["mdi-format-align-right", "mdi-format-align-center", "mdi-format-align-left"],
      addUnderLine: false,
      addLineThrough: false
    }
  },
  computed: {
    ...mapGetters({
      fontFamilyList: "fontFamilyList",
      fontFamily:"fontFamily",
      underline: "underline",
      lineThrough: "lineThrough",
      fontStyle: "fontStyle",
      colorRgba: "colorRgba",
      fontWeight: "textWeight",
      fontAlign: "fontAlign"
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
  methods: {
    setFontFamily(name) {
      console.log("name:", name);
      this.$store.commit("SET_FONT_FAMILY", name);
    },
    setColor(code) {
      console.log("setColor:", code);
      this.$store.commit("SET_COLOR_RGBA", code);
    },
    setSize(val) {
      console.log("val:", val);
      this.$store.commit("SET_TEXT_SIZE", val);
    },
    setWeight() {
      const weight = this.fontWeight === "200" ? "600" : "200";
      this.$store.commit("SET_TEXT_WEIGHT", weight);
    },
    setUnderLine() {
      this.$store.commit("SET_UNDERLINE", !this.underline);
    },
    setLineThrough() {
      this.$store.commit("SET_LINE_THROUGH", !this.lineThrough);
    },
    setStyle() {
      const style = this.fontStyle === "normal" ? "italic" : "normal";
      this.$store.commit("SET_FONT_STYLE", style);
    },
    setAlign(index) {
      const val = index === 0 ? "right" : index === 2 ? "left" : "center";
      this.$store.commit("SET_FONT_ALIGN", val);
    }
  }
}
</script>

<style scoped>
</style>
