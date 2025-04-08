import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import styles from "../Header/header.module.scss";

function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) =>
    location.pathname === path ? styles.activeLink : "";

  return (
    <nav className={styles.navigationWrapper}>
      <Link to="/" className={styles.logo}></Link>

      <button
        className={styles.menuToggle}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✖" : "☰"}
      </button>

      <div className={`${styles.navigation} ${menuOpen ? styles.open : ""}`}>
        <Link
          to="/"
          className={isActive("/")}
          onClick={() => setMenuOpen(false)}
        >
          Начало
        </Link>
        <Link
          to="/about-us"
          className={isActive("/about-us")}
          onClick={() => setMenuOpen(false)}
        >
          За Нас
        </Link>
        <Link
          to="/services"
          className={isActive("/services")}
          onClick={() => setMenuOpen(false)}
        >
          Наши обекти
        </Link>
        <Link
          to="/contacts"
          className={isActive("/contacts")}
          onClick={() => setMenuOpen(false)}
        >
          Контакти
        </Link>
      </div>
    </nav>
  );
}

export default Header;
