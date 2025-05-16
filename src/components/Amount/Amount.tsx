import React from "react";

export default function Amount({ amount }: { amount: number }) {
  return <span>{`${amount}\u20BD`}</span>;
}
