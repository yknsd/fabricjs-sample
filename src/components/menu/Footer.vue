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
        // {name: "trim", icon: "mdi-content-cut", color: "#E57373"},
        {name: "filter", icon: "mdi-image-filter-black-white", color: "#F06292"},
        {name: "text", icon: "mdi-format-text", color: "#AB47BC"},
        {name: "drawing", icon: "mdi-lead-pencil", color: "#7E57C2"},
        // {name: "erase", icon: "mdi-eraser", color: "#5C6BC0"},
        {name: "trash", icon: "mdi-trash-can", color: "#039BE5"},
        {name: "export", icon: "mdi-file-export", color: "#00ACC1"}
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
