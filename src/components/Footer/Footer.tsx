import React from "react";

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
    </div>
  );
}
