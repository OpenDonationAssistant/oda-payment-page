import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Donation from "./components/Donation/Donation";
import PaymentResult, {
  loader as paymentUpdater,
} from "./components/PaymentResult/PaymentResult";
import Offer from "./components/Offer/Offer";
import Payment, { loader as paymentLoader } from "./components/Payment/Payment";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Donation />,
  },
  {
    path: "/payment/:paymentId",
    element: <Payment />,
    loader: paymentLoader,
  },
  {
    path: "/payment/:paymentId/result",
    element: <PaymentResult />,
    loader: paymentUpdater,
  },
  {
    path: "/offer",
    element: <Offer />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <style
      dangerouslySetInnerHTML={{
        __html: `html, body {background-image: url("${process.env.PUBLIC_URL}/${process.env.REACT_APP_RECIPIENT_ID}.jpg")}`,
      }}
    />
    <RouterProvider router={router} />
  </React.StrictMode>
);
