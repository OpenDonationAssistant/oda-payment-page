import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import "@fontsource/black-ops-one";
import "@fontsource-variable/exo-2";
import "@fontsource/material-symbols-sharp";

import PaymentResult, {
  loader as paymentUpdater,
} from "./pages/PaymentResult/PaymentResult";

import Agreement from "./pages/Agreement/Agreement";
import Payment, { loader as paymentLoader } from "./pages/Payment/Payment";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import { PaymentController } from "./logic/payment/PaymentController";
import {
  PaymentPageConfig,
  PaymentPageConfigContext,
} from "./logic/PaymentPageConfig";
import DonationPage from "./pages/DonationPage/DonationPage";
import { PaymentStore, PaymentStoreContext } from "./stores/PaymentStore";
import {
  UserSettingsStore,
  UserSettingsStoreContext,
} from "./stores/UserSettingsStore";

const apiUrl = window.location.hostname.endsWith(
  process.env.REACT_APP_DOMAIN ?? "localhost",
)
  ? process.env.REACT_APP_CONFIG_API_ENDPOINT
  : `https://${window.location.hostname}`;

const config = await axios
  .get(`${apiUrl}/config/paymentpage?url=${window.location.hostname}`)
  .then((json) => {
    return json.data;
  });

const pageConfig = new PaymentPageConfig(config);

var dynamicManifest = {
  name: `${pageConfig.recipientId} - Donation`,
  short_name: `${pageConfig.recipientId} - Donation`,
  description: `${pageConfig.recipientId} - Donation`,
  start_url: `${pageConfig.recipientId}.oda.digital`,
  background_color: "#000000",
  theme_color: "#674ea7",
  icons: [
    {
      src: `${process.env.REACT_APP_CDN_ENDPOINT}/logo-${pageConfig.recipientId}.png`,
      sizes: "300x300",
      type: "image/png",
    },
  ],
};

const stringManifest = JSON.stringify(dynamicManifest);
const blob = new Blob([stringManifest], { type: "application/json" });
const manifestURL = URL.createObjectURL(blob);

document
  .querySelector("#my-manifest-placeholder")
  ?.setAttribute("href", manifestURL);

document.title = `${pageConfig.recipientId} - Donation`;

const paymentController = new PaymentController(
  pageConfig.recipientId,
  config.value["media.requests.cost"] ?? 100,
  config.value["minimalAmount"],
);

const paymentStore = new PaymentStore({
  recipientId: pageConfig.recipientId,
  mediaRequestCost: config.value["media.requests.cost"] ?? 100,
  minimalPayment: config.value["minimalAmount"],
});

pageConfig.goals
  .filter((goal) => goal.selected)
  .forEach((goal) => (paymentController.goal = goal.id));

const userSettings = new UserSettingsStore();

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PaymentStoreContext.Provider value={paymentStore}>
        <PaymentPageConfigContext.Provider value={pageConfig}>
          <UserSettingsStoreContext.Provider value={userSettings}>
            <DonationPage />
          </UserSettingsStoreContext.Provider>
        </PaymentPageConfigContext.Provider>
      </PaymentStoreContext.Provider>
    ),
  },
  {
    path: "/payment/:paymentId",
    element: <Payment nickname={config.value.nickname} />,
    loader: paymentLoader,
  },
  {
    path: "/payment/:paymentId/result",
    element: <PaymentResult recipientId={pageConfig.recipientId} />,
    loader: paymentUpdater,
  },
  {
    path: "/offer",
    element: (
      <Agreement
        recipientId={pageConfig.recipientId}
        nickname={config.value.nickname}
        fio={config.value.fio}
        inn={config.value.inn}
        email={config.value.email}
        gateway={config.value.gateway}
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
          __html: `html::before {
  content: "";
  position: fixed;
  left: 0;
  right: 0;
  z-index: -1;
  display: block;
  background-image: url(${process.env.REACT_APP_CDN_ENDPOINT}/commonback.jpg);
  background-size:cover;
  width: 100%;
  height: 100%;
  filter: blur(5px);
}`,
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `body::before {
  content: "";
  position: fixed;
  left: 0;
  right: 0;
  z-index: -1;
  display: block;
  background-image: url(${process.env.REACT_APP_CDN_ENDPOINT}/back-${pageConfig.recipientId}.jpg);
  background-size: cover;
  width: 100%;
  height: 100%;
  filter: blur(5px);
}`,
        }}
      />
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
}
