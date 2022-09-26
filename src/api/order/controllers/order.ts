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
    const mappedEntries = entries.map((order: any, index: number) => {
      const { accept } = order.customer
      return {
        id: order.customer.id,
        status: order.status,
        index,
        name: accept ? `${order.customer.firstName} ${order.customer.lastName}` : '-',
        group: accept ? order.customer.group : '-',
      }
    });
    return this.transformResponse(mappedEntries);
  }
});
