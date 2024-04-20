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
import Info from "./components/Info/Info";
import config from "./storage/config";
import { request as requestCustom } from "./utils";

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
      {
        path: "/info/:page",
        element: <Info />,
        loader: async ({ request, params }) => {
          const data = await requestCustom(
            `${config.api.url}?action=page&slug=${params.page}`
          );

          if (data.success) {
            if (data.data) {
              return data.data;
            } else {
              throw new Error("No data");
            }
          } else {
            throw new Error(data.message);
          }
        },
      },
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
