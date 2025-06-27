import React,{useState,useEffect} from "react";
const EventForm=({selectedDate,onclose,onSave,editingEvent})=>{
    const [title,setTitle]=useState('');
    const [time,setTime]=useState('');
    const [description,setDesciption]=useState('');
    const [reccurance,setReccurance]=useState('');
    const [category,setCategory]=useState('');
    const [weeklyDays,setWeeklyDays]=useState([]);
    const [customInterval,setCustomInterval]=useState('');
    const [count,setCount]=useState('');

    useEffect(()=>{
        if(editingEvent){
             setTitle(editingEvent.title);
            setTime(editingEvent.time);
            setDesciption(editingEvent.description);
            setReccurance(editingEvent.reccurance);
            setCategory(editingEvent.category);
            setWeeklyDays(editingEvent.weeklyDays || []);
            setCustomInterval(editingEvent.customInterval || '');
            setCount(editingEvent.count || '');
        }
        else{
            setTitle('');
            setTime('');
            setDesciption('');
            setReccurance('');
            setCategory('');
        }
    },[selectedDate,editingEvent]);
    const handleWeeklyCheckBox =(e)=>{
        const value=e.target.value;
        setWeeklyDays((prev=>
        e.target.checked ? [...prev,value]:prev.filter((day)=>day!==value))
        );
    };
    const handleSubmit=(e)=>{
        e.preventDefault();
        const event={
            id:editingEvent?editingEvent.id :Date.now(),
            title,
            time,
            description,
            reccurance,
            category:category.trim().toLowerCase(),
            date:selectedDate.format('YYYY-MM-DD'),
            weeklyDays,
            customInterval,
            count:Number(count),
        };
        onSave(event)
        onclose();
    };

    return(
        <div className="position-fixed top-50 start-50 translate-middle bg-white p-4 rounded shadow" style={{zIndex:1000,width:'400px',maxWidth:'90vw'}}>
            <h5 className="mb-3">Add Event {selectedDate.format('YYYY-MM-DD')}</h5>
            <form onSubmit={handleSubmit}>
                <input className="form-control mb-2" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} required/>
                <input type="time" className="form-control mb-2" value={time} onChange={(e)=>setTime(e.target.value)} required/>
                <textarea className="form-control mb-2"placeholder="Description" value={description} onChange={(e)=>setDesciption(e.target.value)} required/>
                <select className="form-control mb-2" value={reccurance}  onChange={(e)=>setReccurance(e.target.value)}> 
                <option value="">No Reccurance</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom</option>
                </select>
                {reccurance==='weekly' && (
                    <div className="mb-2">
                        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day=>(
                            <label key={day} className="me-2">
                                <input type="checkbox" value={day} onChange={handleWeeklyCheckBox}/>{day}
                            </label>
                        ))}
                    </div>
                )}
                {reccurance==='custom' && (
                    <input type="number" className="form-control mb-2" placeholder="Every N days" onChange={(e)=>setCustomInterval(e.target.value)}/>
                )}
                 <input type="number" className="form-control mb-2" placeholder="How many occurances" onChange={(e)=>setCount(e.target.value)}/>
                <select className="form-control mb-3" value={category} onChange={(e)=>setCategory(e.target.value)}>
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="health">Health</option>
                </select>
                <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-success">Save</button>
                    <button type="button" className="btn btn-secondary" onClick={onclose}>Cancel</button>
                </div>
            </form>
        </div>
    );
};
export default EventForm;