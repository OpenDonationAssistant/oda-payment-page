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
      <div className="footer-links">
        <Link to="/offer" className="footer-link">
          Пользовательское соглашение
        </Link>
        <a href="https://oda.digital" className="footer-link" style={{ paddingRight: "1em"}}>
          ODA
        </a>
      </div>
    </div>
  );
}
