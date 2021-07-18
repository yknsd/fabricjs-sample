import Vue from 'vue';
import VueRouter from 'vue-router';
import Sample01 from "../components/Sample01";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: "sample-01",
    component: Sample01
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return {x: 0, y: 0}
  }
})

export default router
