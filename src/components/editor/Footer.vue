<template>
  <div>
    <v-btn-toggle>
      <v-btn
        v-for="(value,index) in functions"
        :key="`function-${index}`"
        @click="goTo(value.name, index)"
      >
        <v-icon>{{ value.icon }}</v-icon>
      </v-btn>
    </v-btn-toggle>
    <FooterText v-show="currentIndex===2" />
  </div>
</template>

<script>
import FooterText from "./FooterText";
import { mapGetters } from "vuex";

export default {
  components: {
    FooterText
  },
  data() {
    return {
      functions: [
        {name: "trim", icon: "mdi-content-cut"},
        {name: "filter", icon: "mdi-image-filter-black-white"},
        {name: "text", icon: "mdi-format-text"},
        {name: "drawing", icon: "mdi-lead-pencil"},
        {name: "erase", icon: "mdi-eraser"}
      ],
    }
  },
  computed: {
    ...mapGetters({
      currentIndex: "selectedMenuIndex"
    })
  },
  methods: {
    goTo(name, index) {
      this.$store.commit("SET_SELECTED_MENU_INDEX", index);
      this.$emit(name);
    }
  }
}
</script>
