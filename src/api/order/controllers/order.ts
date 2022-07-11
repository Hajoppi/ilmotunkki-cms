/**
 *  order controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::order.order', {
  async findByUid(ctx) {
    const {uid} = ctx.params;
    const entry = await strapi.query('api::order.order').findOne({
      where: {
        uid,
      }
    });
    if(!entry) return;
    const {id = null, ...attributes} = entry
    const result = {
      data: {
        id: id,
        attributes,
      }
    };
    ctx.body = result;
  }
});
