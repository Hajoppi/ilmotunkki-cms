export default {
  routes: [
    {
      method: "GET",
      path: "/orders/findByUid/:uid",
      handler: "order.findByUid",
    }
  ],
};