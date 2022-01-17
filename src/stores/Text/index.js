export const fontFamilies = [
    "TimesNewRoman",
    "Comic Sans",
    "Delicious",
    "Hoefler Text",
];
export default {
    namespaced: true,
    state: {
        fontFamily: fontFamilies[0],
        colorCode: "#b8ea08",
        textSize: 20,
        textWeight: 200,
        underline: false,
        lineThrough: false,
        fontStyle: "normal",
        fontAlign: "center",
    },
    getters: {
        fontFamilyList() {
            return fontFamilies;
        },
        fontFamily(state) {
            return state.fontFamily;
        },
        colorCode(state) {
            return state.colorCode;
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
        fontAlign(state) {
            return state.fontAlign;
        },
    },
    mutations: {
        SET_FONT_FAMILY(state, name) {
            state.fontFamily = fontFamilies.includes(name) ? name : fontFamilies[0];
        },
        SET_COLOR_CODE(state, color) {
            state.colorCode = color;
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
        SET_FONT_ALIGN(state, align) {
            state.fontAlign = align;
        },
    },
    actions: {}
}
