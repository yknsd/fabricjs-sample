<template>
  <v-container>
    <v-row class="text-center" align="center" justify="center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col cols="12" class="mb-10">
        <h1 class="display-1">
          blueimp-sample
        </h1>
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
