import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Default from "./layouts/Default";
import SignUpPage from "./pages/auth/SignUpPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Default />,
    children: [
      {
        path: '/sign-up',
        element: <SignUpPage />
      },
      {
        path: '/sign-in',
        element: <SignUpPage />
      }
    ]
  }
])

const Router = () => <RouterProvider router={router} />

export default Router;