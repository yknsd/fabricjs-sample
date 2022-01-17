<template>
  <v-card
    v-if="imgSrc"
    class="card-class"
  >
    <v-card-text class="text-center d-flex">
      <canvas
        id="canvasEl"
        :width="canvasW"
        :height="canvasHeight"
      />
      <Footer
        class="func-toggle"
        :style="`left: ${canvasW - 50}px;top: 25px;`"
        @drawing="drawing"
        @trash="trash"
      />
      <!--      <FooterTrim v-if="selectedMenuIndex === 0" class="ma-auto sub-menu-div pa-1"/>-->
      <FooterFilter v-if="selectedMenuIndex===0" class="ma-auto sub-menu-div pa-1"/>
      <FooterText v-else-if="selectedMenuIndex===1" class="ma-auto sub-menu-div pa-1"/>
      <FooterDrawing v-else-if="selectedMenuIndex === 2" class="ma-auto sub-menu-div pa-1"/>
      <!--      <FooterErase v-else-if="selectedMenuIndex === 4" class="ma-auto sub-menu-div pa-1"/>-->
      <FooterExport v-else-if="selectedMenuIndex === 4" class="ma-auto sub-menu-div pa-1"/>
    </v-card-text>
  </v-card>
</template>

<script>
import {fabric} from "fabric";
import Footer from "./Footer";
import FooterText from "./FooterText";
import {mapGetters} from "vuex";
import FooterDrawing from "./FooterDrawing";
// import FooterErase from "./FooterErase";
import FooterFilter from "./FooterFilter";
import FooterExport from "./FooterExport";
// import FooterTrim from "./FooterTrim";

const MAX_WIDTH = 800;
const MAX_HEIGHT = 800;
const CANVAS_PADDING = 100;

export default {
  components: {
    FooterExport,
    FooterFilter,
    Footer,
    FooterText,
    FooterDrawing
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
      mouseDownX: 0,
      mouseDownY: 0,
      imgObj: undefined,
      textBox: undefined
    };
  },
  computed: {
    ...mapGetters({
      selectedMenuIndex: "selectedMenuIndex",
      fontFamily: "wText/fontFamily",
      colorCode: "wText/colorCode",
      textSize: "wText/textSize",
      textWeight: "wText/textWeight",
      underline: "wText/underline",
      lineThrough: "wText/lineThrough",
      fontStyle: "wText/fontStyle",
      fontAlign: "wText/fontAlign",
      drawingColor: "drawingColor",
      drawingWidth: "drawingWidth",
      selectedFilterIndex: "selectedFilterIndex",
      filters: "filters"
    }),
    canvasW() {
      return this.$props.canvasWidth < 400 ? 400 : this.$props.canvasWidth;
    },
    fabricImage() {
      return this.canvas.item(0);
    }
  },
  async mounted() {
    const canvas = new fabric.Canvas('canvasEl');
    const canvasEl = document.getElementById("canvasEl");
    canvasEl.fabric = canvas;
    const width = this.canvasW;
    const height = this.$props.canvasHeight;
    if (this.imgSrc) {
      await new Promise(resolve => {
        fabric.Image.fromURL(this.imgSrc, function (objImg) {
          console.log("mounted: objImg, ", objImg);
          const scale = width < height ? height / (MAX_HEIGHT + CANVAS_PADDING) : width / (MAX_WIDTH + CANVAS_PADDING);
          objImg.set({
            cornerStrokeColor: "rgb(110,110,125)",
            scaleX: scale,
            scaleY: scale,
            selectable: true,
            evented: true,
            originX: "center",
            originY: "center"
          });
          objImg.setControlsVisibility({
            mt: false,
            mb: false,
            ml: false,
            mr: false,
            mtr: false
          });
          // const backGreyOut = new fabric.Rect({
          //   fill: 'rgb(110,108,108, 0.6)',
          //   stroke: 'transparent',
          //   // opacity: 1,
          //   width: width,
          //   height: height,
          //   originX: "center",
          //   originY: "center",
          //   selectable: false,
          //   dirty: true
          // });
          // backGreyOut.clipPath = new fabric.Rect({
          //   fill: 'transparent',
          //   stroke: 'rgba(232,40,207,0.7)',
          //   strokeWidth: 3,
          //   width: objImg.width * scale,
          //   height: objImg.height * scale,
          //   cornerStrokeColor: "rgba(1,1,1,0)",
          //   originX: "center",
          //   originY: "center",
          //   selectable: true,
          //   evented: true,
          //   inverted: true,
          //   // dirty: true
          // });
          // const group = new fabric.Group([ objImg, backGreyOut], {
          //   selectable: false,
          //   evented: false,
          // });
          canvas.add(objImg);
          canvas.centerObject(objImg);
          // canvas.add(backGreyOut);
          // canvas.centerObject(backGreyOut);
          canvas.renderAll();
          resolve();
        });
      });
    }
    canvas.on("mouse:down", this.mouseDown);
    canvas.on("mouse:up", this.mouseUp);
    this.$set(this, "canvas", canvas);
    console.log("canvas:", this.canvas);
  },
  beforeDestroy() {
    console.log("BeforeDestroy:", this.canvas);
    if (this.canvas) {
      this.canvas.off("mouse:down", this.mouseDown);
      this.canvas.off("mouse:up", this.mouseUp);
      this.canvas.dispose();
    }
  },
  watch: {
    selectedMenuIndex(newIndex, oldIndex) {
      console.log("selectedMenuIndex:", oldIndex, "->", newIndex);
      switch (oldIndex) {
        case 1:
          this.canvas.discardActiveObject();
          break;
        case 2:
          this.$set(this.canvas, "isDrawingMode", false);
          break;
        default:
          break;
      }
      this.canvas.requestRenderAll();
    },
    selectedFilterIndex(newInd) {
      console.log("watch.selectedFilterIndex:", newInd);
      const img = this.fabricImage;
      if (img && 0 < img.filters.length) {
        img.filters.pop();
      }
      if (newInd !== 0) {
        const filter = this.filters[newInd].func();
        console.log("filter:", filter);
        img.filters.push(filter);
        // eval(`new fabric.Image.filters.${filter.name}()`)
      }
      img.applyFilters();
      this.canvas.requestRenderAll();
    }
  },
  methods: {
    /**
     * Mouse down
     */
    mouseDown(event) {
      console.log("mouse down:", event);
      this.mouseDownX = event.pointer.x;
      this.mouseDownY = event.pointer.y;
      const activeObj = this.canvas.getActiveObject();
      console.log("activeObj:", activeObj);
      console.log("menuIndex:", this.selectedMenuIndex);
      if (this.selectedMenuIndex === 1) {
        console.log("textBox:", this.textBox);
        if (this.textBox) {
          console.log("Exit Edit Mode");
            this.textBox.exitEditing();
            this.$set(this, "textBox", undefined);
        } else if (!activeObj) {
          console.log("Click and Add Textbox!");
          this.addText();
        }
        // else if (activeObj.text !== "") {
        //   console.log("Focus out Textbox");
        //   this.canvas.discardActiveObject();
        // }
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
      console.log("menuIndex:", this.selectedMenuIndex);
      // const pointer = event.pointer;
      // if (this.selectedMenuIndex === 0) {
      //   this.fabricTrimRect.clipPath.set({
      //     width: Math.abs(this.mouseDownX - pointer.x),
      //     height: Math.abs(this.mouseDownY - pointer.y)
      //   });
      //   this.fabricTrimRect.clipPath.setCoords();
      //   this.canvas.requestRenderAll();
      //   console.log("after clipPath:", this.fabricTrimRect.clipPath);
      // }
    },
    /**
     * Add text
     */
    addText() {
      const textBox = new fabric.Textbox("",
        {
          left: this.mouseDownX,
          top: this.mouseDownY,
          editable: true,
          textAlign: 'center',
          charSpacing: 50,
          fill: this.colorCode,
          fontFamily: this.fontFamily,
          fontSize: this.textSize,
          fontWeight: this.textWeight,
          underline: this.underline,
          linethrough: this.lineThrough,
          width: 100,
          selectable: true,
          evented: true
        });
      this.canvas.add(textBox);
      this.canvas.setActiveObject(textBox);
      textBox.enterEditing();
      console.log("hiddenTextarea:",textBox.hiddenTextarea);
      textBox.hiddenTextarea.focus();
      textBox.setControlsVisibility({
        mb: false,
        ml: false,
        mr: false,
        mt: false
      });
      this.$set(this, "textBox", textBox);
      // textBox.onKeyDown();
    },
    /**
     * Drawing
     */
    drawing() {
      this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
      this.$set(this.canvas.freeDrawingBrush, "color", this.drawingColor);
      this.$set(this.canvas.freeDrawingBrush, "width", this.drawingWidth);
      this.canvas.isDrawingMode = true;
    },
    trash() {
      const obj = this.canvas.getActiveObject();
      console.log("active object:", obj);
      console.log("size:", this.canvas.size());
      if (obj && 1 < this.canvas.size()) {
        this.canvas.remove(obj);
      }
    },
    exportCanvas() {
      console.log("export canvas");

    }
  }
}
</script>

<style scoped>
.card-class {
  width      : 100%;
  min-height : 400px;
}

.func-toggle {
  position : absolute;
}

.sub-menu-div {
  max-width        : 250px;
  max-height       : 280px;
  background-color : rgba(239, 239, 239, 0.7);
  border-radius    : 15px;
  /*padding          : 20px;*/
}

canvas {
  border : 1px solid;
}
</style>
