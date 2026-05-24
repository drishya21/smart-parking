import React, { useState } from "react";
import { login } from "../auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const success = await login(email, password);

    if (success) {
      alert("Login Success");
      navigate("/dashboard");
    } else {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

       
      </div>
    </div>
  );
}

export default Login;

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f3f4f6",
  },

  box: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    width: "320px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "20px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  link: {
    marginTop: "15px",
    textAlign: "center",
    color: "#2563eb",
    cursor: "pointer",
  },
};