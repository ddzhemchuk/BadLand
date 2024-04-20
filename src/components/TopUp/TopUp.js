import { useDispatch, useSelector } from "react-redux";
import styles from "./TopUp.module.scss";
import { useEffect, useState } from "react";
import { request } from "../../utils";
import config from "../../storage/config";
import { storageActions } from "../../storage/redux";

const TopUp = () => {
  const data = useSelector((state) => state.servers);
  const currency = useSelector((state) => state.currentCurrency);
  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState(null);

  const [selectedServer, setSelectedServer] = useState(-1);
  const [selectedProduct, setSelectedProduct] = useState(-1);

  const [price, setPrice] = useState(0);

  const [nickname, setNickname] = useState("");
  const [quantity, setQuantity] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isEmailRequest, setIsEmailRequest] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setSelectedServer(data.length > 0 ? data[0].id : -1);
  }, [data]);

  useEffect(() => {
    const findServerData = data.find((item) => item.id === selectedServer);

    if (
      !findServerData ||
      !findServerData.categories ||
      findServerData.categories.length === 0
    ) {
      setSelectedProduct(-1);
      return setCategories([]);
    }

    let firstProduct = -1;

    if (
      findServerData.categories[0].products &&
      findServerData.categories[0].products.length > 0
    ) {
      firstProduct = findServerData.categories[0].products[0].id ?? -1;
    }

    setSelectedProduct(firstProduct);
    setCategories(findServerData.categories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServer]);

  useEffect(() => {
    let findProductData = -1;

    categories.forEach((item) => {
      item.products.forEach((product) => {
        if (product.id === selectedProduct) {
          findProductData = product;
        }
      });
    });

    if (!findProductData) {
      return setProductData(null);
    }

    setPrice(findProductData.price);

    if (findProductData.custom) {
      setQuantity(findProductData.custom.min);
      setPrice(
        (findProductData.custom.price * findProductData.custom.min).toFixed(2)
      );
    }

    setProductData(findProductData);
  }, [selectedProduct, categories]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (!productData || !productData.custom) {
        return;
      }

      let newQuantity = parseInt(quantity);

      if (isNaN(newQuantity)) {
        newQuantity = productData.custom.min;
      }

      if (newQuantity < productData.custom.min) {
        newQuantity = productData.custom.min;
      }

      if (newQuantity > productData.custom.max) {
        newQuantity = productData.custom.max;
      }

      setQuantity(newQuantity);
      setPrice((productData.custom.price * newQuantity).toFixed(2));
    }, 500);

    return () => clearTimeout(id);
  }, [quantity, productData]);

  const getPrice = (price) => {
    let finalPrice = (price * currency.rate).toFixed(2);

    if (finalPrice.split(".")[1] === "00") {
      finalPrice = finalPrice.split(".")[0];
    }

    return `${finalPrice} ${currency.icon}`;
  };

  const pay = async (e) => {
    e.preventDefault();

    const body = {
      action: "pay",
      currency: currency.code,
      nickname,
      server: selectedServer,
      product: selectedProduct,
      quantity,
    };

    if (isEmailRequest) {
      body.email = email;
    }

    setIsSubmitting(true);
    const resp = await request(`${config.api.url}`, "POST", body);

    if (resp.success) {
      window.location.href = resp.data.link;
    } else {
      dispatch(
        storageActions.showModal({
          show: true,
          type: "error",
          message: resp.message,
        })
      );
    }
    setIsSubmitting(false);
  };

  return (
    <section className="main-content">
      <div className="container">
        <div className={styles["topup-block"]}>
          <h1 className={styles["topup-block__title"]}>Пополнить аккаунт</h1>
          <form className={styles["topup-form"]} onSubmit={pay}>
            <input
              type="text"
              className={styles["topup-form__input"]}
              placeholder="Введите никнейм"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
            {isEmailRequest && (
              <input
                type="email"
                className={styles["topup-form__input"]}
                placeholder="Введите ваш email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            )}
            <div className={styles["topup-form__select-box"]}>
              <select
                className={styles["topup-form__select"]}
                onChange={(e) => {
                  setSelectedServer(e.target.value);
                }}
                value={selectedServer}
                required
              >
                <optgroup label="Выбор сервер">
                  {data.map((serverItem) => (
                    <option key={serverItem.id} value={serverItem.id}>
                      {serverItem.title}
                    </option>
                  ))}
                </optgroup>
              </select>
              <span className="material-symbols-outlined"> expand_more </span>
            </div>
            <div className={styles["topup-form__select-box"]}>
              <select
                className={styles["topup-form__select"]}
                onChange={(e) => {
                  setSelectedProduct(e.target.value);
                }}
                value={selectedProduct}
                required
              >
                {categories.map((category, index) => (
                  <optgroup key={index} label={category.group_title}>
                    {category.products.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <span className="material-symbols-outlined"> expand_more </span>
            </div>
            {productData && productData.custom && (
              <input
                type="text"
                className={styles["topup-form__input"]}
                placeholder="Введите количество"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            )}
            <button
              type="button"
              className={styles.emailRequest}
              onClick={() => setIsEmailRequest((state) => !state)}
            >
              <span className={styles.checkbox}>
                {isEmailRequest && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M480.1 128.1l-272 272C204.3 405.7 198.2 408 192 408s-12.28-2.344-16.97-7.031l-144-144c-9.375-9.375-9.375-24.56 0-33.94s24.56-9.375 33.94 0L192 350.1l255-255c9.375-9.375 24.56-9.375 33.94 0S490.3 119.6 480.1 128.1z" />
                  </svg>
                )}
              </span>
              <span className={styles.emailText}>
                Отправить чек по электронной почте
              </span>
            </button>
            <div className={styles["summary"]}>
              <p className={styles["summary__text"]}>К оплате:</p>
              <p className={styles["summary__price"]}>{getPrice(price || 0)}</p>
              <button
                type="submit"
                className={styles["summary__submit"]}
                disabled={isSubmitting ? true : false}
              >
                Оплатить
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default TopUp;
