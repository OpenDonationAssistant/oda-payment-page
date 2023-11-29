import React from "react";

interface PaymentInfoProps {
  nickname: string;
  amount: string;
  currency: string;
}

export default function PaymentInfo({
  nickname,
  amount,
  currency,
}: PaymentInfoProps) {
  return (
    <div>
      <h5 id="payment-title" className="text-center">
        Перевод
      </h5>
      <div id="payment-info" className="row font-monospace ">
        <div className="col-sm-11 hstack gap-2 ps-4">
          <div className="fw-bold"> Получатель: </div>
          <div className="text-end ms-auto">{nickname}</div>
        </div>
        <div className="col-sm-11 hstack gap-2 ps-4">
          <div className="col-4 fw-bold"> Сумма: </div>
          <div className="col-6 text-end ms-auto">
            {" "}
            {amount} {currency}{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
