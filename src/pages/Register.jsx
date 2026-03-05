import { useState } from "react";
import axios from "axios";

function Register() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {

    await axios.post("http://localhost:3000/register", {
      email,
      password
    });

    alert("User created");
  };

  return (
    <div>

      <h2>Register</h2>

      <input
        placeholder="email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button onClick={register}>Register</button>

    </div>
  );
}

export default Register;