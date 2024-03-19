import { useEffect } from "react";
import Tutorial from "../components/Tutorial/Tutorial";

const TutorialPage = () => {
  useEffect(() => {
    document.title = "Как купить донат | BadLand";
  }, []);
  
  return <Tutorial />;
};

export default TutorialPage;
