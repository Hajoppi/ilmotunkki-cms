/**
 * contact-form controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::contact-form.contact-form',{
  async find(ctx) {
    const {data, meta} = super.find(ctx);
    return {data, meta};
  }
});
