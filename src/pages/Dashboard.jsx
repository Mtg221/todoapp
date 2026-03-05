import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard(){

  const [todos,setTodos] = useState([]);
  const [content,setContent] = useState("");

  const token = localStorage.getItem("token");

  const fetchTodos = async ()=>{

    const res = await axios.get(
      "http://localhost:3000/todos",
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

    setTodos(res.data);
  };

  const addTodo = async ()=>{

    await axios.post(
      "http://localhost:3000/todos",
      { content },
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

    fetchTodos();
  };

  useEffect(()=>{
    fetchTodos();
  },[]);

  return(

    <div>

      <h2>My Todos</h2>

      <input
        placeholder="new todo"
        onChange={(e)=>setContent(e.target.value)}
      />

      <button onClick={addTodo}>
        Add
      </button>

      <ul>
        {todos.map(todo=>(
          <li key={todo.id}>
            {todo.content}
          </li>
        ))}
      </ul>

    </div>

  );

}

export default Dashboard;