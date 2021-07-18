<template>
  <v-card
    v-if="imgSrc"
    class="card-class"
  >
    <v-card-title class="text-left">Image</v-card-title>
    <v-card-text class="text-left">
      <canvas id="img-pad" width="500" height="500"></canvas>
      <Footer
        @trim="cutImage"
        @filter="filterImage"
        @text="addText"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import {fabric} from "fabric";
import Footer from "./Footer";

export default {
  components: {
    Footer
  },
  props: {
    imgSrc: {
      type: String
    }
  },
  data() {
    return {
      canvas: {
        type: Object
      }
    };
  },
  mounted() {
    const canvas = new fabric.Canvas('img-pad', {
      isDrawingMode: true,
      selectable: true
    });
    if (this.imgSrc) {
      fabric.Image.fromURL(this.imgSrc, function (objImg) {
        console.log("mounted: objImg, ", objImg);
        canvas.add(objImg);
      });
    }
    this.$set(this, "canvas", canvas);
  },
  methods: {
    cutImage() {
      const cutCanvas = this.canvas;
      fabric.Image.fromURL(this.imgSrc, function (objImg) {
        console.log("cut image", objImg);
        cutCanvas.add(objImg);
      });
      this.$set(this, "canvas", cutCanvas);
    },
    filterImage() {
      const filterCanvas = this.canvas;
      fabric.Image.fromURL(this.imgSrc, function (objImg) {
        console.log("filter image", objImg);
        objImg.filters.push(
          new fabric.Image.filters.Sepia(),
          new fabric.Image.filters.Brightness({brightness: 100})
        );
        objImg.applyFilters();
        filterCanvas.add(objImg);
      });
      this.$set(this, "canvas", filterCanvas);
    },
    addText() {
      const text = new fabric.Text("hello world",
        {
          left: 100,
          top: 100,
          fontSize: 40
        }
      );
      this.canvas.add(text);
    }
  }
}
</script>

<style scoped>
.card-class {
  width      : 100%;
  min-height : 400px;
}

canvas {
  border : 1px solid;
}
</style>
