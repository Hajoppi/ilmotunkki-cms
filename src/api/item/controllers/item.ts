/**
 *  item controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::item.item',({strapi}) => ({
  async count(ctx) {
    const entries = await strapi.query('api::item.item').count({
      where: {
        $not: {
          itemType: {
            $or: [
              {name: 'Vieras'},
              {name: 'Guest'},
            ]
          }
        },
      }
    });
    ctx.body = entries;
  },
  async delete(ctx) {
    const {orderUid} = ctx.request.query;
    const order = await strapi.query('api::order.order').findOne({
      where: {
        uid: orderUid,
      }
    });
    if(!order) {
      return ctx.notFound('No order');
    }
    if(order.status === 'ok') {
      return ctx.badRequest('Order already done');
    }
    return await super.delete(ctx);
  },
  async create(ctx) {
    const {data: {itemType, order: orderUid}} = ctx.request.body;
    const order = await strapi.query('api::order.order').findOne({
      where: {
        uid: orderUid,
      }
    });
    if(!order) {
      return ctx.notFound('No order');
    }
    if(order.status === 'ok') {
      return ctx.badRequest('Order already done');
    }
    const orderId = order.id;
    const category = await strapi.query('api::item-category.item-category').findOne({
      where: {
        itemTypes: {
          id: itemType
        }
      },
      populate: {
        overflowItem: true,
      },
    });
    const totalCategoryItemCount = await strapi.query('api::item.item').count({
      where: {
        itemType: {
          itemCategory: {
            id: category.id
          }
        }
      },
    });
    const orderCategoryItemCount = await strapi.query('api::item.item').count({
      where: {
        order: {
          id: orderId
        },
        itemType: {
          itemCategory: {
            id: category.id
          }
        }
      }
    });
    if(orderCategoryItemCount + 1 > category.orderItemLimit) {
      return ctx.badRequest('Too many items in this order');
    }
    if(totalCategoryItemCount + 1 > category.maximumItemLimit) {
      if(!category.overflowItem) {
        return ctx.badRequest('Items have run out');
      }
      ctx.request.body.data.itemType = category.overflowItem.id;
    }
    const result = await strapi.query('api::item.item').create({
      data: {
        itemType,
        order: orderId,
      },
      populate: {
        itemType: {
          populate: {
            itemCategory: true,
          }
        }
      }
    });
    return this.transformResponse(result);
  }
}));
