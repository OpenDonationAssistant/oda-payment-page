import React, { useRef, useState } from "react";
import { PaymentController } from "../../../../logic/payment/PaymentController";

export default function MessageInput({
  paymentController,
}: {
  paymentController: PaymentController;
}) {
  const [textCounter, setTextCounter] = useState(0);
  const [description, setDescription] = useState("");
  const [inputHeight, setInputHeight] = useState<number>(150);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  function handleMessage(text: string) {
    let newValue = text.slice(0, 300);
    setDescription(text);
    setTextCounter(text.length);
    const scrollHeight = descriptionInputRef.current?.scrollHeight ?? 150;
    setInputHeight(scrollHeight > 150 ? scrollHeight : 150);
    paymentController.text = newValue;
  }

  return (
    <>
      <div className="row col-12 mt-2 position-relative">
        <span className="material-symbols-sharp left-icon">chat</span>
        <textarea
          ref={descriptionInputRef}
          id="description-input"
          className="form-control"
          value={description}
          placeholder="Ваше сообщение"
          maxLength={300}
          style={{ height: inputHeight + "px"}}
          onChange={(e) => {
            handleMessage(e.target.value);
          }}
        />
        <div className="counter-text">{textCounter} / 300</div>
      </div>
    </>
  );
}
