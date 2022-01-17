import Vue from 'vue';
import Vuex from 'vuex';
import wText from "./Text";
import wFilter from "./Filter";

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        wText,
        wFilter,
    },
    state: {
        filename: "",
        menus: ["filter", "text", "drawing", "trash", "export"],
        selectedMenuIndex: 0,
        drawingColor: "#42A5F5",
        drawingWidth: 10,
    },
    getters: {
        filename(state) {
            return state.filename;
        },
        selectedMenuIndex(state){
            return state.selectedMenuIndex;
        },
        drawingColor(state) {
            return state.drawingColor;
        },
        drawingWidth(state) {
            return state.drawingWidth;
        },
    },
    mutations: {
        SET_FILENAME(state, name) {
            state.filename = name;
        },
        SET_SELECTED_MENU_INDEX(state, index){
            state.selectedMenuIndex = index;
        },
        SET_DRAWING_COLOR(state, code) {
            state.drawingColor = code;
        },
        SET_DRAWING_WIDTH(state, width) {
            state.drawingWidth = width;
        },
    },
    actions: {}
})

export default store
