<template>
  <div>
    <v-btn-toggle class="mb-3" dense dark multiple background-color="rgba(1,1,1,0)">
      <v-btn small @click="setUnderLine"><v-icon small>{{ icons[0]}}</v-icon></v-btn>
      <v-btn small @click="setLineThrough"><v-icon small>{{ icons[1]}}</v-icon></v-btn>
      <v-btn small @click="setStyle"><v-icon small>{{ icons[2]}}</v-icon></v-btn>
    </v-btn-toggle>
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
      this.addLineThrough = false;
      this.$store.commit("SET_UNDERLINE", this.addUnderLine);
      this.$store.commit("SET_LINE_THROUGH", false);
      this.$store.commit("SET_FONT_STYLE", "normal");
    },
    setLineThrough() {
      this.addLineThrough = !this.addLineThrough;
      this.addUnderLine = false;
      this.$store.commit("SET_UNDERLINE", false);
      this.$store.commit("SET_LINE_THROUGH", this.addLineThrough);
      this.$store.commit("SET_FONT_STYLE", "normal");
    },
    setStyle() {
      this.$store.commit("SET_FONT_STYLE", "italic");
    }
  }
}
</script>

<style scoped>
.sub-menu-div {
  max-width        : 250px;
  max-height       : 280px;
  background-color : rgba(239, 239, 239, 0.7);
  border-radius    : 15px;
  padding          : 20px;
}
</style>
