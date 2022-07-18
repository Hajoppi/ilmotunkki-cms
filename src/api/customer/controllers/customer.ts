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
  async update(ctx) {
    const {id} = ctx.request.params;
    const {data} = ctx.request.body;
    console.log(ctx, id);
    const result = await strapi.query('api::customer.customer').update({
      where: {
        uid: id,
      },
      data
    });
    return this.transformResponse(result);
  }
});
