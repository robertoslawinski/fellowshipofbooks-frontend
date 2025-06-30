import styles from "../styles/Home.module.css";
import logo from "../assets/logo.png";

const Home = () => {
  return (
    <div className={styles.home}>
      <img src={logo} alt="Fellowship of Books Logo" className={styles.logo} />
      <h1>Welcome to The Fellowship of Books</h1>
      <p>
        A place for adventurers, dreamers, and readers of Middle-earth to share their favorite books.
      </p>
    </div>
  );
};

export default Home;
