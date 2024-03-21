import styles from "./Header.module.scss";
import logo from "../../images/logo.png";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { storageActions } from "../../storage/redux";

const Header = () => {
  const currencies = useSelector((state) => state.currencies);
  const currentCurrency = useSelector((state) => state.currentCurrency);

  const dispatch = useDispatch();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [showCurrencies, setShowCurrencies] = useState(false);

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.container}>
          <NavLink to="/" className={styles.logo}>
            <img src={logo} alt="BadLand - Перейти на главную страницу" />
          </NavLink>
          <div
            className={
              mobileMenu
                ? `${styles.content} ${styles.visible}`
                : styles.content
            }
          >
            <nav className={styles.nav}>
              <ul className={styles.list}>
                {/* <li className={styles.item}>
                  <NavLink to="/rules" className={styles.link}>
                    Правила
                  </NavLink>
                </li> */}
                <li className={styles.item}>
                  <NavLink to="/tutorial" className={styles.link}>
                    Как купить донат?
                  </NavLink>
                </li>
                <li className={styles.item}>
                  <NavLink to="/description" className={styles.link}>
                    Описание доната
                  </NavLink>
                </li>
                <li className={styles.item}>
                  <button
                    type="button"
                    className={styles.link}
                    onClick={() => {
                      dispatch(
                        storageActions.showModal({
                          show: true,
                          type: "contacts",
                        })
                      );
                    }}
                  >
                    Контакты
                  </button>
                </li>
              </ul>
            </nav>
            <div className={styles.currencies}>
              <button
                type="button"
                className={styles.active}
                onClick={() => {
                  setShowCurrencies((state) => !state);
                }}
              >
                {`${currentCurrency.code.toUpperCase()} - ${
                  currentCurrency.icon
                }`}
                <span className="material-symbols-outlined">expand_more</span>
              </button>
              <ul
                className={
                  !showCurrencies
                    ? `${styles.list} ${styles.hidden}`
                    : styles.list
                }
              >
                {currencies.map((item, index) => (
                  <li className={styles.currency} key={index}>
                    <button
                      type="button"
                      className={styles.currency__btn}
                      onClick={() => {
                        dispatch(storageActions.setCurrentCurrency(item));
                        setShowCurrencies(false);
                      }}
                    >
                      {`${item.code.toUpperCase()} - ${item.icon}`}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button
            className={
              mobileMenu
                ? `${styles.mobileToggler} ${styles.visible}`
                : styles.mobileToggler
            }
            type="button"
            title="Открыть мобильное меню"
            onClick={() => {
              setMobileMenu((state) => !state);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className={styles["mobile-toggler__bars"]}
            >
              <path d="M424 392H23.1C10.8 392 0 402.8 0 415.1C0 429.2 10.8 440 23.1 440H424c13.2 0 24-10.8 24-23.1C448 402.8 437.2 392 424 392zM424 72H23.1C10.8 72 0 82.8 0 95.1S10.8 120 23.1 120H424c13.2 0 24-10.8 24-23.1S437.2 72 424 72zM424 232H23.1C10.8 232 0 242.8 0 256c0 13.2 10.8 24 23.1 24H424C437.2 280 448 269.2 448 256S437.2 232 424 232z" />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              className={styles["mobile-toggler__x"]}
            >
              <path d="M312.1 375c9.369 9.369 9.369 24.57 0 33.94s-24.57 9.369-33.94 0L160 289.9l-119 119c-9.369 9.369-24.57 9.369-33.94 0s-9.369-24.57 0-33.94L126.1 256L7.027 136.1c-9.369-9.369-9.369-24.57 0-33.94s24.57-9.369 33.94 0L160 222.1l119-119c9.369-9.369 24.57-9.369 33.94 0s9.369 24.57 0 33.94L193.9 256L312.1 375z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
