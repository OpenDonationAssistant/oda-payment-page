import React from "react";
import Footer from "./sections/Footer/Footer";
import "./Donation.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-tooltip/dist/react-tooltip.css";
import CookiePopup from "./sections/CookiePopup/CookiePopup";
import { PaymentController } from "../../logic/payment/PaymentController";
import PayButton from "./sections/PayButton/PayButton";
import NicknameInput from "./sections/NicknameInput/NicknameInput";
import MessageInput from "./sections/MessageInput/MessageInput";
import AmountInput from "./sections/AmountInput/AmountInput";
import MediaInput from "./sections/MediaInput/MediaInput";
import ArbitraryTextPanel from "./sections/ArbitraryTextPanel/ArbitraryTextPanel";
import { PaymentPageConfig } from "../../logic/PaymentPageConfig";
import ODALogo from "../../components/ODALogo/ODALogo";

export default function Donation({
  pageConfig,
  recipientId,
  mediaRequestsEnabled,
  mediaRequestsDisabledPermanently,
  streamerName,
  paymentController,
}: {
  pageConfig: PaymentPageConfig;
  recipientId: string;
  mediaRequestsEnabled: boolean;
  mediaRequestsDisabledPermanently: boolean;
  streamerName: string;
  paymentController: PaymentController;
}) {
  return (
    <>
      <ODALogo />
      <div className="page-content-container">
          <AmountInput
            recipientId={recipientId}
            streamerName={streamerName}
            paymentController={paymentController}
          />

          <div id="data-panel" className="container">
            <NicknameInput paymentController={paymentController} />
            <MessageInput paymentController={paymentController} />
            <MediaInput
              recipientId={recipientId}
              mediaRequestsDisabledPermanently={
                mediaRequestsDisabledPermanently
              }
              mediaRequestsEnabled={mediaRequestsEnabled}
              paymentController={paymentController}
            />
            <PayButton paymentController={paymentController} />
          </div>

          <Footer nickname={streamerName} />
          <CookiePopup />
        <div className="arbitrary-text-container">
          {pageConfig.arbitraryText && (
            <ArbitraryTextPanel
              collapse={false}
              text={pageConfig.arbitraryText}
            />
          )}
        </div>
      </div>
    </>
  );
}
