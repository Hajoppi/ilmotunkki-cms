module.exports = async () => {
  const translationFi = await strapi.entityService.create('api::translation.translation', {
    data: {
      translations: [
        {
          "key": "next",
          "value": "Seuraava"
          },
          {
          "key": "send",
          "value": "Lähetä"
          },
          {
          "key": "back",
          "value": "takaisin"
          },
          {
          "key": "total",
          "value": "yhteensä"
          },
          {
          "key": "add",
          "value": "lisää"
          },
          {
          "key": "pay",
          "value": "Maksa"
          },
          {
          "key": "info",
          "value": "tiedot"
          },
          {
          "key": "products",
          "value": "Tuotteet"
          },
          {
          "key": "vieras",
          "value": "Vieras"
          },
          {
          "key": "kutsuvieras",
          "value": "Kutsuvieras"
          },
          {
          "key": "reserve",
          "value": "Varasija"
          },
          {
          "key": "sillis",
          "value": "Sillis"
          },
          {
          "key": "yes",
          "value": "kyllä"
          },
          {
          "key": "no",
          "value": "ei"
          },
          {
          "key": "haveRead",
          "value": "Olen lukenut"
          },
          {
          "key": "terms",
          "value": "käyttöehdot"
          },
          {
          "key": "soldOut",
          "value": "Loppuunmyyty"
          },
          {
          "key": "backToOrder",
          "value": "Takaisin tilaukseen"
          }
      ],
      locale: 'fi',
    }
  });
  const translationEn = await strapi.entityService.create('api::translation.translation', {
    data: {
      translations: [
          {
          "key": "next",
          "value": "Next"
          },
          {
          "key": "send",
          "value": "Send"
          },
          {
          "key": "back",
          "value": "Back"
          },
          {
          "key": "total",
          "value": "Sum"
          },
          {
          "key": "add",
          "value": "Add"
          },
          {
          "key": "pay",
          "value": "Pay"
          },
          {
          "key": "info",
          "value": "Info"
          },
          {
          "key": "products",
          "value": "Products"
          },
          {
          "key": "vieras",
          "value": "Guest"
          },
          {
          "key": "kutsuvieras",
          "value": "Invited Guest"
          },
          {
          "key": "reserve",
          "value": "Reserve"
          },
          {
          "key": "sillis",
          "value": "Sillis"
          },
          {
          "key": "yes",
          "value": "yes"
          },
          {
          "key": "no",
          "value": "no"
          },
          {
          "key": "haveRead",
          "value": "I have read"
          },
          {
          "key": "terms",
          "value": "terms and conditions"
          },
          {
          "key": "soldOut",
          "value": "Sold out"
          },
          {
          "key": "backToOrder",
          "value": "Back to order"
          }
      ],
      localizations: [translationFi.id],
      locale: "en",
    },
  });
  await strapi.query('api::email.email').update({
    where: {
      id: translationFi.id
    },
    data: {
      localizations: [translationEn.id],
    },
  });
  const callbackPageFi = await strapi.entityService.create('api::callback-page.callback-page',{
    data: {
      onSuccess: "Maksusi onnistui onneksi olkoon",
      onError: "Maksussasi tapahtui virhe",
      locale: "fi",
      onCancel: "Maksunne keskeytyi"
    }
  });
  const callbackPageEn = await strapi.entityService.create('api::callback-page.callback-page',{
    data: {
      onSuccess: "Your payment was successful",
      onError: "There was an error on your payment",
      locale: "en",
      onCancel: "Your payment was cancelled",
      localizations: [callbackPageFi.id],
    }
  });
  await strapi.query('api::callback-page.callback-page').update({
    where: {
      id: callbackPageFi.id
    },
    data: {
      localizations: [callbackPageEn.id],
    },
  });
}
