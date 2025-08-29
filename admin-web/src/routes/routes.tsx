import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Default from "./layouts/Default";
import SignInPage from "./pages/auth/SignInPage";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Default />,
    children: [
      {
        path: '/sign-in',
        element: <SignInPage />
      }
    ]
  }
])

const Router = () => <RouterProvider router={routes} />

export default Router;