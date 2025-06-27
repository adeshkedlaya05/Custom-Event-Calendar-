import moment from "moment";
export function genrateReccuringEvents(baseEvent) {
    const events=[];
    const reccurance=baseEvent.reccurance;
    const count=baseEvent.reccuranceCount || 5;
    const startDate=moment(baseEvent.date);

    if(!reccurance) return [baseEvent];
    //reccurance for daily
    for(let i=0;i<count;i++){
        let newDate;
        if(reccurance ==='daily'){
            newDate=moment(startDate).add(i,'days');
            //reccurance for weekly
        }else if (reccurance === 'weekly') {
  for (let i = 0; i < count; i++) {
    const nextDate = moment(startDate).clone().add(i * 7, 'days');
    events.push({
      ...baseEvent,
      id: `${baseEvent.id}-${nextDate.format('YYYYMMDD')}`,
      date: nextDate.format('YYYY-MM-DD'),
    });
  }
  return events;
}//reccurance for monthly
else if(reccurance==='monthly'){
            newDate=moment(startDate).add(i,'months');
            //reccurance for custom
        }else if(reccurance==='custom'){
            const interval=parseInt(baseEvent.reccuranceInterval || '2',10);
            newDate=moment(startDate).add(i*interval,'days');
        }
        if(reccurance!=='weekly'){
            events.push({...baseEvent,id:`${baseEvent.id}-${newDate.format('YYYYMMDD')}`,date:newDate.format('YYYY-MM-DD')});
        }
    }
    return events;
}