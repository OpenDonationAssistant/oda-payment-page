import React, { useState } from "react";

export default function EmailInput({}) {
  const [email, setEmail] = useState<string>(() => {
    return localStorage.getItem("email") ?? "";
  });

  function updateEmail(email: string) {
    setEmail(email);
    localStorage.setItem("email", email);
  }

  return (
    <>
      <div className="row col-12 mt-2 position-relative">
        <span className="material-symbols-sharp left-icon">alternate_email</span>
        <input
          value={email}
          className="form-control"
          id="email-input"
          autoComplete="off"
          placeholder="E-mail"
          onChange={(e) => updateEmail(e.target.value)}
        />
      </div>
    </>
  );
}
