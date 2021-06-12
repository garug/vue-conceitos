import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import BuildingStock from "../views/BuildingStock.vue";
import Results from "../views/Results.vue";

const routes: Array<RouteRecordRaw> = [
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
