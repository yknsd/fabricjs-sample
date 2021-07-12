<template>
  <v-container>
    <v-row class="text-center" align="center" justify="center">
      <v-col cols="12" class="mb-10">
        <h1 class="display-1">
          sample
        </h1>
        <h2 class="subtitle-1">
          blueimp-load-image
        </h2>
      </v-col>

      <ButtonToggle class="mb-5" />

      <router-view />
    </v-row>
  </v-container>
</template>

<script>
import ButtonToggle from "./ButtonToggle";

export default {
  components: {
    ButtonToggle
  }
}
</script>
