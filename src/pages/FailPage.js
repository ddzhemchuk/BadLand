import { useEffect } from "react";
import Modal from "../components/Modal/Modal";

const FailPage = () => {
  useEffect(() => {
    document.title = "Ошибка при оплате платежа | BadLand";
  }, []);
  
  return (
    <Modal error={true}>
      Оплата завершилась ошибкой. Попробуйте ещё раз...
    </Modal>
  );
};

export default FailPage;
