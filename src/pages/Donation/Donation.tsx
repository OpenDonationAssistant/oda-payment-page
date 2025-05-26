import React, { useEffect, useState } from "react";
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
import DonationTargetPanel from "./sections/DonationTargetPanel/DonationTargetPanel";
import Feedback from "./sections/Feedback/Feedback";
import { useSearchParams } from "react-router-dom";
import { uuidv7 } from "uuidv7";

export default function Donation({
  pageConfig,
  recipientId,
  mediaRequestsEnabled,
  mediaRequestsDisabledPermanently,
  paymentController,
}: {
  pageConfig: PaymentPageConfig;
  recipientId: string;
  mediaRequestsEnabled: boolean;
  mediaRequestsDisabledPermanently: boolean;
  streamerName: string;
  paymentController: PaymentController;
}) {
  const [params] = useSearchParams();
  const [ip, setIp] = useState<string>("");
  const [marker, setMarker] = useState<string>("");

  const [useBeta, _] = useState(() => {
    const useBeta = params.get("beta");
    if (useBeta) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    const marker = localStorage.getItem("marker");
    if (!marker) {
      const newMarker = uuidv7();
      localStorage.setItem("marker", newMarker);
      setMarker(newMarker);
      paymentController.marker = newMarker;
    } else {
      paymentController.marker = marker;
    }
  }, [recipientId]);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => setIp(data.ip));
  }, [recipientId]);

  return (
    <>
      {pageConfig.customCss && (
        <style
          dangerouslySetInnerHTML={{
            __html: `@import url(${pageConfig.customCss})`,
          }}
        />
      )}
      <ODALogo />
      <Feedback />
      <div className="page-content-container">
        <AmountInput
          config={pageConfig}
          recipientId={recipientId}
          paymentController={paymentController}
        />

        <div className="donation-target">
          <DonationTargetPanel
            controller={paymentController}
            targets={pageConfig.goals}
          />
        </div>

        <div id="data-panel" className="container">
          <NicknameInput paymentController={paymentController} />
          <MessageInput
            paymentPageConfig={pageConfig}
            paymentController={paymentController}
          />
          <MediaInput
            recipientId={recipientId}
            mediaRequestsDisabledPermanently={mediaRequestsDisabledPermanently}
            mediaRequestsEnabled={mediaRequestsEnabled}
            paymentController={paymentController}
            tooltip={pageConfig.tooltip}
            maxAmount={pageConfig.requestAmount}
          />
          <PayButton
            paymentPageConfig={pageConfig}
            paymentController={paymentController}
          />
        </div>

        <Footer config={pageConfig} />
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
