import { NavLink } from "react-router-dom";
import styles from "./Tutorial.module.scss";
import { useDispatch } from "react-redux";
import { storageActions } from "../../storage/redux";
import { useEffect, useState } from "react";
import { request } from "../../utils";
import config from "../../storage/config";

const Tutorial = () => {
  const dispatch = useDispatch();
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await request(`${config.api.url}?action=tutorial`);

      if (data.success) {
        if (data.data) {
          setSteps(data.data);
        }
      } else {
        dispatch(
          storageActions.showModal({
            show: true,
            type: "error",
            message: data.message,
          })
        );
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="main-content">
      <div className="container">
        <div className={styles.tutorial}>
          <aside className={styles.aside}>
            <div className={styles.block}>
              <h3 className={styles.title}>Возникли трудности?</h3>
              <p className={styles.text}>
                Наша служба поддержки всегда будет рада помочь тебе!
              </p>
              <button
                className={styles.button}
                type="button"
                onClick={() => {
                  dispatch(
                    storageActions.showModal({ show: true, type: "contacts" })
                  );
                }}
              >
                Сообщить о проблеме
              </button>
            </div>
            <div className={styles.block}>
              <h3 className={styles.title}>Донат навсегда!</h3>
              <p className={styles.text}>
                Привилегия не пропадет после вайпа, так же у нас работает
                доплата
              </p>
              <NavLink to="/" className={styles.button}>
                Купить привилегию
              </NavLink>
            </div>
          </aside>
          <div className={styles.content}>
            {steps.length > 0 ? (
              steps.map((step, index) => (
                <div className={styles.block} key={index}>
                  {step.text && <p className={styles.title}>{step.text}</p>}
                  {step.image && (
                    <img
                      src={config.api.baseUrl + step.image}
                      alt={step.text ? step.text : ""}
                      className={styles.image}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className={styles.block}>
                <p className={styles.title}>Нет доступных инструкций :(</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tutorial;
