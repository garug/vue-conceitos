import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import BuildingStock from "../views/BuildingStock.vue";
import Results from "../views/Results.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/building-stock",
    name: "Building Stock",
    component: BuildingStock,
  },
  {
    path: "/forecast",
    name: "Results",
    component: Results,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
