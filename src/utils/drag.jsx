import interact from "interactjs";
import moment from "moment";
export function enableDrag(setEvents,events,CurrentMonth) {
    interact('.draggable-event').unset();
    interact('.draggable-event').draggable({
        inertia:true,
        autoScroll:true,
        listeners:{
            move(event){
                const target=event.target;
                const x=(parseFloat(target.getAttribute('data-x')) || 0)+event.dx;
                const y=(parseFloat(target.getAttribute('data-y')) || 0)+event.dy;

                target.style.transform=`translate(${x}px,${y}px)`;
                target.setAttribute('data-x',x);
                target.setAttribute('data-y',y);
            },
            end (event){
                const target=event.target;
                const droptarget=document.elementFromPoint(event.clientX,event.clientY);
                const dropcell=droptarget?.closest('[data-date]');
                if(!dropcell) return;

                const newDate=dropcell.getAttribute('data-date');
                const eventId=target.getAttribute('data-id');
                const originalEvent=events.find(e=>e.id.toString()===eventId);
                if(!originalEvent) return;

                if(!moment(newDate).isSame(moment(originalEvent.date),'day')){
                    const isSameMonth=moment(newDate).isSame(CurrentMonth,'month');
                    if(isSameMonth){
                        const updatedEvents=events.map(e=>
                            e.id===originalEvent.id?{ ...e,date:newDate} : e
                        );
                        setEvents(updatedEvents);
                    }
                }
                target.style.transform='translate(0px,0px)';
                target.removeAttribute('data-x');
               target.removeAttribute('data-y');
            }
        }
    });
}