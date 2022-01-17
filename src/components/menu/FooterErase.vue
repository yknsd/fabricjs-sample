<template>
  <div style="width: 100%">
    <v-select
      :value="drawingWidth"
      :items="widthItems"
      :rules="[v => !!v || 'Item is required']"
      label="Width"
      required
      dense
      @change="setWidth"
      class="body-2 px-4"
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
      // color: "#42A5F5",
      // width: 10,
      widthItems: [ "2", "5", "10", "20", "50"]
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
