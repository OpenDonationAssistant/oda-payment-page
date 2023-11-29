import React from "react";

interface MediaData {
  thumbnail: string;
}

interface MediaProps {
  data: MediaData;
  deleteHandler: Function;
}

export default function Media({ data, deleteHandler }: MediaProps) {
  return (
    <div className="preview-container position-relative d-inline-block me-2 mt-2">
      <img src={data.thumbnail} className="rounded rounded-2 preview-image" />
      <div className="button-overlay">
        <button
          className="remove-media-button material-symbols-sharp"
          onClick={deleteHandler}
        >
          close
        </button>
      </div>
    </div>
  );
}
