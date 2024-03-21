import { useSelector } from "react-redux";
import styles from "./Description.module.scss";
import { useEffect, useState } from "react";
import parse from "html-react-parser";

const Description = () => {
  const data = useSelector((state) => state.servers);
  const [server, setServer] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    setServer(data.length > 0 ? data[0].id : null);
  }, [data]);

  useEffect(() => {
    const findServerData = data.find((item) => item.id === server);

    if (!findServerData || !findServerData.categories) {
      return setProducts([]);
    }

    const serverProducts = [];

    findServerData.categories.forEach((category) => {
      if (category.products) {
        category.products.forEach((item) => {
          if (item.description) {
            serverProducts.push(item);
          }
        });
      }
    });

    setSelectedProduct(serverProducts.length > 0 ? 0 : null);
    setProducts(serverProducts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [server]);

  return (
    <section className="main-content">
      <div className="container">
        <div className={styles.content}>
          <h1 className={styles.title}>Описание доната</h1>
          <div className={styles.servers}>
            {data.map((serverItem) => (
              <button
                className={
                  server === serverItem.id
                    ? `${styles.server} ${styles.active}`
                    : styles.server
                }
                key={serverItem.id}
                type="button"
                onClick={() => {
                  setServer(serverItem.id);
                }}
              >
                {serverItem.title}
              </button>
            ))}
          </div>
          {products.length > 0 && (
            <div className={styles.body}>
              <aside className={styles.products}>
                <p className={styles.title}>Выберите привилегию </p>
                {products.length > 0 && (
                  <ul className={styles.list}>
                    {products.map((product, index) => (
                      <li key={index}>
                        <button
                          className={
                            selectedProduct === index
                              ? `${styles.serverBtn} ${styles.active}`
                              : styles.serverBtn
                          }
                          type="button"
                          onClick={() => {
                            setSelectedProduct(index);
                          }}
                        >
                          {product.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </aside>
              <div className={styles.description}>
                <p className={styles.title}>Описание выбранной привилегии:</p>
                <div className={styles.descriptionText}>
                  {products[selectedProduct] &&
                    parse(products[selectedProduct].description)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Description;
