import React, { useState } from "react";

interface MediaData {
  originId: string;
  thumbnail: string;
}

interface MediaProps {
  data: MediaData;
  deleteHandler: Function;
}

export default function Media({ data, deleteHandler }: MediaProps) {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  return (
    <>
      <div className="preview-container-with-delete-button">
      <div className={`preview-container mt-2 `}>
        <div
          className={`media-item ${collapsed ? "bordered" : "top-bordered"}`}
          onClick={() => setCollapsed((oldValue) => !oldValue)}
        >
          <span className="media-item-icon material-symbols-sharp">
            smart_display
          </span>
          <span className="media-title">{data.title}</span>
          <span className="media-item-collapse material-symbols-sharp">
            {collapsed ? "expand_more" : "expand_less"}{" "}
          </span>
        </div>
        <div className={`${collapsed ? "hidden" : ""} media-preview`}>
          <iframe
            height="200"
            src={`https://www.youtube.com/embed/${data.originId}?autoplay=0`}
          />
        </div>
      </div>
      <span
        className="media-item-delete material-symbols-sharp"
        onClick={deleteHandler}
      >
        delete
      </span>
      </div>
    </>
  );
}
