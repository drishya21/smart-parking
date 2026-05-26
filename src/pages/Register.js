import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://smart-parking-dq5f.onrender.com/api/auth/register/", {
        email: email,
        password: password,
      });

      alert("Registered successfully");
      console.log(res.data);

      navigate("/login"); // go to login page after register

    } catch (error) {
      console.log(error.response?.data);
      alert("Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2>Register</h2>

        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>

        <p onClick={() => navigate("/login")} style={styles.link}>
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}

export default Register;

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f2f2f2",
  },

  box: {
    padding: "30px",
    backgroundColor: "white",
    borderRadius: "10px",
    width: "300px",
    textAlign: "center",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
  },

  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "green",
    color: "white",
    border: "none",
  },

  link: {
    marginTop: "10px",
    color: "blue",
    cursor: "pointer",
  },
};