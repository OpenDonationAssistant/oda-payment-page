import React, { useEffect, useRef, useState } from "react";
import { PaymentController } from "../../../../logic/payment/PaymentController";
import {
  CharLimitTreshold,
  PaymentPageConfig,
} from "../../../../logic/PaymentPageConfig";

export default function MessageInput({
  paymentPageConfig,
  paymentController,
}: {
  paymentPageConfig: PaymentPageConfig;
  paymentController: PaymentController;
}) {
  const [textCounter, setTextCounter] = useState(0);
  const [description, setDescription] = useState("");
  const [inputHeight, setInputHeight] = useState<number>(150);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const [limit, setLimit] = useState<number>(calcCharLimit());

  useEffect(() => {
    paymentController.addListener({
      setNickname: () => {},
      setText: () => {},
      setAmount: () => {
        setLimit(calcCharLimit());
      },
      setAttachments: () => {},
      setError: () => {},
      setTreshold: () => {},
    });
  }, [paymentController]);


  // TODO: use reaction to paymentController.amount
  function calcCharLimit(): number {
    if (paymentPageConfig.charLimit.type === "fixed") {
      return paymentPageConfig.charLimit.value as number;
    }
    const tresholds = paymentPageConfig.charLimit.value as CharLimitTreshold[];
    return (
      tresholds
        .sort((a, b) => -(a.treshold - b.treshold))
        .find((value) => value.treshold <= paymentController.amount)?.limit ??
      300
    );
  }

  function handleMessage(text: string) {
    let newValue = text.slice(0, limit);
    setDescription(text);
    setTextCounter(text.length);
    const scrollHeight = descriptionInputRef.current?.scrollHeight ?? 150;
    setInputHeight(scrollHeight > 150 ? scrollHeight : 150);
    paymentController.text = newValue;
  }

  return (
    <>
      <div className="row col-12 mt-2 position-relative">
        <span id="chat-icon" className="material-symbols-sharp left-icon">
          chat
        </span>
        <textarea
          ref={descriptionInputRef}
          id="description-input"
          className="form-control"
          value={description}
          placeholder="Ваше сообщение"
          maxLength={limit}
          style={{ height: inputHeight + "px" }}
          onChange={(e) => {
            handleMessage(e.target.value);
          }}
        />
        <div className="counter-text">{textCounter} / {limit}</div>
      </div>
    </>
  );
}
