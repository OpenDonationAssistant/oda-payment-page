import scriptjs from "scriptjs";
import "./Payment.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLoaderData } from "react-router-dom";
import { useEffect } from "react";
import API from "../../api";
import PaymentInfo from "../PaymentInfo/PaymentInfo";

export async function loader({ params }) {
  let payment = await API.get(`payment/${params.paymentId}`).then((json) => {
    return json.data[0];
  });

  return { payment };
}

export default function Payment() {
  const { payment } = useLoaderData();

  useEffect(() => {
    let inited = false;
    scriptjs(
      "https://yookassa.ru/checkout-widget/v1/checkout-widget.js",
      function () {
        if (!inited) {
          let paymentForm = new window.YooMoneyCheckoutWidget({
            confirmation_token: payment.confirmationToken,
            return_url: `${process.env.REACT_APP_ROOT}/payment/${payment.id}/result`,
            error_callback: function (error) {
              console.error(error);
            },
          });
          paymentForm.render("payment-form");
        }
      }
    );
    return () => {
      inited = true;
    };
  }, [payment]);

  return (
    <div className="h-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-lg rounded">
        <div className="payment-page card-header pb-4 pt-4 ps-4 align-middle">
          <div id="payment-container">
            <PaymentInfo
              amount={payment.amount.amount}
              currency={payment.amount.currency}
            />
            <div id="payment-form"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
