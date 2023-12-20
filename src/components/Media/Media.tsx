import React from "react";

interface MediaData {
  originId: string;
  thumbnail: string;
}

interface MediaProps {
  data: MediaData;
  deleteHandler: Function;
}

export default function Media({ data, deleteHandler }: MediaProps) {
console.log(data);
  return (
    <div className="preview-container position-relative d-inline-block me-2 mt-2">
      <iframe height="200" src={`https://www.youtube.com/embed/${data.originId}?autoplay=0`}/>
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
