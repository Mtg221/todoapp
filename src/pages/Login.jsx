import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login(){

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const navigate = useNavigate();

  const login = async ()=>{

    const res = await axios.post(
      "http://localhost:3000/login",
      { email, password }
    );

    localStorage.setItem("token", res.data.token);

    navigate("/dashboard");
  };

  return(

    <div>

      <h2>Login</h2>

      <input
        placeholder="email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button onClick={login}>Login</button>

    </div>

  );

}

export default Login;