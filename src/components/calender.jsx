import React,{useEffect, useState} from 'react';
import moment from 'moment';
import EventForm from './Eventform';

const MonthlyView=()=>{
    const[CurrentMonth,SetCurrentMonth]=useState(moment());
    const [events,setEvents]=useState(()=>{
        const saved=localStorage.getItem('calenderEvents');
        return saved?JSON.parse(saved):[];
    });
    const[selectedDate,setSelectedDate]=useState(null);
    const[showForm,setShowForm]=useState(false);
    const [showConflictDialog,setShowConflictDialog]=useState(false);
    useEffect(()=>{
        localStorage.setItem('calenderEvents',JSON.stringify(events));
    },[events]);
    const Start=CurrentMonth.clone().startOf('month');
    const Calenderstart=Start.clone().startOf('week');  
    const days=[];
    let day=Calenderstart.clone();

    for(let i=0;i<42;i++){
        days.push(day.clone());
        day.add(1,'day');
    }

    const weeks=[];
    for(let i=0;i<days.length;i+=7){
        weeks.push(days.slice(i,i+7));
    }
    const Today=(date)=>moment().isSame(date,'day');
     const handleSaveEvent = (event)=>  {
        console.log("Saving event with category:", event.category);
                const conflict =events.find(
                    (e)=> e.date === event.date && e.time=== event.time);
                    if (conflict){
                        setShowConflictDialog(true);
                        return;
                    }
                    setEvents([...events,event]

                    ); 
            }
        const getCategoryColor =(category='')=>{
            console.log("Getting color for:", category);
            switch(category?.toLowerCase().trim()){
                case 'personal':return 'danger';
                case 'work':return 'primary';
                case 'health': return 'success';
                

                 default:return 'danger';
            }
        }
            
    return(
        <div className="container-fluid mt-4" style={{maxWidth:'95%',width:'100vw'}}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button 
                className="btn btn-outline-primary"
                onClick={()=>SetCurrentMonth(CurrentMonth.clone().subtract(1,'month'))}
                >
                <i className="bi bi-arrow-left-circle"></i>
                </button>
                <h3 className="mb-0">{CurrentMonth.format('MMMM YYYY')}</h3>
                <button 
                className="btn btn-outline-primary"
                onClick={()=>SetCurrentMonth(CurrentMonth.clone().add(1,'month'))}
                >
                <i className="bi bi-arrow-right-circle"></i>
                </button>
            </div>
            <div className="row text-center fw-bold  pb-2">
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day,i)=>(
                    <div className="col border border-dark bg-light py-2 " style={{flex:1}}
                    key={i}
                    >
                        {day}
                    </div>
                ))}
            </div>
          
                {weeks.map((week,i)=>(
                <div className="row text-center py-2" key={i}>
                    {week.map((date)=>{
                        const isCurrentMonth=date.month()===CurrentMonth.month();
                        return(
                            <div
                                key={date.format('YYYY-MM-DD')} 
                                onDoubleClick={()=>{
                                    setSelectedDate(date);
                                    setShowForm(true);
                                }}
                                className="col border border-dark p-2 d-flex flex-column align-items-start justify-content-start position-relative"
                                style={{minHeight:'100px',padding:'6px',flex:1}}
                                >

                                    {isCurrentMonth? (<span
                                        className={` px-2 py-1 rounded ${Today(date)? 'bg-warning text-white fw-bold':isCurrentMonth? 'text-dark':'text-muted'}`}
                                            style={{border:'none',boxShadow:'none' }}
                                        >
                                            {date.date()}
                                        </span>
                                    ) : ('')}
                                    <div className="w-100 mt-2 overflow-auto" style={{maxHeight:'60px'}}>
                                        {events
                                        .filter((event)=>event.date===date.format('YYYY-MM-DD'))
                                        .map((event)=>(
                                            <div
                                                key={event.id}
                                                className={`small d-flex justify-content-between align-items-center mb-1 px-1 py-1 rounded text-white bg-${getCategoryColor(event.category)}`}
                                                >
                                            <span className="text-truncate" style={{maxWidth:'75%'}}>
                                                {event.title}
                                            </span>
                                            <span>
                                                <i className="bi bi-pencil me-1" style={{cursor:'pointer'}}></i>
                                                <i className="bi bi-trash me-1" style={{cursor:'pointer'}}></i>
                                            </span>
                                            </div>
                                        ))}
                                        </div>
                                    </div>
                        );
                    })}
              </div>
            ))}
            {showForm && selectedDate && (
            <div 
                className="position-absolute bg-white border rounded shadow p-3"
                style={{top:'100px',left:'50%',transform:'translate(50%,1000%)',zIndex:999}}
                onMouseLeave={()=>setShowForm(false)}
                >
                <EventForm selectedDate={selectedDate}
                onSave={handleSaveEvent}
                onclose={()=>setShowForm(false)}/>
                </div>
        )}
        {
            showConflictDialog && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{backgroundColor:'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Event Conflict</h5>
                        </div>
                        <div className="modal-body">
                            <p>Another  event is already scheduled at the same time.</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={()=> setShowConflictDialog(false)}>
                                    OK
                                </button>
                        </div>
                    </div>
                    </div>
                   </div> 
            )
        }
           
        </div>
        
       
    );
     
};
export default MonthlyView;