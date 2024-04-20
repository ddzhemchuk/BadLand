import { Outlet } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { request } from "./utils";
import { storageActions } from "./storage/redux";
import config from "./storage/config";
import Modal from "./components/Modal/Modal";

const RootLayout = () => {
  const dispatch = useDispatch();
  const showModal = useSelector((state) => state.modal.show);
  const [agreements, setAgreements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await request(`${config.api.url}?action=home`);

      if (data.success) {
        if (data.data.currencies) {
          dispatch(storageActions.setCurrencies(data.data.currencies));
        }

        if (data.data.contacts) {
          dispatch(storageActions.setContacts(data.data.contacts));
        }

        if (data.data.agreements) {
          setAgreements(data.data.agreements);
        }

        if (data.data.servers) {
          if (data.data.servers.length === 0) {
            dispatch(
              storageActions.showModal({
                show: true,
                type: "error",
                message: "Серверы недоступны. Попробуйте позже.",
              })
            );
          } else {
            dispatch(storageActions.setServers(data.data.servers));
          }
        }
      } else {
        dispatch(
          storageActions.showModal({
            show: true,
            type: "error",
            message: data,
          })
        );
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header agreements={agreements} />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
      {showModal && <Modal />}
    </>
  );
};

export default RootLayout;
