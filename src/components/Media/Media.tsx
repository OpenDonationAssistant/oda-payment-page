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
    <div className="position-relative d-inline-block me-2 mt-2">
      <img src={data.thumbnail} className="rounded rounded-2 preview-image" />
      <button
        className="remove-media-button material-symbols-sharp position-absolute top-0 end-0 rounded-circle"
        onClick={deleteHandler}
      >
        close
      </button>
    </div>
  );
}
