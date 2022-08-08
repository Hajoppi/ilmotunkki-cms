import Mail from 'nodemailer/lib/mailer';
import {v4} from 'uuid';
import { ApiCustomerCustomer, ApiEmailTemplateEmailTemplate, ApiOrderOrder } from '../../../../../schemas';
type Event = {
  model: any,
  params: {
    data: any
    select: any
    where: any
    orderBy: any
    limit: any
    offset: any
    populate: any
  }
  result: any,
}


export default {
  beforeCreate(event: Event) {
    const { data } = event.params;
    data.status = 'new'
    data.uid = v4();
  },
  async afterUpdate(event: Event) {
    const order = event.result;
    if(order.status !== 'ok') return;
    const customer = await strapi.query('api::customer.customer').findOne({
      where: {
        orders: {
          id: order.id,
        }
      }
    });
    const template = await strapi.query('api::email.email').findOne({
      where: {
        type: 'confirmation',
        locale: customer.locale,
      }
    });
    const mailOptions: Mail.Options = {
      to: customer.email,
      from: 'm0@tietokilta.fi',
      subject: template.subject,
      text: template.text,
    }
    strapi.service<{create: (options: Mail.Options) => void}>('api::email.email').create(mailOptions);
  }
}