<template>
  <v-card
    v-if="canvasJson"
    class="card-class"
  >
    <v-card-title class="text-left">canvas.toJSON</v-card-title>
    <v-card-text class="text-left">
      {{ canvasJson }}
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters}from "vuex";

export default {
  computed: {
    ...mapGetters({
      canvasJson: "canvasJson"
    })
  },
}
</script>
