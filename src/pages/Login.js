import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
        email: email,
        password: password,
      });

      // store JWT tokens
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      alert("Login Success");
      navigate("/dashboard");

    } catch (error) {
      console.log(error.response?.data);
      alert("Invalid Email or Password");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        {/* REGISTER LINK */}
        <p style={styles.link} onClick={() => navigate("/register")}>
          Don’t have an account? Register
        </p>
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
    textDecoration: "underline",
    fontWeight: "500",
  },
};