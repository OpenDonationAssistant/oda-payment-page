import React from "react";

interface OfferProps {
  recipientId: string;
  nickname: string;
  fio: string;
  inn: string;
  email: string;
}

export default function Offer({
  recipientId,
  nickname,
  fio,
  inn,
  email,
}: OfferProps) {
  return (
    <div className="h-100 d-flex align-items-center justify-content-center">
      <style
        dangerouslySetInnerHTML={{
          __html: `.card.rounded {max-width: 1200px!important;}`,
        }}
      />
      <div
        className="card shadow-lg rounded"
      >
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
                Назначение пожертвования – поддержка деятельности стримера {fio}{" "}
                ({nickname})
              </li>
              <li>
                Договор пожертвования заключается путем акцепта оферты донором.
                Оферта акцептуется перечислением {nickname} денежных средств с
                помощью платежной формы на сайте {recipientId}.oda.digital
              </li>
              <li>
                Датой акцепта оферты и датой заключения договора пожертвования
                является дата поступления денежных средств донора на расчетный
                счет
              </li>
              <li>
                Оферта вступает в силу со дня публикации на сайте {recipientId}
                .oda.digital. В оферту могут быть внесены изменения и
                дополнения, вступающие на следующий день с момента публикации на
                сайте. Оферта действует бессрочно.
              </li>
              <li>
                {nickname} не платит НДС поскольку применяется упрощенная
                система налогооблажения
              </li>
              <li>Стороны договора не подписывают акты</li>
              <div className="mt-4">
                <div>ФИО: {fio} </div>
                <div>ИНН: {inn} </div>
                <div>E-mail: {email}</div>
              </div>
            </ol>
          </div>
          <h2>Условия использования сайта {recipientId}.oda.digital</h2>
          <ol>
            <li>
              {recipientId}.oda.digital использует YouTube API и Google
              Analytics. Используя и взаимодействуя с сайтом {recipientId}
              .oda.digital пользователь соглашается с условиями использования
              YouTube API Services (
              <a href="https://www.youtube.com/t/terms">
                https://www.youtube.com/t/terms
              </a>
              ) и Google Privacy Policy (
              <a href="https://policies.google.com/privacy?hl=ru">
                https://policies.google.com/privacy?hl=ru
              </a>
              ).
            </li>
            <li>
              Данные, полученные с помощью YouTube API (идентификатор контента,
              его содержимое, статистика и ограничения), используются для показа
              на стриме, проводимом {nickname}, и
              хранятся на сервере в обезличенном виде, т.е. без связи с
              конкретным пользователем.
            </li>
            <li>
              Сайт не собирает никаких данных пользователей, относящихся к
              YouTube, кроме поискового запроса, вводимого в явном виде в форму
              на сайте, и полученного с его помощью идентификатора контента.
            </li>
            <li>
              Сайт использует cookie для хранения прежде введеной пользователем
              информации (nickname в донате), что повышает удобство сайта для
              пользователя, и для работы сервиса Google Analytics (см Google
              Privacy Policy -{" "}
              <a href="https://policies.google.com/privacy?hl=ru">
                https://policies.google.com/privacy?hl=ru
              </a>
              ), что позволяет проводить аналитику для дальнейшего улучшения
              сервиса.
            </li>
          </ol>
          <div className="mt-4">
            <div>Контактные данные по техническим вопросам</div>
            <div>E-mail: stcarolas@gmail.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
