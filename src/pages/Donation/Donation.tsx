import React from "react";
import Footer from "./sections/Footer/Footer";
import "./Donation.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-tooltip/dist/react-tooltip.css";
import { AssistController } from "../../logic/AssistController";
import CookiePopup from "./sections/CookiePopup/CookiePopup";
import { PaymentController } from "../../logic/payment/PaymentController";
import PayButton from "./sections/PayButton/PayButton";
import NicknameInput from "./sections/NicknameInput/NicknameInput";
import MessageInput from "./sections/MessageInput/MessageInput";
import AmountInput from "./sections/AmountInput/AmountInput";
import MediaInput from "./sections/MediaInput/MediaInput";

export default function Donation({
  recipientId,
  mediaRequestsEnabled,
  mediaRequestsDisabledPermanently,
  streamerName,
  paymentController,
  assistController,
}: {
  recipientId: string;
  mediaRequestsEnabled: boolean;
  mediaRequestsDisabledPermanently: boolean;
  streamerName: string;
  paymentController: PaymentController;
  assistController: AssistController;
}) {


  return (
    <div className="page-content-container h-100 align-items-center">
      <div id="page-card" className="rounded-top-4 card shadow-lg">
        <AmountInput
          recipientId={recipientId}
          streamerName={streamerName}
          paymentController={paymentController}
        />

        <div id="data-panel" className="container rounded-bottom-0 rounded-3">
          <NicknameInput paymentController={paymentController} />
          <MessageInput paymentController={paymentController} />
          <MediaInput
            recipientId={recipientId}
            mediaRequestsDisabledPermanently={mediaRequestsDisabledPermanently}
            mediaRequestsEnabled={mediaRequestsEnabled}
            paymentController={paymentController}
          />
          <PayButton paymentController={paymentController} />
        </div>

        <Footer nickname={streamerName} />
        <CookiePopup />
      </div>
    </div>
  );
}
