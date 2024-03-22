import React, { useEffect, useRef, useState } from "react";
import { PaymentController } from "../../../../logic/payment/PaymentController";
import { useNavigate } from "react-router-dom";
import classes from "./PayButton.module.css";

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
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<any>([
    {
      id: "1",
      mask: "*** 1234",
      issuer: "alfabank",
      system: "mir",
    },
    {
      id: "2",
      mask: "*** 2222",
      issuer: "tinkoff",
      system: "mastercard",
    },
    {
      id: "3",
      mask: "*** 3333",
      issuer: "vtb",
      system: "visa",
    },
  ]);

  const [choosenPaymentMethod, setChoosenPaymentMethod] = useState<string>("1");
  const popupRef = useRef(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

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

  function savedPaymentMethod(method) {
    return (
      <>
        <div
          key={method.id}
          className={`${classes.methodcontainer} ${
            method.id === choosenPaymentMethod
              ? classes.choosen
              : classes.notchoosen
          }`}
        >
          <svg
            className={classes.issuerlogo}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 28 41"
          >
            <path d="M27.2 35.4H.8v5.4h26.4v-5.4ZM18.842 4.944C18.086 2.694 17.216.918 14.24.918c-2.976 0-3.9 1.8-4.698 4.026L1.364 28.2h5.4l1.89-5.532h10.44L20.87 28.2h5.766L18.842 4.944ZM10.256 18l3.708-11.022h.138L17.6 18h-7.344Z"></path>
          </svg>
          <div className={classes.mask}>{method.mask}</div>
          <svg fill="none" viewBox="0 0 24 14" className={classes.systemlogo}>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.412 5.53c.01-1.49 1.36-2.53 3.276-2.53.748 0 1.348.166 1.815.34l-.34 1.623c-.869-.408-1.635-.38-1.913-.343-.56.075-.816.367-.822.642-.02.903 2.725 1.014 2.717 3.035-.007 1.592-1.34 2.62-3.377 2.62-.867-.01-1.704-.194-2.156-.407l.35-1.678c.452.215 1.018.5 1.993.484.558-.009 1.155-.235 1.16-.75.003-.335-.25-.576-1.005-.95-.735-.368-1.71-.982-1.698-2.085Zm8.367-2.39h1.655L24 10.797h-1.794l-.234-1.144h-2.488l-.404 1.144h-2.036l2.91-7.095a.882.882 0 0 1 .825-.562Zm.284 2.069-1.02 2.875h1.608l-.588-2.875ZM9.944 3.14h1.94l-1.605 7.657H8.34L9.944 3.14Zm-2.869 0h2.037L5.97 10.797H3.92l-1.546-6.11c-.094-.377-.175-.515-.46-.673C1.446 3.755.676 3.512 0 3.362l.046-.222h3.3c.42 0 .799.286.894.78l.817 4.432L7.075 3.14Z"
              fill="#C4C2BE"
            ></path>
          </svg>
        </div>
      </>
    );
  }

  function pay(type: string) {
    paymentController.pay(type)
      .then((data) => navigate(`/payment/${data.data.id}`));
  }

  return (
    <>
      <div className={`${classes.savedpaymentmethods} hidden`}>
        {savedPaymentMethods.map((method) => savedPaymentMethod(method))}
      </div>
      <div
        className={`${classes.paymentmethodpopup} ${showPopup ? "" : "hidden"}`}
      >
        <div
          ref={popupRef}
          className={`${classes.paymentmethodpanel}`}
          onClick={() => pay("bank_card")}
        >
          <div className={`${classes.paymentmethod}`}>
            <img className={`${classes.paymentmethodlogo}`} src="/visa.svg" />
            <div className={`${classes.paymentmethoddescription}`}>
              Банковские карты RUS
            </div>
          </div>
          <div className={`${classes.paymentmethod}`}>
            <img
              style={{ width: "50px" }}
              className={`${classes.paymentmethodlogo}`}
              src="/youmoney.jpg"
            />
            <div className={`${classes.paymentmethoddescription}`}>ЮMoney</div>
          </div>
          <div className={`${classes.paymentmethod}`}>
            <img
              className={`${classes.paymentmethodlogo}`}
              src="/sberpay.png"
            />
            <div className={`${classes.paymentmethoddescription}`}>SberPay</div>
          </div>
          <div className={`${classes.paymentmethod}`}>
            <img className={`${classes.paymentmethodlogo}`} src="/tinkof.png" />
            <div className={`${classes.paymentmethoddescription}`}>
              Tinkoff Pay
            </div>
          </div>
          <div className={`${classes.paymentmethod}`}>
            <img
              style={{ height: "60px" }}
              className={`${classes.paymentmethodlogo}`}
              src="/sbp.png"
            />
            <div className={`${classes.paymentmethoddescription}`}>СБП</div>
          </div>
        </div>
      </div>
      <div className="row col-12 mt-3" style={{ rowGap: "10px" }}>
        <button
          id="pay-button"
          className="btn btn-dark clickable-button"
          disabled={error != null}
          onClick={() => {
            setShowPopup(true);
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
