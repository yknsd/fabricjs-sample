<template>
  <v-chip-group
    mandatory
    active-class="primary--text"
    center-active
  >
    <v-chip
      v-for="(value,index) in functions"
      :key="`function-${index}`"
      @click="goTo(value.name)"
    >
      <v-icon>{{ value.icon }}</v-icon>
    </v-chip>
  </v-chip-group>
</template>

<script>
export default {
  data() {
    return {
      functions: [
        {name: "trim", icon: "mdi-content-cut"},
        {name: "filter", icon: "mdi-image-filter-black-white"},
        {name: "text", icon: "mdi-format-text"},
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
