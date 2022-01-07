import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
export const fontItems = [
    "TimesNewRoman",
    "Comic Sans"
];

const store = new Vuex.Store({
    state: {
        menus: ["trim", "filter", "text", "drawing"],
        selectedMenuIndex: 0,
        canvasJson: {},
        fontName: fontItems[0],
        textSize: 20,
        textWeight: 200,
        underline: false,
        lineThrough: false,
        fontStyle: "normal",
        drawingColor: "#42A5F5",
        drawingWidth: 10
    },
    getters: {
        selectedMenuIndex(state){
            return state.selectedMenuIndex;
        },
        selectedMenu(state) {
            return state.menus[state.selectedMenuIndex];
        },
        canvasJson(state) {
            return state.canvasJson;
        },
        fontItems() {
            return fontItems;
        },
        selectedFontName(state) {
            return state.fontName;
        },
        textSize(state) {
            return state.textSize;
        },
        textWeight(state) {
            return state.textWeight;
        },
        underline(state) {
            return state.underline;
        },
        lineThrough(state) {
            return state.lineThrough;
        },
        fontStyle(state) {
            return state.fontStyle;
        },
        drawingColor(state) {
            return state.drawingColor;
        },
        drawingWidth(state) {
            return state.drawingWidth;
        }
    },
    mutations: {
        SET_SELECTED_MENU_INDEX(state, index){
            state.selectedMenuIndex = index;
        },
        SET_CANVAS_JSON(state, json) {
            json.objects = json.objects.map(function(value) {
                // eslint-disable-next-line no-prototype-builtins
                if(value.hasOwnProperty("src")){
                    value.src = "";
                }
                return value;
            });
            state.canvasJson = json;
        },
        SET_FONT_INDEX(state, index) {
            state.fontIndex = index;
        },
        SET_TEXT_SIZE(state, size) {
            state.textSize = size;
        },
        SET_TEXT_WEIGHT(state, weight) {
            state.textWeight = weight;
        },
        SET_UNDERLINE(state, isShow) {
            state.underline = isShow;
        },
        SET_LINE_THROUGH(state, isShow) {
            state.lineThrough = isShow;
        },
        SET_FONT_STYLE(state, style) {
            state.fontStyle = style;
        },
        SET_DRAWING_COLOR(state, code) {
            state.drawingColor = code;
        },
        SET_DRAWING_WIDTH(state, width) {
            state.drawingWidth = width;
        }
    },
    actions: {}
})

export default store