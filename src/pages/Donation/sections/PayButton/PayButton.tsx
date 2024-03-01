import React, { useEffect, useState } from "react";
import { PaymentController } from "../../../../logic/payment/PaymentController";
import { Link, useNavigate } from "react-router-dom";

export default function PayButton({
  paymentController,
}: {
  paymentController: PaymentController;
}) {
  const [nickname, setNickname] = useState<string>(paymentController.nickname);
  const [amount, setAmount] = useState<number>(paymentController.amount);
  const [description, setDescription] = useState<string>(
    paymentController.text,
  );
  const [attachments, setAttachments] = useState(paymentController.attachments);
  const [error, setError] = useState<string | null>(paymentController.error);
  const navigate = useNavigate();

  useEffect(() => {
    paymentController.addListener({
      setNickname: setNickname,
      setText: setDescription,
      setAmount: setAmount,
      setAttachments: setAttachments,
      setError: setError,
      setTreshold: () => {},
    });
  }, [paymentController]);

  return (
    <>
      <div className="row col-12 mt-3" style={{ rowGap: "10px" }}>
        <button
          id="pay-button"
          className="btn btn-dark clickable-button"
          disabled={error != null}
          onClick={() => {
            const result = paymentController.pay();
            result.then(data => navigate(`/payment/${data.data.id}`));
          }}
        >
          Задонатить {amount ? amount : 0}&#x20BD;
        </button>
        <div id="confirmation-text" className="col">
          {error
            ? error
            : `Вы отправляете донат как ${nickname ? nickname : "Аноним"}${
                description && attachments.length > 0 ? "" : ", "
              }`}
          {error
            ? ""
            : `${description ? "" : "без сообщения"} ${
                !description && attachments.length === 0
                  ? "и"
                  : attachments.length > 0
                  ? ""
                  : "без"
              } ${attachments.length > 0 ? "" : "треков"}`}
        </div>
      </div>
    </>
  );
}
