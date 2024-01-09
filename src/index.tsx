import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import Donation from "./pages/Donation/Donation";

import PaymentResult, {
  loader as paymentUpdater,
} from "./pages/PaymentResult/PaymentResult";

import Agreement from "./pages/Agreement/Agreement";
import Payment, { loader as paymentLoader } from "./pages/Payment/Payment";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import { PaymentController } from "./logic/payment/PaymentController";
import { AssistController } from "./logic/AssistController";

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

const paymentController = new PaymentController(
  recipientId,
  config.value["media.requests.cost"],
  40,
);

const assistController = new AssistController();

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Donation
        recipientId={recipientId}
        mediaRequestsEnabled={config.value["media.requests.enabled"]}
        mediaRequestsDisabledPermanently={
          config.value["media.requests.disabled.permanently"]
        }
        streamerName={config.value.nickname}
        paymentController={paymentController}
        assistController={assistController}
      />
    ),
  },
  {
    path: "/payment/:paymentId",
    element: <Payment nickname={config.value.nickname} />,
    loader: paymentLoader,
  },
  {
    path: "/payment/:paymentId/result",
    element: <PaymentResult recipientId={recipientId} />,
    loader: paymentUpdater,
  },
  {
    path: "/offer",
    element: (
      <Agreement
        recipientId={recipientId}
        nickname={config.value.nickname}
        fio={config.value.fio}
        inn={config.value.inn}
        email={config.value.email}
      />
    ),
  },
]);

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <style
        dangerouslySetInnerHTML={{
          __html: `html, body {background-image: url("${process.env.REACT_APP_CDN_ENDPOINT}/back-${recipientId}.jpg")}`,
        }}
      />
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
}
