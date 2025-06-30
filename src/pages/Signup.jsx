import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/Form.module.css";

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(form);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formWrapper}>
      <h2>Create Your Account</h2>
      <input
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit">Join the Fellowship</button>
    </form>
  );
};

export default Signup;
