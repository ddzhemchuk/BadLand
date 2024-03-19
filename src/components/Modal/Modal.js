import { useDispatch, useSelector } from "react-redux";
import styles from "./Modal.module.scss";
import { storageActions } from "../../storage/redux";

const Modal = () => {
  const modalData = useSelector((state) => state.modal);
  const contacts = useSelector((state) => state.contacts);
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(storageActions.hideModal());
  };

  return (
    <div
      className={styles.modal}
      onClick={(e) => {
        if (e.target.className === styles.modal)
          dispatch(storageActions.hideModal());
      }}
    >
      <div className={styles.window}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {modalData.type === "contacts" ? "Наши контакты:" : "Ошибка"}
          </h2>
          <button className={styles.close} type="button" onClick={closeModal}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className={styles.body}>
          {modalData.type === "contacts" ? (
            <ul className={styles.contacts}>
              {contacts.map((contact, index) => (
                <li className={styles.contact} key={index}>
                  {contact.title}:{" "}
                  {contact.href ? (
                    <a
                      href={contact.href}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                    >
                      {contact.value}
                    </a>
                  ) : (
                    contact.value
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.error}>{modalData.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
