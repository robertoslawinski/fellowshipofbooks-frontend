import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <nav className={styles.nav}>
      <Link to="/">Home</Link>

      {currentUser ? (
        <>
          <Link to="/search">Search Books</Link>
          <Link to="/my-books">My Books</Link>
          <Link to="/profile">Profile</Link>
          <span>Hello, {currentUser.username}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/signup">Signup</Link>
          <Link to="/login">Login</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
