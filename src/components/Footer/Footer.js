import logo from "../../images/moonstudio.png";
import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.container}>
          <div className={styles.copyright}>
            <p className={styles.itself}>© BadLand, 2020-2023</p>
            <p className={styles.text}>Все права защищены!</p>
          </div>

          <a href="https://vk.com/moonstudio" className={styles.developer}>
            <img src={logo} alt="Сайт разработан студией MoonStudio" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
