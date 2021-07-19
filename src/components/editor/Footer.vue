<template>
  <v-btn-toggle>
    <v-btn
      v-for="(value,index) in functions"
      :key="`function-${index}`"
      @click="goTo(value.name)"
    >
      <v-icon>{{ value.icon }}</v-icon>
    </v-btn>
  </v-btn-toggle>
</template>

<script>
export default {
  data() {
    return {
      functions: [
        {name: "trim", icon: "mdi-content-cut"},
        {name: "filter", icon: "mdi-image-filter-black-white"},
        {name: "text", icon: "mdi-format-text"},
        {name: "drawing", icon: "mdi-lead-pencil"},
        {name: "erase", icon: "mdi-eraser"}
      ]
    }
  },
  methods: {
    goTo(name) {
      this.$emit(name);
    }
  }
}
</script>
