<template>
  <div style="max-height: 300px; width: 100%" class="py-3">
    <v-btn-toggle :value="selectedIndex" borderless background-color="rgba(1,1,1,0)" tile>
      <v-btn
        v-for="(filter, index) in filters"
        :key="index"
        @click="setFilter(index)"
        class="ma-1"
        width="80"
        height="80"
      >
        <p class="caption mb-0" style="font-size: 0.5rem">{{ filter.name }}</p>
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "FooterFilter",
  computed: {
    ...mapGetters({
      filters: "filters",
      selectedIndex: "selectedFilterIndex"
    })
  },
  methods: {
    ...mapMutations({
      setFilter: "SET_SELECTED_FILTER"
    })
  }
}
</script>

<style scoped>
>>> .v-btn-toggle {
  display: inherit;
}
</style>
