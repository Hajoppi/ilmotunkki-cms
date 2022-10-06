export default {
  routes: [
    {
      method: "GET",
      path: "/orders/findByUid/:uid",
      handler: "order.findByUid",
    },
    {
      method: "GET",
      path: "/orders/findByCustomerUid/:uid",
      handler: "order.findByCustomerUid",
    },
    {
      method: "GET",
      path: "/orders/signups",
      handler: "order.signups",
    },
    {
      method: "GET",
      path: "/orders/validate/:token",
      handler: "order.validate",
    }
  ],
};