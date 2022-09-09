/**
 *  order controller
 */

import { factories } from '@strapi/strapi'
import customer from '../../customer/controllers/customer';

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
            },
            giftCard: true,
          }
        },
      }
    });
    return this.transformResponse(entity);
  },
  async findByCustomerUid(ctx) {
    const {uid} = ctx.params;
    const entity = await strapi.query('api::order.order').findMany({
      where: {
        customer: {
          uid
        },
      },
      populate: {
        items: {
          populate: {
            itemType: true,
            giftCard: true,
          }
        },
      }
    });
    return this.transformResponse(entity);
  },
  async signups(ctx) {
    const entries = await strapi.query('api::order.order').findMany({
      where: {
        customer: {
          accept: true
        },
        items:{
          itemType: {
            itemCategory: {
              name: 'normal'
            }
          }
        }
      },
      populate: {
        customer: true,
      },
    });
    const mappedEntries = entries.map(order => {
      return {
        id: order.customer.id,
        name: `${order.customer.firstName} ${order.customer.lastName}`,
        group: order.customer.group,
      }
    });
    return this.transformResponse(mappedEntries);
  }
});
