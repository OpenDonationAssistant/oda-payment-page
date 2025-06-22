import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import "@fontsource/black-ops-one";
import "@fontsource-variable/exo-2";
import "@fontsource/material-symbols-sharp";

import Donation from "./pages/Donation/Donation";

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

let recipientId = window.location.hostname.substring(
  0,
  window.location.hostname.indexOf("."),
);

if (recipientId === "bael-stream") {
  recipientId = "baelstream";
}

if (!recipientId) {
  recipientId = "testuser";
}
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get("recipientId");
if (myParam) {
  recipientId = myParam;
}

var dynamicManifest = {
  name: `${recipientId} - Donation`,
  short_name: `${recipientId} - Donation`,
  description: `${recipientId} - Donation`,
  start_url: `${recipientId}.oda.digital`,
  background_color: "#000000",
  theme_color: "#674ea7",
  icons: [
    {
      src: `${process.env.REACT_APP_CDN_ENDPOINT}/logo-${recipientId}.png`,
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

document.title = `${recipientId} - Donation`;

String.prototype.hashCode = function () {
  var hash = 0,
    i,
    chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

const apiUrl = window.location.hostname.endsWith(
  process.env.REACT_APP_DOMAIN ?? "localhost",
)
  ? process.env.REACT_APP_CONFIG_API_ENDPOINT
  : `https://${window.location.hostname}`;

const config = await axios
  .get(`${apiUrl}/config/paymentpage?ownerId=${recipientId}`)
  .then((json) => {
    return json.data;
  });

const pageConfig = new PaymentPageConfig(config);

const paymentController = new PaymentController(
  recipientId,
  config.value["media.requests.cost"] ?? 100,
  config.value["minimalAmount"],
);

const paymentStore = new PaymentStore({
  recipientId: recipientId,
  mediaRequestCost: config.value["media.requests.cost"] ?? 100,
  minimalPayment: config.value["minimalAmount"],
});

pageConfig.goals
  .filter((goal) => goal.selected)
  .forEach((goal) => (paymentController.goal = goal.id));

const userSettings = new UserSettingsStore();
console.log("use old theme: " + userSettings.useOldTheme);

const requestsEnabled =
  config.value["media.requests.disabled.permanently"] === false &&
  config.value["media.requests.enabled"] === true;
const hasGoals = pageConfig.goals.length > 0;

const showNewVersion =
  !requestsEnabled &&
  !hasGoals &&
  window.screen.width > 1000 &&
  window.innerWidth > 1000 &&
  !userSettings.useOldTheme;

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PaymentStoreContext.Provider value={paymentStore}>
        <PaymentPageConfigContext.Provider value={pageConfig}>
          <UserSettingsStoreContext.Provider value={userSettings}>
            {showNewVersion && <DonationPage />}
            {!showNewVersion && (
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
            )}
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
  background-image: url(${process.env.REACT_APP_CDN_ENDPOINT}/back-${recipientId}.jpg);
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
