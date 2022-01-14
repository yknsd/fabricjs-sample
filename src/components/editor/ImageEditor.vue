<template>
  <v-card
    v-if="imgSrc"
    class="card-class"
  >
    <v-card-text class="text-center d-flex">
      <canvas
        id="img-pad"
        :width="canvasW"
        :height="canvasHeight"
      />
      <Footer
        class="func-toggle"
        :style="`left: ${canvasW - 50}px;top: 25px;`"
        @trim="trimImage"
        @filter="filterImage"
        @drawing="drawing"
        @erase="erase"
      />
      <FooterTrim v-if="selectedMenuIndex === 0" class="ma-auto sub-menu-div"/>
      <FooterFilter v-else-if="selectedMenuIndex===1" class="ma-auto sub-menu-div"/>
      <FooterText v-else-if="selectedMenuIndex===2" class="ma-auto sub-menu-div"/>
      <FooterDrawing v-else-if="selectedMenuIndex === 3" class="ma-auto sub-menu-div"/>
      <FooterErase v-else-if="selectedMenuIndex === 4" class="ma-auto sub-menu-div"/>
    </v-card-text>
  </v-card>
</template>

<script>
import {fabric} from "fabric";
import Footer from "./Footer";
import FooterText from "./FooterText";
import {mapGetters} from "vuex";
import FooterDrawing from "./FooterDrawing";
import FooterErase from "./FooterErase";
import FooterFilter from "./FooterFilter";
import FooterTrim from "./FooterTrim";

const MAX_WIDTH = 800;
const MAX_HEIGHT = 800;
const CANVAS_PADDING = 100;

export default {
  components: {
    FooterTrim,
    FooterFilter,
    FooterErase,
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
      imgObj: null,
      textBox: null
    };
  },
  computed: {
    ...mapGetters([
      "selectedMenuIndex",
      "selectedFontName",
      "colorRgba",
      "textSize",
      "textWeight",
      "underline",
      "lineThrough",
      "fontStyle",
      "drawingColor",
      "drawingWidth",
      "selectedFilterIndex",
      "filters"
    ]),
    canvasW() {
      return this.$props.canvasWidth < 400 ? 400 : this.$props.canvasWidth;
    },
    fabricImage() {
      return this.canvas.item(0);
    },
    fabricTrimRect() {
      return this.canvas.item(1);
    }
  },
  async mounted() {
    const canvas = new fabric.Canvas('img-pad');
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
            selectable: false,
            evented: false,
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
          const backGreyOut = new fabric.Rect({
            fill: 'rgb(110,108,108, 0.6)',
            stroke: 'transparent',
            // opacity: 1,
            width: width,
            height: height,
            originX: "center",
            originY: "center",
            selectable: false,
            dirty: true
          });
          backGreyOut.clipPath = new fabric.Rect({
            fill: 'transparent',
            stroke: 'rgba(232,40,207,0.7)',
            strokeWidth: 3,
            width: objImg.width * scale,
            height: objImg.height * scale,
            cornerStrokeColor: "rgba(1,1,1,0)",
            originX: "center",
            originY: "center",
            selectable: true,
            evented: true,
            inverted: true,
            dirty: true
          });
          // const group = new fabric.Group([ objImg, backGreyOut], {
          //   selectable: false,
          //   evented: false,
          // });
          canvas.add(objImg);
          canvas.centerObject(objImg);
          canvas.add(backGreyOut);
          canvas.centerObject(backGreyOut);
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
    }
  },
  watch: {
    selectedMenuIndex(newIndex, oldIndex) {
      console.log("selectedMenuIndex:", oldIndex, "->", newIndex);
      // this.canvas.sendToBack(image);
      // const rect = bkGreyRect.clipPath;
      switch (oldIndex) {
        case 0:
          // this.canvas.bringToFront(this.fabricTrimRect);
          this.fabricTrimRect.visible = false;
          break;
        case 2:
          this.canvas.discardActiveObject();
          break;
        case 3:
          this.$set(this.canvas, "isDrawingMode", false);
          break;
        default:
          break;
      }
      this.canvas.requestRenderAll();
    },
    selectedFontName(name) {
      const textBox = this.canvas.getActiveObject();
      if (textBox) {
        textBox.set("fontFamily", name);
        textBox.setCoords();
        this.canvas.requestRenderAll();
      }
    },
    colorRgba(val) {
      const textBox = this.canvas.getActiveObject();
      if (textBox) {
        textBox.set("fill", val);
        textBox.setCoords();
        this.canvas.requestRenderAll();
      }
    },
    textSize(size) {
      const textBox = this.canvas.getActiveObject();
      if (textBox) {
        textBox.set("fontSize", size);
        textBox.setCoords();
        this.canvas.requestRenderAll();
      }
    },
    textWeight(weight) {
      const textBox = this.canvas.getActiveObject();
      if (textBox) {
        textBox.set("fontWeight", weight);
        textBox.setCoords();
        this.canvas.requestRenderAll();
      }
    },
    underline(isShow) {
      const textBox = this.canvas.getActiveObject();
      if (textBox) {
        textBox.set("underline", isShow);
        textBox.setCoords();
        this.canvas.requestRenderAll();
      }
    },
    lineThrough(isShow) {
      const textBox = this.canvas.getActiveObject();
      if (textBox) {
        textBox.set("linethrough", isShow);
        textBox.setCoords();
        this.canvas.requestRenderAll();
      }
    },
    fontStyle(style) {
      const textBox = this.canvas.getActiveObject();
      if (textBox) {
        textBox.set("fontStyle", style);
        textBox.setCoords();
        this.canvas.requestRenderAll();
      }
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
    },
    drawingWeight(val) {
      if (this.canvas.freeDrawingBrush) {
        this.$set(this.canvas.freeDrawingBrush, "width", val);
        this.canvas.requestRenderAll();
      }
    },
    drawingColor(code) {
      if (this.canvas.freeDrawingBrush) {
        this.canvas.freeDrawingBrush.color = code;
      }
    }
  },
  methods: {
    /**
     * Mouse down
     */
    mouseDown(event) {
      console.log("mouse down:", event);
      console.log("before clipPath:", this.fabricTrimRect.clipPath);
      this.mouseDownX = event.pointer.x;
      this.mouseDownY = event.pointer.y;
      const activeObj = this.canvas.getActiveObject();
      console.log("activeObj:", activeObj);
      if (this.selectedMenuIndex === 2 && !activeObj) {
        this.addText();
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
      const pointer = event.pointer;
      if (this.selectedMenuIndex === 0) {
        this.fabricTrimRect.clipPath.set({
          width: Math.abs(this.mouseDownX - pointer.x),
          height: Math.abs(this.mouseDownY - pointer.y)
        });
        this.fabricTrimRect.clipPath.setCoords();
        this.canvas.requestRenderAll();
        console.log("after clipPath:", this.fabricTrimRect.clipPath);
      }
    },
    /**
     * Trim
     */
    trimImage() {
      console.log(">>>> trim image:");
      this.canvas.discardActiveObject();
      this.canvas.forEachObject(function (object) {
        object.selectable = false;
      });
      // let rect = undefined;
      const rect = this.fabricTrimRect;
      rect.visible = true;
      // if(group && !group.clipPath) {
      //   const image = group.item(0);
      //   rect = new fabric.Rect({
      //     fill: 'transparent',
      //     stroke: 'rgba(232,40,207,0.7)',
      //     strokeWidth: 3,
      //     opacity: 1,
      //     width: image.width * image.scaleX / 2,
      //     height: image.height * image.scaleX / 2,
      //     visible: true,
      //     cornerStrokeColor: "rgba(1,1,1,0)",
      //     originX: "center",
      //     originY: "center"
      //   });
      //   group.set({
      //     clipPath: rect
      //   });
      //   console.log("trim square:", rect);
      //   // this.canvas.setActiveObject(rect);
      //   // this.canvas.setActiveObject(rect);
      // } else {
      //   // const bkGreyOut = this.canvas.item(1);
      //   // bkGreyOut.visible = true;
      //   // this.canvas.setActiveObject(group.clipPath);
      // }
      this.canvas.requestRenderAll();
    },
    /**
     * Filter
     */
    filterImage() {},
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
          fill: this.colorRgba,
          fontFamily: this.selectedFontName,
          fontSize: this.textSize,
          fontWeight: this.textWeight,
          underline: this.underline,
          linethrough: this.lineThrough,
          width: 100,
          selectable: true,
          evented: true,
        });
      this.canvas.add(textBox);
      this.canvas.setActiveObject(textBox);
    },
    /**
     * Drawing
     */
    drawing() {
      console.log("drawing");
      this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
      this.canvas.freeDrawingBrush.color = this.drawingColor;
      this.canvas.freeDrawingBrush.width = this.drawingWidth;
      this.canvas.isDrawingMode = true;
    },
    /**
     * Erase
     */
    erase() {
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

.func-toggle {
  position : absolute;
}

.sub-menu-div {
  max-width        : 250px;
  max-height       : 280px;
  background-color : rgba(239, 239, 239, 0.7);
  border-radius    : 15px;
  padding          : 20px;
}

canvas {
  border : 1px solid;
}
</style>
