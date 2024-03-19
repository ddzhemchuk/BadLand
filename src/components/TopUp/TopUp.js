import { useSelector } from "react-redux";
import styles from "./TopUp.module.scss";
import { useEffect, useState } from "react";

const TopUp = () => {
  const servers = useSelector((state) => state.servers);
  const currency = useSelector((state) => state.currentCurrency);

  const [productId, setProductId] = useState(-1);
  const [product, setProduct] = useState(null);
  const [price, setPrice] = useState(0);

  const [nickname, setNickname] = useState("");
  const [quantity, setQuantity] = useState(0);

  // useEffect(() => {
  //   if (
  //     products.length > 0 &&
  //     products[0].products.length > 0 &&
  //     products[0].products[0].id
  //   ) {
  //     setProductId(products[0].products[0].id);
  //   }
  // }, [products]);

  // useEffect(() => {
  //   if (productId !== -1) {
  //     const product = products
  //       .map((group) => group.products)
  //       .flat()
  //       .find((item) => item.id === productId);

  //     if (product) {
  //       setProduct(product);
  //       setPrice(product.price);
  //       if (product.custom) {
  //         setQuantity(product.custom.min);
  //         setPrice((product.custom.price * product.custom.min).toFixed(2));
  //       }
  //     }
  //   }
  // }, [products, productId]);

  // const validateQuantity = (quantity, product) => {
  //   let newQuantity = parseInt(quantity);

  //   if (isNaN(newQuantity)) {
  //     return product.custom.min;
  //   }

  //   if (newQuantity < product.custom.min) {
  //     return product.custom.min;
  //   }

  //   if (newQuantity > product.custom.max) {
  //     return product.custom.max;
  //   }

  //   return newQuantity;
  // };

  // useEffect(() => {
  //   const id = setTimeout(() => {
  //     if (!product || !product.custom) {
  //       return;
  //     }

  //     const newQuantity = validateQuantity(quantity, product);

  //     setQuantity(newQuantity);
  //     setPrice((product.custom.price * newQuantity).toFixed(2));
  //   }, 1000);

  //   return () => clearTimeout(id);
  // }, [quantity, product]);

  // const getPrice = (price) => {
  //   let finalPrice = (price * currency.rate).toFixed(2);

  //   if (finalPrice.split(".")[1] === "00") {
  //     finalPrice = finalPrice.split(".")[0];
  //   }

  //   return `${finalPrice} ${currency.icon}`;
  // };

  return (
    <section className="main-content">
      <div className="container">
        <div className={styles["topup-block"]}>
          <h1 className={styles["topup-block__title"]}>Пополнить аккаунт</h1>
          <form className={styles["topup-form"]}>
            <input
              type="text"
              className={styles["topup-form__input"]}
              placeholder="Введите никнейм"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            {product && product.custom && (
              <input
                type="text"
                className={styles["topup-form__input"]}
                placeholder="Введите количество"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            )}
            <div className={styles["topup-form__select-box"]}>
              <select
                className={styles["topup-form__select"]}
                onChange={(e) => {
                  setProductId(e.target.value);
                }}
                value={productId}
              >
                {/* {products.map((group, index) => (
                  <optgroup key={index} label={group.group_title}>
                    {group.products.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </optgroup>
                ))} */}
              </select>
              <span className="material-symbols-outlined"> expand_more </span>
            </div>
            <div className={styles["summary"]}>
              <p className={styles["summary__text"]}>К оплате:</p>
              {/* <p className={styles["summary__price"]}>{getPrice(price || 0)}</p> */}
              <button type="submit" className={styles["summary__submit"]}>
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
