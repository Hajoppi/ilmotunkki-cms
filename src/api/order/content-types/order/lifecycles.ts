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
}


export default {
  beforeCreate(event: Event) {
    const { data } = event.params;
    data.status = 'new'
    console.log('here');
    data.uid = v4();
  },
}