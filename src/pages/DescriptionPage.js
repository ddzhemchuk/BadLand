import { useEffect } from "react";
import Description from "../components/Description/Description";

const DescriptionPage = () => {
  useEffect(() => {
    document.title = "Описание доната | BadLand";
  }, []);

  return <Description />;
};

export default DescriptionPage;
