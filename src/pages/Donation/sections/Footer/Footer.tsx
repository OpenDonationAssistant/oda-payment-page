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
      </div>
    </div>
  );
}
