export interface IPaymentListener {
  setNickname(nickname: string): void;
  setText(text: string): void;
  setAmount(amount: number): void;
  setAttachments(attachments: []): void;
  setError(error: string|null): void;
  setTreshold(treshold: number): void;
}
