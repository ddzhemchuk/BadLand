import { useEffect } from "react";
import TopUp from "../components/TopUp/TopUp";

const HomePage = () => {
  useEffect(() => {
    document.title = "BadLand - покупка доната";
  }, []);

  return <TopUp />;
};

export default HomePage;
