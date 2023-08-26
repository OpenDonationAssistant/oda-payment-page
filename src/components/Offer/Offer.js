export default function Offer() {
  return (
    <div class="h-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-lg rounded">
        <div className="card-header pb-4 pt-4 ps-4 align-middle">
          <div>
            <h2>Оферта о договоре пожертвования</h2>
            <div>10 августа 2023, Санкт-Петербург</div>
            <ol>
              <li>
                Оферта адресована донорам – любым юридическим и физическим
                лицам.
              </li>
              <li>Предмет — договор пожертвования.</li>
              <li>
                Сумма пожертвования определяется донором в приложении к оферте.
              </li>
              <li>
                Назначение пожертвования – поддержка деятельности стримера{" "}
                {process.env.REACT_APP_FIO} (
                {process.env.REACT_APP_RECIPIENT_NAME})
              </li>
              <li>
                Договор пожертвования заключается путем акцепта оферты донором.
                Оферта акцептуется перечислением{" "}
                {process.env.REACT_APP_RECIPIENT_NAME} денежных средств с
                помощью платежной формы на сайте{" "}
                {process.env.REACT_APP_RECIPIENT_ID}.oda.digital
              </li>
              <li>
                Датой акцепта оферты и датой заключения договора пожертвования
                является дата поступления денежных средств донора на расчетный
                счет
              </li>
              <li>
                Оферта вступает в силу со дня публикации на сайте{" "}
                {process.env.REACT_APP_RECIPIENT_ID}.oda.digital. В оферту могут
                быть внесены изменения и дополнения, вступающие на следующий
                день с момента публикации на сайте. Оферта действует бессрочно.
              </li>
              <li>
                {process.env.REACT_APP_RECIPIENT_NAME} не платит НДС поскольку
                применяется упрощенная система налогооблажения
              </li>
              <li>Стороны договора не подписывают акты</li>
              <div className="mt-4">
                <div>ФИО: {process.env.REACT_APP_FIO} </div>
                <div>ИНН: {process.env.REACT_APP_INN} </div>
                <div>E-mail: {process.env.REACT_APP_EMAIL}</div>
              </div>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
