import { useEffect } from "react";
import styles from "./Modal.module.scss";

const PaymentSystemsModal = ({
  closeHandler,
  payHandler,
  paymentSystems,
  setPaymentSystem,
  paymentSystem,
}) => {
  useEffect(() => {
    if (!paymentSystem && paymentSystems.length > 0) {
      setPaymentSystem(paymentSystems[0].id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentSystems]);
  
  return (
    <div
      className={styles.modal}
      onClick={(e) => {
        if (e.target.className === styles.modal) closeHandler();
      }}
    >
      <div className={styles.window}>
        <div className={styles.header}>
          <h2 className={styles.title}>Платежная система</h2>
          <button className={styles.close} type="button" onClick={closeHandler}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        {paymentSystems && (
          <div className={styles.body}>
            <div className={styles.paymentsystems}>
              {paymentSystems.map((ps) => (
                <button
                  className={
                    paymentSystem === ps.id
                      ? `${styles.ps} ${styles.active}`
                      : styles.ps
                  }
                  title={ps.title}
                  key={ps.id}
                  onClick={() => {
                    setPaymentSystem(ps.id);
                  }}
                >
                  <img src={ps.icon} alt={ps.title} />
                </button>
              ))}
            </div>
            <button
              type="submit"
              className={styles["summary__submit"]}
              disabled={!paymentSystem}
              onClick={payHandler}
            >
              Оплатить
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSystemsModal;
