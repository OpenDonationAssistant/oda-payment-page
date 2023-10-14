import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink, useLoaderData } from "react-router-dom";
import "./PaymentResult.css";
import API from "../../api";
import { useEffect } from "react";

export async function loader({ params }) {
  let payment = await API.patch(`payment/${params.paymentId}`).then((json) => {
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
