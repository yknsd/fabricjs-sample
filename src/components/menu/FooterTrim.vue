<template>
  <div style="width: 100%">
    <v-select
      v-model="width"
      :items="widthItems"
      :rules="[v => !!v || 'Item is required']"
      label="Width"
      required
      @change="setWidth"
      class="body-2 px-4"
    ></v-select>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "FooterTrim",
  components: {},
  data() {
    return {
      color: "#42A5F5",
      width: 10,
      widthItems: [ "10", "20", "30", "40", "50"]
    }
  },
  computed: {
    ...mapGetters({
      drawingColor: "drawingColor",
      drawingWidth: "drawingWidth"
    })
  },
  methods: {
    setWidth(val) {
      this.$store.commit("SET_DRAWING_WIDTH", val);
    }
  }
}
</script>
