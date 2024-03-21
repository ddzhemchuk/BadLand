import { useEffect } from "react";
import Modal from "../components/Modal/Modal";

const SuccessPage = () => {
  useEffect(() => {
    document.title = "Успешная оплата на BadLand!";
  }, []);
  
  return (
    <Modal error={true} title="Успешная оплата!">
      Мы получили ваш платеж. Вы можете закрыть это окно.
    </Modal>
  );
};

export default SuccessPage;
