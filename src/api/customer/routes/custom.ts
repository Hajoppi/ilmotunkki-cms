export default {
  routes: [
    {
      method: "GET",
      path: "/customers/findByOrderUid/:uid",
      handler: "customer.findByOrderUid",
    }
  ],
};