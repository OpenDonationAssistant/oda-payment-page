import React, { useEffect, useState } from "react";
import { PaymentController } from "../../../../logic/payment/PaymentController";

export default function AmountInput({
  streamerName,
  recipientId,
  paymentController,
}: {
  streamerName: string;
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
      <style
        dangerouslySetInnerHTML={{
          __html: `#streamer-logo::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: -1;
  display: block;
  background-image: url(${process.env.REACT_APP_CDN_ENDPOINT}/logo-${recipientId}.png);
  background-size:cover;
  border-radius: var(--bs-border-radius) !important;
  width: 100%;
  height: 100%;
}`,
        }}
      />
      <div className="card-header ps-4 text-bg-dark align-middle">
        <div id="recipient-title">
          Для{" "}
          <a className="stream-link" href={`https://twitch.tv/${streamerName}`}>
            {streamerName}
          </a>{" "}
          на развитие канала
        </div>
        <div style={{ display: "flex" }}>
          <div id="streamer-logo" className="logo img-fluid rounded-2"/>
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
