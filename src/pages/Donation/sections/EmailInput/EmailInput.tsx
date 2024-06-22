import React from "react";

export default function EmailInput({}) {
  return (
    <>
      <div className="col-12 mt-2 position-relative"></div>
      <div className="row col-12 mt-2">
        <input className="form-control" id="email-input" autoComplete="off" placeholder="E-mail" />
      </div>
    </>
  );
}
