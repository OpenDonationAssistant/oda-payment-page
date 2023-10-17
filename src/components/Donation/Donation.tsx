import React from "react";
import { useState, useEffect } from "react";
import Media from "../Media/Media";
import Footer from "../Footer/Footer";
import "./Donation.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import CookieConsent from "react-cookie-consent";
import axios from "axios";

var expression =
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
var urlRegex = new RegExp(expression);

export default function Donation({
  recipientId,
  mediaRequestsEnabled,
  streamerName,
}) {
  const [treshold, setTreshold] = useState(40);
  const [amount, setAmount] = useState(treshold);
  const [incorrectAmountError, setIncorrectAmountError] = useState(null);
  const [incorrectMediaError, setIncorrectMediaError] = useState(null);
  const [newMedia, setNewMedia] = useState("");
  const [nickname, setNickname] = useState(() => {
    const saved = localStorage.getItem("nickname");
    return saved || "";
  });
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [addedMedia, setAddedMedia] = useState([]);
  const navigate = useNavigate();
  const [mediaSuggestions, setMediaSuggestions] = useState([]);
  const [showMediaAutocomplete, setShowMediaAutocomplete] = useState(false);
  const [textCounter, setTextCounter] = useState(0);

  useEffect(() => {
    const timeOutId = setTimeout(() => handleMediaQuery(newMedia), 250);
    return () => clearTimeout(timeOutId);
  }, [newMedia]);

  function checkAmount(size, amount) {
    let paymentForAttachments = size * 100;
    let treshold = 40 > paymentForAttachments ? 40 : paymentForAttachments;
    let isIncorrect = amount < treshold;
    setTreshold(treshold);
    return { treshold, isIncorrect };
  }

  function handleMediaQuery(query) {
    if (query === null || query === "") {
      return;
    }
    if (query.match(urlRegex)) {
      addMedia(query);
      return;
    }
    console.log("Started handleMedia");
    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/media/available?query=${query}`,
      )
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        setMediaSuggestions(data);
        setShowMediaAutocomplete(true);
      });
  }

  function addMedia(url) {
    if (url === null || url === "") {
      setIncorrectMediaError(
        "Для добавления трека нужна корректная ссылка на Youtube видео",
      );
      return;
    }
    setShowMediaAutocomplete(false);
    axios
      .put(`${process.env.REACT_APP_API_ENDPOINT}/media`, {
        url: url,
        recipientId: recipientId,
      })
      .then((json) => {
        let updated = [...attachments, json.data];
        setAttachments(updated);
        validateAmount(updated, amount);
        setNewMedia("");
        setAddedMedia([...addedMedia, json.data.id]);
        console.log(addedMedia);
      })
      .catch(function (error) {
        console.log(error);
        const message = error.response.data;
        if (Object.prototype.toString.call(message) == "[object String]") {
          setIncorrectMediaError(message);
        } else {
          setIncorrectMediaError(
            "Для добавления трека нужна корректная ссылка на Youtube видео",
          );
        }
      });
  }

  function updateAmountError(treshold) {
    setIncorrectAmountError(
      `Сумма доната должна быть больше минимальной: \u20BD${treshold}`,
    );
  }

  function validateAmount(updated, amount) {
    let { treshold, isIncorrect } = checkAmount(updated.length, amount);
    if (incorrectAmountError !== null || (amount !== "" && amount !== null)) {
      if (isIncorrect) {
        updateAmountError(treshold);
      } else {
        setIncorrectAmountError(null);
      }
    }
  }

  async function pay() {
    let { treshold, isIncorrect } = checkAmount(attachments.length, amount);
    if (isIncorrect) {
      updateAmountError(treshold);
      return;
    }
    window.gtag("event", "init_payment");
    try {
      let response = await axios.put(
        `${process.env.REACT_APP_API_ENDPOINT}/payment`,
        {
          id: uuidv4(),
          senderName: nickname,
          message: description,
          amount: {
            amount: amount,
            currency: "RUB",
          },
          attachments: addedMedia,
          recipientId: recipientId,
        },
      );
      navigate(`/payment/${response.data.id}`);
    } catch (err) {
      // setIncorrectMediaError(
      //   "Для добавления трека нужна корректная ссылка на Youtube видео"
      // );
    }
  }

  return (
    <div className="page-content-container h-100 d-flex align-items-center justify-content-center">
      <div id="page-card" className="rounded-top-4 card shadow-lg">
        <div className="rounded-4 card-header pb-4 pt-4 ps-4 text-bg-dark align-middle">
          <div className="row">
            <div className="d-none d-md-block col-3">
              <img
                src={`${recipientId}.png`}
                className="logo img-fluid rounded-2"
                alt="Streamer logo"
              />
            </div>
            <div className="row col-sm-9">
              <div id="recipient-title">
                Для <span>{streamerName}</span> на развитие канала
              </div>
              <div>
                <span id="donation-title">Донат </span>
                <span id="currency-sign">{`\u20BD`}</span>
                <input
                  id="amount-input"
                  autoFocus={true}
                  className={`text-start  ms-2 fw-bolder ${
                    incorrectAmountError ? "is-invalid" : ""
                  }`}
                  value={amount}
                  type="number"
                  placeholder="0"
                  autoComplete="off"
                  onChange={(e) => {
                    let value = e.target.value;
                    setAmount(value);
                    validateAmount(attachments, value);
                  }}
                />
              </div>
              <div id="min-sum-title">
                <span className="no-wrap">Минимальная сумма:</span>{" "}
                <button
                  id="min-sum-button"
                  className="btn btn-link"
                  tabIndex="-1"
                  onClick={() => {
                    setIncorrectAmountError(null);
                    setAmount(treshold);
                  }}
                >
                  {`\u20BD${treshold}`}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div id="data-panel" className="container rounded-bottom-0 rounded-3">
          <div className="col-12 mt-2 position-relative">
            <div className="row col-12">
              <input
                className="form-control"
                value={nickname}
                placeholder="Аноним"
                type=""
                autoComplete="off"
                onChange={(e) => {
                  setNickname(e.target.value);
                  localStorage.setItem("nickname", e.target.value);
                }}
              />
            </div>
            <span
              className="material-symbols-sharp media-info-icon"
              data-tooltip-id="nickname-gif-tooltip"
            >
              info
            </span>
            <Tooltip
              id="nickname-gif-tooltip"
              place="right"
              variant="info"
              content={
                <>
                  <div>
                    <div className="mt-2 nickname-gif-container">
                      <img
                        src="/nickname-gif-info.gif"
                        className="media-gif"
                        height={200}
                        width={250}
                      ></img>
                    </div>
                    <div className="mt-2 media-gif-text">
                      Текст доната отобразится на стриме, вместе с указанным
                      именем (как в примере в гиф)
                    </div>
                  </div>
                </>
              }
              className="nickname-gif-tooltip"
            />
          </div>
          <div className="row col-12 mt-2 position-relative">
            <textarea
              id="description-input"
              className="form-control"
              value={description}
              rows={6}
              placeholder="Ваше сообщение"
              onChange={(e) => {
                let newValue = e.target.value.slice(0, 300);
                setDescription(newValue);
                setTextCounter(newValue.length);
              }}
            />
            <div className="counter-text">{textCounter} / 300</div>
          </div>
          {!mediaRequestsEnabled && (
            <>
              <div className="col-12  row mt-2 alert alert-warning">
                Заказы музыки временно приостановлены.
              </div>
            </>
          )}
          {mediaRequestsEnabled && (
            <div className="col-12 mt-2 position-relative">
              <div className="row col-12 mt-2 media-container">
                <input
                  id="media-url-input"
                  hidden={attachments.length >= 12 ? true : false}
                  className={
                    incorrectMediaError
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  value={newMedia}
                  onFocus={() => {
                    setIncorrectMediaError(null);
                  }}
                  onChange={(e) => {
                    setNewMedia(e.target.value);
                  }}
                  autoComplete="off"
                  placeholder={
                    attachments.length === 0
                      ? "Ссылка на YouTube"
                      : // ? "Введите название видео или вставьте ссылку на youtube"
                        "Можете добавить еще видео. Максимум 12 штук"
                  }
                  data-tooltip-id="media-tooltip"
                />
                <Tooltip
                  id="media-tooltip"
                  place="top"
                  variant="info"
                  content="инстасамку/мейбибейби/гаязов за 10000, но как вы понимаете, лучше вообще без них"
                  className="tooltip"
                />
                {showMediaAutocomplete && (
                  <div className="media-suggestions-popup">
                    {mediaSuggestions.map((data, number) => {
                      return (
                        <button
                          key={number}
                          className="media-suggestions-item"
                          onClick={() =>
                            addMedia(`https://youtube.com/watch?v=${data.id}`)
                          }
                        >
                          <img src={data.snippet.thumbnails.default.url} />
                          <div className="media-suggestions-description">
                            <div className="media-suggestions-title">
                              {data.snippet.title}
                            </div>
                            <div className="media-suggestions-channel">
                              {data.snippet.channelTitle}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <span
                className="material-symbols-sharp media-info-icon"
                data-tooltip-id="media-gif-tooltip"
              >
                info
              </span>
              <Tooltip
                id="media-gif-tooltip"
                place="right"
                variant="info"
                content={
                  <>
                    <div>
                      <div className="mt-2 media-gif-container">
                        <img
                          src="/media-gif-info.gif"
                          className="media-gif"
                          height={200}
                          width={250}
                        ></img>
                      </div>
                      <div className="mt-2 media-gif-text">
                        Если вы добавите ссылки на музыку с YouTube, стример по
                        желанию может включить заказанную музыку, она проиграет
                        на стриме. И отобразится, как показано на гиф.
                      </div>
                    </div>
                  </>
                }
                className="media-gif-tooltip"
              />
            </div>
          )}
          <div className="invalid-feedback">{incorrectMediaError}</div>
          <div className="media">
            {attachments
              .filter((data) => data != null)
              .map((data, number) => {
                return (
                  <Media
                    key={number}
                    data={data}
                    deleteHandler={() => {
                      let updated = attachments
                        .slice(0, number)
                        .concat(attachments.slice(number + 1));
                      let updatedAddedMedia = addedMedia
                        .slice(0, number)
                        .concat(attachments.slice(number + 1));
                      setAttachments(updated);
                      setAddedMedia(updatedAddedMedia);
                      validateAmount(updated, amount);
                    }}
                  />
                );
              })}
          </div>
          <div className="row col-12 mt-3" style={{ rowGap: "10px" }}>
            <button
              id="pay-button"
              className="btn btn-dark"
              disabled={incorrectAmountError != null}
              onClick={pay}
            >
              Задонатить &#x20BD;{amount ? amount : 0}
            </button>
            <div id="confirmation-text" className="col">
              <div className="confirmation-text-part">
                {incorrectAmountError
                  ? incorrectAmountError
                  : `Вы отправляете донат как ${
                      nickname ? nickname : "Аноним"
                    }${description && attachments.length > 0 ? "" : ", "}`}
                {incorrectAmountError
                  ? ""
                  : `${description ? "" : "без сообщения"} ${
                      !description && attachments.length === 0
                        ? "и"
                        : attachments.length > 0
                        ? ""
                        : "без"
                    } ${attachments.length > 0 ? "" : "треков"} `}
              </div>
            </div>
          </div>
        </div>

        <Footer nickname={streamerName} />
        <CookieConsent
          location="bottom"
          buttonText="Accept"
          cookieName="oda-cookie-consent"
          style={{ background: "rgb(33, 37, 41)" }}
          buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
          expires={150}
        >
          This website uses cookies to enhance the user experience.{" "}
        </CookieConsent>
      </div>
    </div>
  );
}