import { useLoaderData } from "react-router-dom";
import styles from "../Tutorial/Tutorial.module.scss";
import { useEffect } from "react";
import parse from "html-react-parser";

const Info = () => {
  const content = useLoaderData();

  useEffect(() => {
    if (content.title) {
      document.title = content.title;
    }
  }, [content.title]);

  return (
    <section className="main-content">
      <div className="container">
        <h1 className={styles.agreementsTitle}>{content.title}</h1>
        <div className={styles.tutorial}>
          <div className={styles.content}>
            {content.content.length > 0 ? (
              content.content.map((data, index) => (
                <div className={styles.block} key={index}>
                  {parse(data)}
                </div>
              ))
            ) : (
              <div className={styles.block}>
                <p className={styles.title}>Страница не найдена</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Info;
