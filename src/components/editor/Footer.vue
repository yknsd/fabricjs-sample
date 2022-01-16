<template>
  <div style="max-width: 50px">
    <v-btn-toggle borderless :value="currentIndex" background-color="rgba(1,1,1,0)">
      <v-btn
        v-for="(value,index) in functions"
        :key="index"
        @click="goTo(value.name, index)"
        class="my-1"
        dark
        :color="value.color"
        style="border-radius: 50%"
      >
        <v-icon class="white--text">{{ value.icon }}</v-icon>
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
        {name: "trim", icon: "mdi-content-cut", color: "red lighten-2"},
        {name: "filter", icon: "mdi-image-filter-black-white", color: "pink lighten-2"},
        {name: "text", icon: "mdi-format-text", color: "purple lighten-2"},
        {name: "drawing", icon: "mdi-lead-pencil", color: "deep-purple lighten-2"},
        {name: "erase", icon: "mdi-eraser", color: "indigo lighten-2"},
        {name: "trash", icon: "mdi-trash-can", color: "light-blue lighten-2"}
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
