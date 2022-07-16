/**
 *  order controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::order.order', {
  async findByUid(ctx) {
    const {uid} = ctx.params;
    const entity = await strapi.query('api::order.order').findOne({
      where: {
        uid,
      },
      populate: {
        customer: true,
        items: {
          populate: {
            itemType: {
              populate: {
                itemCategory: true,
              }
            }
          }
        },
      }
    });
    return this.transformResponse(entity);
  }
});
