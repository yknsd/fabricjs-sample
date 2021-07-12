<template>
  <v-col cols="10">
    <v-chip-group
      mandatory
      active-class="primary--text"
      center-active
    >
      <v-chip
        v-for="tag in tags"
        :key="tag.title"
        @click="goTo(tag.routeName)"
      >
        {{ tag.title }}
      </v-chip>
    </v-chip-group>
  </v-col>
</template>

<script>
export default {
  data() {
    return {
      tags: [
        {title: "01", routeName: "sample-01"},
        {title: "02", routeName: "sample-02"},
        {title: "03", routeName: "sample-03"},
      ]
    }
  },
  methods: {
    goTo(name) {
      this.$router.push({name: name});
    }
  }
}
</script>
