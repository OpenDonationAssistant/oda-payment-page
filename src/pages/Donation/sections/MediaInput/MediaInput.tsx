import React, { useEffect, useRef, useState } from "react";
import { PaymentController } from "../../../../logic/payment/PaymentController";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import Media from "../../../../components/Media/Media";

var expression =
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
var urlRegex = new RegExp(expression);

export default function MediaInput({
  recipientId,
  mediaRequestsDisabledPermanently,
  mediaRequestsEnabled,
  paymentController,
  tooltip,
}: {
  recipientId: string;
  mediaRequestsDisabledPermanently: boolean;
  mediaRequestsEnabled: boolean;
  paymentController: PaymentController;
  tooltip: string;
}) {
  const [attachments, setAttachments] = useState([]);
  const [mediaSuggestions, setMediaSuggestions] = useState([]);
  const [showMediaAutocomplete, setShowMediaAutocomplete] = useState(false);
  const mediaSuggestionsRef = useRef<HTMLDivElement>(null);
  const [newMedia, setNewMedia] = useState("");
  const [incorrectMediaError, setIncorrectMediaError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        mediaSuggestionsRef.current &&
        !mediaSuggestionsRef.current.contains(event.target)
      ) {
        setShowMediaAutocomplete(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mediaSuggestionsRef]);

  useEffect(() => {
    const timeOutId = setTimeout(() => handleMediaQuery(newMedia), 250);
    return () => clearTimeout(timeOutId);
  }, [newMedia]);

  function handleMediaQuery(query: string) {
    if (query === null || query === "") {
      setShowMediaAutocomplete(false);
      return;
    }
    if (query.match(urlRegex)) {
      setShowMediaAutocomplete(false);
      addMedia(query);
      return;
    }
    if (query.length < 5) {
      setShowMediaAutocomplete(false);
      return;
    }
    const apiUrl = window.location.hostname.endsWith(
      process.env.REACT_APP_DOMAIN ?? "localhost",
    )
      ? process.env.REACT_APP_MEDIA_API_ENDPOINT
      : `https://${window.location.hostname}`;
    axios
      .get(`${apiUrl}/media/available?query=${query}`)
      .then((response) => response.data)
      .then((data) => {
        setMediaSuggestions(data);
        setShowMediaAutocomplete(true);
      });
  }

  function addMedia(url: string) {
    setShowMediaAutocomplete(false);
    const apiUrl = window.location.hostname.endsWith(
      process.env.REACT_APP_DOMAIN ?? "localhost",
    )
      ? process.env.REACT_APP_MEDIA_API_ENDPOINT
      : `https://${window.location.hostname}`;
    axios
      .put(`${apiUrl}/media/video`, {
        url: url,
        recipientId: recipientId,
      })
      .then((json) => {
        let updated = [...attachments, json.data];
        setAttachments(updated);
        setNewMedia("");
        paymentController.attachments = updated;
      })
      .catch(function (error) {
        const message = error.response.data;
        if (Object.prototype.toString.call(message) == "[object String]") {
          setIncorrectMediaError(message);
          paymentController.error = message;
        } else {
          const errorMessage =
            "Для добавления трека нужна корректная ссылка на Youtube видео";
          setIncorrectMediaError(errorMessage);
        }
      });
  }

  return (
    <>
      {!mediaRequestsDisabledPermanently && (
        <>
          {!mediaRequestsEnabled && (
            <>
              <div className="col-12  row mt-2 alert alert-warning">
                Реквесты музыки временно приостановлены.
              </div>
            </>
          )}
          {mediaRequestsEnabled && (
            <div className="col-12 mt-2 position-relative">
              <span className="material-symbols-sharp left-icon">search</span>
              <div className="row col-12 mt-2 media-container">
                {tooltip && (
                  <Tooltip
                    id="media-url-tooltip"
                    place="top"
                    variant="info"
                    content={tooltip}
                    className="media-url-tooltip"
                  />
                )}
                <input
                  id="media-url-input"
                  data-tooltip-id="media-url-tooltip"
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
                      ? "Название видео или ссылка на youtube или vk video"
                      : "Можете добавить еще видео. Максимум 12 штук"
                  }
                />
                {showMediaAutocomplete && (
                  <div
                    ref={mediaSuggestionsRef}
                    className="media-suggestions-popup"
                  >
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
                help
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
        </>
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
                  setAttachments(updated);
                  paymentController.attachments = updated;
                }}
              />
            );
          })}
      </div>
    </>
  );
}
