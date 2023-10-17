import React from "react";
import { Link } from "react-router-dom";

interface FooterProps {
  nickname: string;
}

export default function Footer({ nickname }: FooterProps) {
  return (
    <div className="card-footer">
      <div className="footer-warning">
        {nickname} - российский игровой стример. Эта страница для сбора
        пожертвований на развитие и поддержку канала
      </div>
      <div className="mt-2 hstack info-urls">
        <Link to="/offer" className="footer-link">
          Пользовательское соглашение
        </Link>
        <div className="footer-copyright ms-auto">
          <a className="footer-link" href="https://oda.digital/">
            Uses ODA
          </a>
        </div>
      </div>
    </div>
  );
}
