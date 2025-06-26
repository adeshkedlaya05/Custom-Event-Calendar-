import React,{useState} from 'react';
import moment from 'moment';

const MonthlyView=()=>{
    const[CurrentMonth,SetCurrentMonth]=useState(moment());
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
                                    </div>
                        );
                    })}
              </div>
            ))}
            
        </div>
    );
};
export default MonthlyView;