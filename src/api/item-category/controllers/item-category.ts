/**
 *  item-category controller
 */

import { factories } from '@strapi/strapi'

type Data = {
  id: number;
  attributes: {
    [key: string]: string,
  }
}
export default factories.createCoreController('api::item-category.item-category', {
  async findOne(ctx) {
    console.log(ctx.params);
    console.log(ctx.query);
    const { data, meta } = await super.findOne(ctx);
    const totalCategoryItemCount = await strapi.query('api::item.item').count({
      where: {
        itemType: {
          itemCategory: {
            id: data.id
          }
        }
      },
    });
    data.attributes.currentQuantity = totalCategoryItemCount;
    return { data, meta };
  },
  async find(ctx) {
    const { data, meta } = await super.find(ctx);
    const mappedPromises = (data as Data[]).map(async (newData: Data) => {
      const totalCategoryItemCount = await strapi.query('api::item.item').count({
        where: {
          itemType: {
            itemCategory: {
              id: newData.id
            }
          }
        },
      });
      return {
        id: newData.id,
        attributes: {
          ...newData.attributes,
          currentQuantity: totalCategoryItemCount,
        }
      };
    });
    const mappedData = await Promise.all(mappedPromises);
    return { data: mappedData, meta };
  }
});
