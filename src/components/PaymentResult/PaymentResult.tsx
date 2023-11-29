import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink, Params, useLoaderData } from "react-router-dom";
import "./PaymentResult.css";
import { useEffect } from "react";
import axios from "axios";

export async function loader({ params }: { params: Params<"paymentId"> }) {
  let payment = await axios
    .patch(`${process.env.REACT_APP_API_ENDPOINT}/payment/${params.paymentId}`)
    .then((json) => {
      return json.data;
    });

  return { payment };
}

function success() {
  return (
    <div id="paymentResultContainer">
      <div className="row mt-4 justify-content-center">
        <img id="heart" src="/4cbKRjrzi.png" />
      </div>
      <div className="mt-4 justify-content-center">
        <div className="text-center mt-4">Спасибо за вашу поддержку!</div>
        <div className="text-center mb-5">
          Ваш перевод прошел успешно, ждите алерт на стриме!
        </div>
      </div>
      <div className="text-center">
        <NavLink
          to="/"
          className="col-12 btn btn-warning mb-4 text-uppercase border"
        >
          Поддержать еще
        </NavLink>
      </div>
    </div>
  );
}

function failure() {
  return (
    <div id="paymentResultContainer">
      <div className="row mt-4 justify-content-center">
        <img id="heart" src="/warning.jpg" />
      </div>
      <div className="mt-4 justify-content-center">
        <div className="text-center mt-4 mb-5">Payment failed, try again</div>
      </div>
      <div className="text-center">
        <NavLink
          to="/"
          className="col-12 btn btn-warning mb-4 text-uppercase border"
        >
          Try again
        </NavLink>
      </div>
    </div>
  );
}

export default function PaymentResult() {
  const { payment } = useLoaderData();

  useEffect(() => {
    window.gtag("event", "payment_finished");
  });

  return (
    <div className="h-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-lg rounded">
        <div className="result-page card-header pb-4 pt-4 ps-4 align-middle">
          {payment.status == "PAID" ? success() : failure()}
        </div>
      </div>
    </div>
  );
}
