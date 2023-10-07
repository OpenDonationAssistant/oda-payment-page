import { Link } from "react-router-dom";
export default function Footer({ nickname }) {
  return (
    <div className="card-footer">
      <div className="footer-warning">
        {nickname} - российский игровой стример. Эта страница для сбора
        пожертвований на развитие и поддержку канала
      </div>
      <div className="mt-2 hstack gap-2">
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
