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
import axios from "axios";

let recipientId = window.location.hostname.substring(
  0,
  window.location.hostname.indexOf("."),
);

if (!recipientId) {
		recipientId = "testuser";
}

const config = await axios
  .get(
    `${process.env.REACT_APP_CONFIG_API_ENDPOINT}/config/paymentpage?ownerId=${recipientId}`,
  )
  .then((json) => {
    return json.data;
  });

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Donation
        recipientId={recipientId}
        mediaRequestsEnabled={config.value["media.requests.enabled"]}
        streamerName={config.value.nickname}
      />
    ),
  },
  {
    path: "/payment/:paymentId",
    element: (
      <Payment nickname={config.value.nickname} />
    ),
    loader: paymentLoader,
  },
  {
    path: "/payment/:paymentId/result",
    element: <PaymentResult />,
    loader: paymentUpdater,
  },
  {
    path: "/offer",
    element: (
      <Offer
        recipientId={recipientId}
        nickname={config.value.nickname}
        fio={config.value.fio}
        inn={config.value.inn}
        email={config.value.email}
      />
    ),
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <style
      dangerouslySetInnerHTML={{
        __html: `html, body {background-image: url("${process.env.PUBLIC_URL}/${recipientId}.jpg")}`,
      }}
    />
    <RouterProvider router={router} />
  </React.StrictMode>,
);
