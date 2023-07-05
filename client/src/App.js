import { useState, useEffect } from "react";

const API_BASE = "http://localhost:3001";

function App() {

    const [todos, setTodos] = useState([]);
    const [popupActive, setPopupActive] = useState(false);
    const [newTodo, setNewTodo] = useState("");

    useEffect(()=> {

        GetTodos();

    },[]);

    const GetTodos = () => {
        fetch(API_BASE+"/todos")
            .then(res => res.json())
            .then(data => setTodos(data))
            .catch(err => console.error(`Error: ${err}`));
    }

    const completeTodo = async id => {
        const data = await fetch(`${API_BASE}/todo/complete/${id}`)
            .then(res => res.json());
        
        setTodos( todos => todos.map( todo => {
            if( todo._id === data._id){
                todo.complete = data.complete;
            }
            return todo;
        }));

    }
    
    const deleteTodo = async id => {
        const data = await fetch( API_BASE+ "/todo/delete/" + id, {
            method: "DELETE"
        }).then( res => res.json());
        
        setTodos( todos => todos.filter(todo => todo._id !== data._id));

    }

    const addToDo = async () => {
        if( newTodo !== "" ){
            const data = await fetch(`${API_BASE}/todo/new`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: newTodo
                })
            }).then(res => res.json());

            setTodos([...todos, data]);
            setPopupActive(false);
            setNewTodo("");
            // console.log(data);

        }else{
            setPopupActive(false);
        }
    }

    const formatTimestamp = (timeStamp) => {
        const date = new Date(timeStamp);
        let hours = date.getHours().toString().padStart(2, "0");
        let mins = date.getMinutes().toString().padStart(2,"0");

        const ampm = (hours >= 12) ? 'pm'  : 'am';

        hours = hours%12;
        hours = (hours) ? hours:12;

        hours = hours.toString().padStart(2, "0");
        
        return `${hours}:${mins} ${ampm}`;
    }


    return (
        <div className="App">
            <h1>Your Tasks</h1>
            <h4>Finish them</h4>

            <div className="todos">
                {todos.map( todo => (
                    <div className={
                            "todo " + (todo.complete ? "is-complete" : "")
                        } key={todo._id} onClick={() => completeTodo(todo._id)}>
                        <div className="checkbox"  ></div>

                        <div className="text">{todo.text}</div>
                        <div className="time_stamp">{formatTimestamp(todo.timestamp)}</div>
                        
                        <div className="delete-todo" 
                            onClick={(event) => {
                                event.stopPropagation();
                                deleteTodo(todo._id)
                            }
                        }>
                            x
                        </div>
                    </div>
                ))}

                <div className="addPopup" onClick={()=> setPopupActive(true)}>+</div>

                { popupActive && (
                    <div className="popup">
                        <div className="closePopup" onClick={()=> setPopupActive(false)}>x</div>
                        <div className="content">
                            <h3>Add task</h3>
                            <input 
                                type="text" 
                                className="add-todo-input" 
                                onChange={e=> setNewTodo(e.target.value)}
                                value={newTodo}
                                required
                            />
                            <div className="button" onClick={() => addToDo()}>Create Task</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
