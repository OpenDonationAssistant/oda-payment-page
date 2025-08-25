import React, { useContext } from "react";
import classes from "./PaymentComponent.module.css";
import ODAIcon from "../../../icons/ODAIcon";
import { PaymentStoreContext } from "../../../stores/PaymentStore";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { PaymentPageConfigContext } from "../../../logic/PaymentPageConfig";

const PaymentComponent = observer(({}) => {
  const pageConfig = useContext(PaymentPageConfigContext);
  const payment = useContext(PaymentStoreContext);
  const navigate = useNavigate();

  return (
    <>
      <div className={`${classes.payment}`}>
        {pageConfig.useWidePage && (
          <div className={`${classes.paymentdescription}`}>
            <div>
              Вы отправляете донат как{" "}
              {payment.nickname && !payment.isAnonym
                ? payment.nickname
                : "Аноним"}
              .
            </div>
            <div className={`${classes.amountdescription}`}>
              <span>Сумма дарения</span>
              <span className={`${classes.line}`} />
              <span>
                {payment.amount}
                {` \u20BD`}
              </span>
            </div>
            <div>
              Выбрано треков:{" "}
              {payment.attachments.length ? payment.attachments.length : 0} .
            </div>
          </div>
        )}
        <div className={`${classes.paybuttoncontainer}`}>
          <ODAIcon />
          <div className={`${classes.paybuttons}`}>
            {payment.hasFiatGateway && (
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
            )}
            {payment.hasCryptoGateway && (
              <button
                className={`${classes.paybutton} ${payment.error ? classes.disabled : ""}`}
                disabled={payment.error ? payment.error.length > 0 : false}
                onClick={() =>
                  payment.pay({ type: "crypto" }).then((data) => {
                    const url = data.data.operationUrl as string;
                    if (url.startsWith("http")) {
                      window.location.href = url;
                    } else {
                      navigate(data.data.operationUrl);
                    }
                  })
                }
              >
                Поддержать криптовалютой
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
});

export default PaymentComponent;
