import React from "react";
import scriptjs from "scriptjs";
import "./Payment.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Params, useLoaderData } from "react-router-dom";
import { useEffect } from "react";
import PaymentInfo from "./sections/PaymentInfo/PaymentInfo";
import axios from "axios";

interface PaymentProps {
  nickname: string;
}

export async function loader({ params }: { params: Params<"paymentId"> }) {
  let payment = await axios
    .get(`${process.env.REACT_APP_API_ENDPOINT}/payments/${params.paymentId}`)
    .then((json) => {
      return json.data;
    });
  console.log(payment);

  return { payment };
}

export default function Payment({ nickname }: PaymentProps) {
  const { payment } = useLoaderData();

  useEffect(() => {
    let inited = false;
    scriptjs(
      "https://yookassa.ru/checkout-widget/v1/checkout-widget.js",
      function () {
        if (!inited) {
          let paymentForm = new window.YooMoneyCheckoutWidget({
            confirmation_token: payment.confirmation,
            return_url: `${window.location.href}/result`,
            // customization: {
            //     payment_methods: [payment.method]
            // },
            error_callback: function (error) {
              console.error(error);
            },
          });
          paymentForm.render("payment-form");
        }
      },
    );
    return () => {
      inited = true;
    };
  }, [payment]);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `#root {
    display: flex;
    align-items: center;
    justify-content: center;
    height: auto !important;
    padding: 10vh 0;
    min-height: 100vh;
          }`,
        }}
      />
      <div className="h-100 d-flex align-items-center justify-content-center">
        <div className="card shadow-lg rounded">
          <div className="payment-page card-header pb-4 pt-4 ps-4 align-middle">
            <div id="payment-container">
              <PaymentInfo
                amount={payment.amount.major}
                currency={payment.amount.currency}
                nickname={nickname}
              />
              <div id="payment-form"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
