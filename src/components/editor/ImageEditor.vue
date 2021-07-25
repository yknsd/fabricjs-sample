<template>
  <v-card
    v-if="imgSrc"
    class="card-class"
  >
    <v-card-title class="text-left">Image</v-card-title>
    <v-card-text class="text-left">
      <canvas
        id="img-pad"
        @mousedown="mouseDown"
        @mousemove="mouseMove"
        @mouseup="mouseUp"
        :width="canvasWidth"
        :height="canvasHeight"
      />
      <Footer
        @trim="trimImage"
        @filter="filterImage"
        @text="addText"
        @drawing="drawing"
        @erase="erase"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import {fabric} from "fabric";
import Footer from "./Footer";
import { mapGetters } from "vuex";

const MAX_WIDTH = 800;
const MAX_HEIGHT = 800;

export default {
  components: {
    Footer
  },
  props: {
    imgSrc: {
      type: String
    },
    canvasWidth: {
      type: Number,
      default: MAX_WIDTH
    },
    canvasHeight: {
      type: Number,
      default: MAX_HEIGHT
    }
  },
  data() {
    return {
      canvas: {
        type: Object
      },
      trimSquare: null,
      imgObj: null,
    };
  },
  computed: {
    ...mapGetters([
      "selectedMenuIndex"
    ])
  },
  watch: {
    selectedMenuIndex(newIndex){
      console.log("selectedMenuIndex");
      if(newIndex !== 3){
        this.$set(this.canvas, "isDrawingMode", false);
      }
      this.canvas.sendToBack(this.imgObj);
      const json = this.canvas.toJSON();
      console.log("canvas.toJSON:",json);
      this.$store.commit("SET_CANVAS_JSON", json);
    }
  },
  mounted() {
    const canvas = new fabric.Canvas('img-pad');
    const width = this.canvasWidth;
    const height = this.canvasHeight;
    let img;
    if (this.imgSrc) {
      fabric.Image.fromURL(this.imgSrc, function (objImg) {
        console.log("mounted: objImg, ", objImg);
        objImg.set({
          cornerStrokeColor: "rgb(110,110,125)",
          scaleX: width / MAX_WIDTH,
          scaleY: height / MAX_HEIGHT,
          selectable: true
        });
        objImg.setControlsVisibility({
          mt: false,
          mb: false,
          ml: false,
          mr: false
        });
        img = objImg;
        // canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        canvas.add(objImg);
        canvas.setActiveObject(objImg);
      });
      this.imgObj = img;
      console.log("imgObj:", this.imgObj);
    }
    this.$set(this, "canvas", canvas);
    console.log("canvas:", this.canvas);
  },
  methods: {
    /**
     * Mouse down
     */
    mouseDown(event) {
      console.log("mouse down:", event);
      if (this.selectedMenuIndex === 0) {
        this.trimSquare.left = event.e.pageX;
        this.trimSquare.top = event.e.pageY;
        this.trimSquare.visible = true;
        this.canvas.bringToFront(this.trimSquare);
      }
    },
    /**
     * Mouse move
     */
    mouseMove(event) {
      console.log("mouse move", event);
    },
    /**
     * Mouse up
     */
    mouseUp(event) {
      console.log("mouse up:", event);
      if (this.selectedMenuIndex === 0) {
        let left = this.trimSquare.left - this.imgObj.left * (1/0.25);
        let top = this.trimSquare.top - this.imgObj.top * (1/0.25);
        let width = this.trimSquare.width * 1/0.25;
        let height = this.trimSquare.height * 1/0.25;

        this.imgObj.clipTo = function (ctx) {
          ctx.rect(left, top, width, height);
        };
        this.trimSquare.visible = false;
        this.canvas.renderAll();
      }
    },
    /**
     * Trim
     */
    trimImage() {
      console.log("trim image:");
      this.$store.commit("SET_SELECTED_MENU_INDEX", 0);
      let rect = new fabric.Rect({
        fill: 'transparent',
        originX: 'left',
        originY: 'top',
        stroke: '#ccc',
        strokeDashArray: [2, 2],
        opacity: 1,
        width: 1,
        height: 1
      });
      rect.visible = false;
      console.log("trim square:", rect);
      // this.canvas.setActiveObject(rect);
      this.canvas.discardActiveObject();
      this.canvas.renderAll();
      this.canvas.forEachObject(function(object){
        object.selectable = false;
      });
      this.canvas.add(rect);
    },
    /**
     * Filter
     */
    filterImage() {
      this.$store.commit("SET_SELECTED_MENU_INDEX", 1);
      let obj = this.canvas.getActiveObject();
      if (obj && obj.filters) {
        obj.filters.push(
          new fabric.Image.filters.Sepia()
        );
        obj.applyFilters();
        this.canvas.renderAll();
      }
    },
    /**
     * Add text
     */
    addText() {
      this.$store.commit("SET_SELECTED_MENU_INDEX", 2);
      const itext = new fabric.IText("hello world",
        {
          left: 100,
          top: 100,
          fontSize: 28,
          textAlign: 'center',
          charSpacing: 50,
          fill: '#26C6DA',
          strokeWidth: 2,
          stroke: "#1DE9B6"
        }
      );
      const textBox = new fabric.Textbox("Thi is a TextBox object",
        {
          left: 100,
          top: 100,
          fontSize: 28,
          textAlign: 'center',
          charSpacing: 50,
          fill: '#C6FF00',
          strokeWidth: 2,
          stroke: "#FFCA28"
      });
      this.canvas.add(itext, textBox);
      this.canvas.setActiveObject(itext);
      console.log("canvas:", this.canvas);
    },
    /**
     * Drawing
     */
    drawing() {
      this.$store.commit("SET_SELECTED_MENU_INDEX", 3);
      console.log("drawing");
      this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
      this.canvas.freeDrawingBrush.color = "#42A5F5";
      this.canvas.freeDrawingBrush.width = 10;
      this.canvas.isDrawingMode = true;
    },
    /**
     * Erase
     */
    erase(){
      console.log("erase");
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
