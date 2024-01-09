import React from "react";
import CookieConsent from "react-cookie-consent";
import { Link } from "react-router-dom";

export default function CookiePopup({}){
  return (
    <>
        <CookieConsent
          location="bottom"
          buttonText="Accept"
          cookieName="oda-cookie-consent"
          style={{ background: "rgb(33, 37, 41)" }}
          buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
          expires={150}
        >
          Сайт использует cookie для улучшения пользовательского опыта и для
          сбора обезличенных данных для аналитики (см.{" "}
          <a href="https://policies.google.com/privacy?hl=ru">
            Google Privacy Policy
          </a>
          ). Используя сайт, вы соглашаетесь с{" "}
          <Link to="/offer">Пользовательским соглашением</Link>, а также с{" "}
          <a href="https://www.youtube.com/t/terms">YouTube Terms of Service</a>
          .
        </CookieConsent>
    </>
  );
}
