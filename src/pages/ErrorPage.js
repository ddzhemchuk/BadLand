import { useRouteError } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Modal from "../components/Modal/Modal";
import { useEffect } from "react";

const ErrorPage = () => {
  let error = useRouteError();
  console.error(error);

  useEffect(() => {
    document.title = "Упс... Ошибка | BadLand";
  }, []);

  return (
    <>
      <Header />
      <main className="main"></main>
      <Footer />
      <Modal error={true}>
        <span style={{display: "block", fontWeight: "bold", fontSize: "1.25rem", marginBottom: "1rem"}}>{error.status} {error.statusText}</span> {error.error.message}
      </Modal>
    </>
  );
};

export default ErrorPage;
