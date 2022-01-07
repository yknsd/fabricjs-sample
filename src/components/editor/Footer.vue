<template>
  <div style="max-width: 50px">
    <v-btn-toggle borderless :value="currentIndex">
      <v-btn
        v-for="(value,index) in functions"
        :key="index"
        @click="goTo(value.name, index)"
        class="mt-1"
        style="border-radius: 50%"
      >
        <v-icon>{{ value.icon }}</v-icon>
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
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

<style scoped>
>>> .v-btn-toggle {
  display: inherit;
}
</style>
