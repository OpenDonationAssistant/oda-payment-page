import React, { useState } from "react";

const url = `https://api.oda.digital/logs/feedback`;

function sendFeedback(feedback: string) {
  if (!feedback) {
    return;
  }
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify([{ message: feedback }]),
  }).then((response) => {
    console.log(response);
  });
}

export default function Feedback({}) {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  return (
    <>
      <div
        className={`feedback-message-container ${showPopup ? "" : "hidden"}`}
      >
        <textarea
          className="feedback-message"
          value={message}
          placeholder="Ваши идеи, предложения, замечания"
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="feedback-button-group">
          <button
            className="btn btn-dark"
            onClick={() => {
              setShowPopup(false);
              sendFeedback(message);
            }}
          >
            <span className="material-symbols-sharp">send</span>
            <span className="btn-text">Отправить</span>
          </button>
        </div>
      </div>
      <div className="feedback-container">
        <button
          className="btn"
          onClick={() => {
            setShowPopup((old) => !old);
          }}
        >
          <span className="material-symbols-sharp">rate_review</span>
          <span className="btn-text">Обратная связь</span>
        </button>
      </div>
    </>
  );
}
