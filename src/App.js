import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";
import HomePage from "./pages/HomePage";
import "./styles/reset.css";
import "./styles/main.css";
import { Provider } from "react-redux";
import store from "./storage/redux";
import TutorialPage from "./pages/TutorialPage";
import DescriptionPage from "./pages/DescriptionPage";
import ErrorPage from "./pages/ErrorPage";
import SuccessPage from "./pages/SuccessPage";
import FailPage from "./pages/FailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", index: true, element: <HomePage /> },
      { path: "/tutorial", element: <TutorialPage /> },
      { path: "/description", element: <DescriptionPage /> },
      { path: "/success", element: <SuccessPage /> },
      { path: "/fail", element: <FailPage /> },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
