<template>
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
