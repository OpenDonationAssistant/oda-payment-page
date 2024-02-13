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
import { PaymentPageConfig } from "./logic/PaymentPageConfig";

let recipientId = window.location.hostname.substring(
  0,
  window.location.hostname.indexOf("."),
);

String.prototype.hashCode = function() {
  var hash = 0,
    i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

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

const pageConfig = new PaymentPageConfig(config);

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
        pageConfig={pageConfig}
        recipientId={recipientId}
        mediaRequestsEnabled={config.value["media.requests.enabled"]}
        mediaRequestsDisabledPermanently={
          config.value["media.requests.disabled.permanently"]
        }
        streamerName={config.value.nickname}
        paymentController={paymentController}
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
