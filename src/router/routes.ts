import { RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AdminView from "../views/AdminView.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "题目",
    component: HomeView,
  },
  {
    path: "/Admin",
    name: "管理员可见",
    component: AdminView,
    meta: {
      access: "canAdmin",
    },
  },
  {
    path: "/about",
    name: "关于我的",
    component: () => import("../views/AboutView.vue"),
  },
];
