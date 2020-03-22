import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue"
import Users from "../views/Users.vue"
import Goods from "../views/Goods.vue"
import Params from "../views/Params.vue"
import Categories from "../views/Categories.vue"
import Roles from "../views/Roles.vue"
import Rights from "../views/Rights.vue"
import AddGoods from "../views/AddGoods.vue"
import Orders from "../views/Orders.vue"
import Reports from "../views/Reports.vue"

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/users",
        name: "Users",
        component: Users,
      },
      {
        path: "/goods",
        name: "Goods",
        component: Goods,
      },
      {
        path: "/params",
        name: "Params",
        component: Params,
      },
      {
        path: "/categories",
        name: "Categories",
        component: Categories,
      },
      {
        path: "/roles",
        name: "Roles",
        component: Roles,
      },
      {
        path: "/rights",
        name: "Rights",
        component: Rights,
      },
      {
        path: "/add/goods",
        name: "AddGoods",
        component: AddGoods,
      },
      {
        path: "/orders",
        name: "Orders",
        component: Orders,
      },
      {
        path: "/reports",
        name: "Reports",
        component: Reports,
      },
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    if (!sessionStorage.getItem('token')) {
      next('/login')
    }
    next()
  }
}) 

export default router;
