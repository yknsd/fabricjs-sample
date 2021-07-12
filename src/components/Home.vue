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

      <v-col cols="10">
        <v-file-input
          show-size
          counter
          multiple
          label="File input"
          accept="image/png, image/jpeg"
          :rules="rules"
        ></v-file-input>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data(){
    return {
      rules: [
        value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
      ]
    };
  }
}
</script>
