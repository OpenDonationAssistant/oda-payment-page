import { observer } from "mobx-react-lite";
import React from "react";

export const Amount = observer(({ amount }: { amount: number }) => {
  return <span>{`${amount}\u20BD`}</span>;
});
