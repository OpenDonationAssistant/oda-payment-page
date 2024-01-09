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
      setTreshold: setTreshold
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
      setAmountInputWidth(200);
    }
    if (amount >= 1000000) {
      setAmountInputWidth(220);
    }
  }

  return (
    <>
      <div className="rounded-4 card-header pb-4 pt-4 ps-4 text-bg-dark align-middle">
        <div id="recipient-title">
          Для <span>{streamerName}</span> на развитие канала
        </div>
        <div style={{ display: "flex" }}>
          <img
            id="streamer-logo"
            src={`${process.env.REACT_APP_CDN_ENDPOINT}/logo-${recipientId}.png`}
            className="logo img-fluid rounded-2"
            alt="Streamer logo"
          />
          <div id="amount-container">
            <span id="donation-title">Донат</span>
            <div>
              <input
                id="amount-input"
                autoFocus={true}
                className={error ? "is-invalid" : ""}
                style={{ width: `${amountInputWidth}px` }}
                value={amount}
                type="number"
                placeholder="0"
                autoComplete="off"
                onChange={(e) => {
                  let value = Number(e.target.value);
                  paymentController.amount = value;
                  updateAmountInputWidth(value);
                }}
              />
              <span id="currency-sign">{`\u20BD`}</span>
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
            {`\u20BD${treshold}`}
          </button>
        </div>
      </div>
    </>
  );
}
