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
        {title: "Crop", routeName: "sample-01"},
        {title: "Rotate", routeName: "sample-02"},
        {title: "Show meta-data", routeName: "sample-03"}
      ]
    }
  },
  methods: {
    goTo(name) {
      if (this.$route.name !== name) {
        this.$router.push({name: name});
      }
    }
  }
}
</script>
