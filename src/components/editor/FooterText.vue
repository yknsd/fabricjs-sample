<template>
  <div>
    <v-select
      v-model="font"
      :items="fontItems"
      :rules="[v => !!v || 'Item is required']"
      label="Font"
      required
      @change="setFont"
    ></v-select>
    <v-select
      v-model="size"
      :items="sizeItems"
      :rules="[v => !!v || 'Item is required']"
      label="Size"
      required
      @change="setSize"
    ></v-select>
    <v-select
      v-model="weight"
      :items="weightItems"
      :rules="[v => !!v || 'Item is required']"
      label="Weight"
      required
      @change="setSize"
    ></v-select>
    <v-btn-toggle>
      <v-btn @click="setUnderLine"><v-icon>{{ icons[0]}}</v-icon></v-btn>
      <v-btn @click="setLineThrough"><v-icon>{{ icons[1]}}</v-icon></v-btn>
      <v-btn @click="setStyle"><v-icon>{{ icons[2]}}</v-icon></v-btn>
    </v-btn-toggle>
  </div>
</template>

<script>
import { mapGetters} from "vuex";

export default {
  data() {
    return {
      font: "TimesNewRoman",
      size: "20",
      sizeItems: ["10", "20", "30", "40"],
      weight: "200",
      weightItems: ["100", "200", "400", "600", "800"],
      icons: ["mdi-format-underline", "mdi-format-strikethrough", "mdi-format-italic"],
      addUnderLine: false,
      addLineThrough: false
    }
  },
  computed: {
    ...mapGetters({
      fontItems: "fontItems"
    })
  },
  methods: {
    setFont(name) {
      console.log("name:", name);
      this.$store.commit("SET_FONT_INDEX", name);
    },
    setSize(val) {
      console.log("val:", val);
      this.$store.commit("SET_TEXT_SIZE", val);
    },
    setWeight(val) {
      console.log("val: ", val);
      this.$store.commit("SET_TEXT_WEIGHT", val);
    },
    setUnderLine() {
      this.addUnderLine = !this.addUnderLine;
      this.$store.commit("SET_UNDERLINE", this.addUnderLine);
      this.$store.commit("SET_FONT_STYLE", "normal");
    },
    setLineThrough() {
      this.addLineThrough = !this.addLineThrough;
      this.$store.commit("SET_LINE_THROUGH", this.addLineThrough);
      this.$store.commit("SET_FONT_STYLE", "normal");
    },
    setStyle() {
      this.$store.commit("SET_FONT_STYLE", "italic");
    }
  }
}
</script>
