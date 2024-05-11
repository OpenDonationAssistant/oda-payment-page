import React, { useState } from "react";
import { PaymentController } from "../../../../logic/payment/PaymentController";
import { Tooltip } from "react-tooltip";
import { useSearchParams } from "react-router-dom";

export default function NicknameInput({
  paymentController,
}: {
  paymentController: PaymentController;
}) {
  const [params] = useSearchParams();
  const [nickname, setNickname] = useState(() => {
    const nickname = params.get("nickname");
    if (nickname) {
      return nickname;
    }
    const saved = localStorage.getItem("nickname");
    paymentController.nickname = saved || "";
    return saved || "";
  });

  return (
    <>
      <div className="col-12 mt-2 position-relative">
        <span className="material-symbols-sharp left-icon">person</span>
        <div className="row col-12">
          <input
            id="nickname-input"
            className="form-control"
            value={nickname}
            placeholder="Аноним"
            type=""
            autoComplete="off"
            onChange={(e) => {
              setNickname(e.target.value);
              localStorage.setItem("nickname", e.target.value);
              paymentController.nickname = e.target.value;
            }}
          />
        </div>
        <span
          className="material-symbols-sharp media-info-icon"
          data-tooltip-id="nickname-gif-tooltip"
        >
          help
        </span>
        <Tooltip
          id="nickname-gif-tooltip"
          place="right"
          variant="info"
          content={
            <>
              <div>
                <div className="mt-2 nickname-gif-container">
                  <img
                    src="/nickname-gif-info.gif"
                    className="media-gif"
                    height={200}
                    width={250}
                  ></img>
                </div>
                <div className="mt-2 media-gif-text">
                  Текст доната отобразится на стриме, вместе с указанным именем
                  (как в примере в гиф)
                </div>
              </div>
            </>
          }
          className="nickname-gif-tooltip"
        />
      </div>
    </>
  );
}
