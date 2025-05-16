import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import Media from "../../../../components/Media/Media";
import { PaymentStoreContext } from "../../../../stores/PaymentStore";
import { PaymentPageConfigContext } from "../../../../logic/PaymentPageConfig";
import classes from "./Media.module.css";
import SearchIcon from "../../../../icons/SearchIcon";
import MediaItemComponent from "./MediaItemComponent";

var expression =
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
var urlRegex = new RegExp(expression);

export default function MediaInput({}: {}) {
  const [attachments, setAttachments] = useState([]);
  const [mediaSuggestions, setMediaSuggestions] = useState([]);
  const [showMediaAutocomplete, setShowMediaAutocomplete] = useState(false);
  const mediaSuggestionsRef = useRef<HTMLDivElement>(null);
  const [newMedia, setNewMedia] = useState("");
  const [incorrectMediaError, setIncorrectMediaError] = useState<string | null>(
    null,
  );

  const payment = useContext(PaymentStoreContext);
  const pageConfig = useContext(PaymentPageConfigContext);

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
      })
      .then((json) => {
        let updated = [...attachments, json.data];
        setAttachments(updated);
        setNewMedia("");
        payment.attachments = updated;
      })
      .catch(function (error) {
        const message = error.response.data;
        if (Object.prototype.toString.call(message) == "[object String]") {
          setIncorrectMediaError(message);
          payment.error = message;
        } else {
          const errorMessage =
            "Для добавления трека нужна корректная ссылка на Youtube видео";
          setIncorrectMediaError(errorMessage);
        }
      });
  }

  return (
    <>
      <div className={`${classes.tabcontent}`}>
        <div className={`${classes.media}`}>
          {!pageConfig.requestsDisabledPermanently && (
            <>
              {!pageConfig.requestsEnabled && (
                <>
                  <div className="col-12  row mt-2 alert alert-warning">
                    Реквесты музыки временно приостановлены.
                  </div>
                </>
              )}
              {pageConfig.requestsEnabled && (
                <div>
                  <div>
                    {pageConfig.tooltip && (
                      <Tooltip
                        id="media-url-tooltip"
                        place="top"
                        variant="info"
                        content={pageConfig.tooltip}
                        className="media-url-tooltip"
                      />
                    )}
                    <div className={`${classes.mediainputcontainer}`}>
                      <SearchIcon />
                      <input
                        data-tooltip-id="media-url-tooltip"
                        hidden={attachments.length >= 12 ? true : false}
                        className={`${
                          incorrectMediaError ? "is-invalid" : ""
                        } ${classes.mediainput}`}
                        value={newMedia}
                        onFocus={() => {
                          setIncorrectMediaError(null);
                        }}
                        onChange={(e) => {
                          setNewMedia(e.target.value);
                        }}
                        autoComplete="off"
                        placeholder="Название, ссылка Youtube или VKVideo"
                      />
                    </div>
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
                                addMedia(
                                  `https://youtube.com/watch?v=${data.id}`,
                                )
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
                </div>
              )}
            </>
          )}
          <div className="invalid-feedback">{incorrectMediaError}</div>
          <div className={`${classes.playlist}`}>
            {attachments
              .filter((data) => data != null)
              .map((data, number) => {
                return (
                  <MediaItemComponent
                    key={number}
                    data={data}
                    deleteHandler={() => {
                      let updated = attachments
                        .slice(0, number)
                        .concat(attachments.slice(number + 1));
                      setAttachments(updated);
                      payment.attachments = updated;
                    }}
                  />
                );
              })}
          </div>
        </div>
        <div className={`${classes.limit}`}>
          Маскимальное количество - 12 треков
        </div>
      </div>
    </>
  );
}
