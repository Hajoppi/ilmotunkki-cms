/**
 *  order controller
 */

import { factories } from '@strapi/strapi'

type ItemType = {
  price: number;
  availableFrom: string;
  availableTo: string;
  slug: string;
};

type Item = {
  itemType: ItemType;
}
type GiftCard = {
  code: string,
  itemType: ItemType,
}

const itemsWithGiftCards = (item: Item[], cards: GiftCard[]) => {

}

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
    //const items = itemsWithGiftCards(entity.items, giftcards);
    // entity.items = items;
    return this.transformResponse(entity);
  }
});
