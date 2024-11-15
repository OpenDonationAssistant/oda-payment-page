import React from "react";
import { Link } from "react-router-dom";
import { PaymentPageConfig } from "../../../../logic/PaymentPageConfig";
import Url from "../Url/Url";

interface FooterProps {
  config: PaymentPageConfig;
}

export default function Footer({ config }: FooterProps) {
  return (
    <div className="card-footer">
      <div className="footer-warning">
        <Url config={config} /> - российский игровой стример. Эта страница для
        сбора средств на развитие и поддержку канала
      </div>
      <div className="footer-links">
        <Link to="/offer" className="footer-link">
          Пользовательское соглашение
        </Link>
      </div>
    </div>
  );
}
