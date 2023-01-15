import type { Strapi } from "@strapi/strapi";

const cleanExpiredOrders = async () => {
  const timedLife15 = new Date();
  const timedLife30 = new Date();
  timedLife15.setMinutes(timedLife15.getMinutes() - 30);
  timedLife30.setMinutes(timedLife30.getMinutes() - 60);
  const [newOrders, pendingOrders] = await Promise.all([
    strapi.query('api::order.order').deleteMany({
      where: {
        status: 'new',
        createdAt: {
          $lt: timedLife15
        }
      }
    }),
    strapi.query('api::order.order').deleteMany({
      where: {
        $or: [
          {
            status: 'new'
          },
          {
            status: 'fail'
          },
          {
            status: 'pending'
          },
        ],
        updatedAt: {
          $lt: timedLife30
        }
      }
    }),
  ]);
  return [newOrders, pendingOrders];
}

const cleanOrphanItems = async () => {
  const orphanItems = await strapi.query('api::item.item').findMany({
    where: {
      order: null,
    },
  });
  if(orphanItems.length === 0) return {count: 0};
  const itemResult = await strapi.query('api::item.item').deleteMany({
    where: {
      id: {
        $in: orphanItems.map((item: {id: number}) => item.id)
      }
    }
  });
  return itemResult;
};

const cleanOrphanCustomers = async () => {
  const orphanCustomers = await strapi.query('api::customer.customer').findMany({
    where: {
      orders: {
        id: {
          $null: true
        }
      },
    }
  });
  if(orphanCustomers.length === 0) return {count: 0};
  const customerResult = await strapi.query('api::customer.customer').deleteMany({
    where: {
      id: {
        $in: orphanCustomers.map((item: {id: number}) => item.id)
      }
    }
  });
  return customerResult;
}
export default {
  '*/1 * * * *': async({ strapi}: {strapi: Strapi}) => {
    const [newOrders, pendingOrders] = await cleanExpiredOrders();
    const [customerResult, itemResult] = await Promise.all([
      cleanOrphanCustomers(),
      cleanOrphanItems(),
    ]);
    strapi.log.info(`[CRON] Removed ${newOrders.count} new orders`);
    strapi.log.info(`[CRON] Removed ${pendingOrders.count} pending orders`);
    strapi.log.info(`[CRON] Removed ${itemResult.count} orderless items`);
    strapi.log.info(`[CRON] Removed ${customerResult.count} orderless customers`);
  },
}