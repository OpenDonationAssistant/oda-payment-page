import React, { useContext } from "react";
import classes from "./PaymentComponent.module.css";
import ODAIcon from "../../../icons/ODAIcon";
import { PaymentStoreContext } from "../../../stores/PaymentStore";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

const PaymentComponent = observer(({}) => {
  const payment = useContext(PaymentStoreContext);
  const navigate = useNavigate();

  return (
    <>
      <div className={`${classes.payment}`}>
        {false && (
          <div className={`${classes.paymentdescription}`}>
            <div>Вы отправляете донат как Друг.</div>
            <div className={`${classes.amountdescription}`}>
              <span>Сумма дарения</span>
              <span className={`${classes.line}`} />
              <span>1150{` \u20BD`}</span>
            </div>
            <div>Выбрано 3 трека. Можно добавить еще 9 треков.</div>
          </div>
        )}
        <div className={`${classes.paybuttoncontainer}`}>
          <ODAIcon />
          <button
            className={`${classes.paybutton} ${payment.error ? classes.disabled : ""}`}
            disabled={payment.error ? payment.error.length > 0 : false}
            onClick={() =>
              payment.pay({ type: "fiat" }).then((data) => {
                const url = data.data.operationUrl as string;
                if (url.startsWith("http")) {
                  window.location.href = url;
                } else {
                  navigate(data.data.operationUrl);
                }
              })
            }
          >
            Поддержать на {`${payment.amount}\u20BD`}
          </button>
        </div>
      </div>
    </>
  );
});

export default PaymentComponent;
