/**
 *  customer controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::customer.customer',{
  async create(ctx) {
    const {orders} = ctx.request.body.data;
    const result = await strapi.query('api::customer.customer').create({
      data: {
        firstName: '',
        orders,
      }
    });
    return this.transformResponse(result);
  },
});
