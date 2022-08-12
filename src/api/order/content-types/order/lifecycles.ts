import Mail from 'nodemailer/lib/mailer';
import SMTPPool from 'nodemailer/lib/smtp-pool';
import {v4} from 'uuid';
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
type Field = {
  id: number,
  label: string
  type: string
  required: boolean,
  fieldName: string,
}

const fillTemplatePatterns = (text: string, form: Field[], data: Record<string,string>) => {
  form.forEach(field => {
    const regex = new RegExp(`{{${field.fieldName}}}`,'g')
    text = text.replace(regex,`${data[field.fieldName]}`)
  });
  return text;
}

type EmailService = {
  create: (options: Mail.Options) => Promise<SMTPPool.SentMessageInfo>;
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
    const [template, form] = await Promise.all([
      strapi.query('api::email.email').findOne({
        where: {
          type: 'confirmation',
          locale: customer.locale,
        }
      }),
      strapi.query('api::contact-form.contact-form').findOne({
        where: {
          locale: customer.locale,
        },
        populate: {
          contactForm: true
        }
      })
    ])
    const text = fillTemplatePatterns(template.text, form.contactForm, customer);

    const mailOptions: Mail.Options = {
      to: customer.email,
      from: 'm0@tietokilta.fi',
      subject: template.subject,
      text: text,
    }
    try {
      await strapi.service<EmailService>('api::email.email').create(mailOptions);
    } catch(error) {
      console.error(`Order id: ${order.id} had an issue sending the email`);
    }
  }
}