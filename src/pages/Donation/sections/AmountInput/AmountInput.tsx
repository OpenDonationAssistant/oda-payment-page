import React, { useEffect, useState } from "react";
import { PaymentController } from "../../../../logic/payment/PaymentController";
import { PaymentPageConfig } from "../../../../logic/PaymentPageConfig";
import Url from "../Url/Url";

export default function AmountInput({
  config,
  recipientId,
  paymentController,
}: {
  config: PaymentPageConfig
  recipientId: string;
  paymentController: PaymentController;
}) {
  const [amountInputWidth, setAmountInputWidth] = useState(140);
  const [treshold, setTreshold] = useState<number>(paymentController.treshold);
  const [error, setError] = useState<string | null>(paymentController.error);
  const [amount, setAmount] = useState<number>(paymentController.amount);

  useEffect(() => {
    paymentController.addListener({
      setNickname: () => {},
      setText: () => {},
      setAmount: setAmount,
      setAttachments: () => {},
      setError: setError,
      setTreshold: setTreshold,
    });
  }, [paymentController]);

  function updateAmountInputWidth(amount: number) {
    setAmountInputWidth(140);
    if (amount >= 1000) {
      setAmountInputWidth(160);
    }
    if (amount >= 10000) {
      setAmountInputWidth(180);
    }
    if (amount >= 100000) {
      setAmountInputWidth(195);
    }
  }

  return (
    <>
      <div className="card-header ps-4 text-bg-dark align-middle">
        <div id="recipient-title">
          Для{" "}
          <Url config={config}/>
          {" "}на развитие канала
        </div>
        <div style={{ display: "flex" }}>
          <img
            id="default-logo"
            src={`${process.env.REACT_APP_CDN_ENDPOINT}/commonlogo.png`}
            style={{ display: "none" }}
            className="logo img-fluid rounded-2"
          />
          <img
            id="streamer-logo"
            src={`${process.env.REACT_APP_CDN_ENDPOINT}/logo-${recipientId}.png`}
            onError={() => {
              const style = document.getElementById("streamer-logo")?.style;
              if (style) {
                style.display = "none";
              }
              const defaultLogoStyle =
                document.getElementById("default-logo")?.style;
              if (defaultLogoStyle) {
                defaultLogoStyle.display = "block";
              }
            }}
            className="logo img-fluid rounded-2"
          />
          <div id="amount-container">
            <span id="donation-title">Донат</span>
            <div>
              <div className="amount-border">
                <i>{String(amount).replace(/^0+/, "")}</i>
              </div>
              <div className="amount-mask">
                <i>{String(amount).replace(/^0+/, "")}</i>
                <span>{`\u20BD`}</span>
              </div>
              <input
                id="amount-input"
                autoFocus={true}
                className={error ? "is-invalid" : ""}
                style={{ width: `${amountInputWidth}px` }}
                value={String(amount).replace(/^0+/, "")}
                type="number"
                autoComplete="off"
                onChange={(e) => {
                  let value = Number(e.target.value);
                  console.log(`amount value: ${value}`);
                  paymentController.amount = value;
                  updateAmountInputWidth(value);
                }}
              />
            </div>
          </div>
        </div>
        <div id="min-sum-title">
          <span className="no-wrap">Минимальная сумма:</span>{" "}
          <button
            id="min-sum-button"
            className="btn btn-link"
            tabIndex={-1}
            onClick={() => {
              paymentController.error = null;
              paymentController.amount = treshold;
            }}
          >
            {`${treshold}\u20BD`}
          </button>
        </div>
      </div>
    </>
  );
}
