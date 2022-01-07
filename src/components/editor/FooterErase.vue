<template>
  <div>
    <v-select
      v-model="width"
      :items="widthItems"
      :rules="[v => !!v || 'Item is required']"
      label="Width"
      required
      @change="setWidth"
    ></v-select>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "FooterErase",
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
