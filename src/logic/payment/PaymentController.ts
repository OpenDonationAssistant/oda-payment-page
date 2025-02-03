import axios from "axios";
import { IPaymentListener } from "./IPaymentListener";
import { v4 as uuidv4 } from "uuid";

export class PaymentController {
  private _nickname: string = "Аноним";
  private _text: string = "";
  private _amount: number = 0;
  private _error: string | null = null;
  private _attachments: [] = [];
  private _listeners: IPaymentListener[] = [];
  private _treshold: number = 0;
  private _recipientId: string;
  private _mediaRequestCost: number;
  private _minimalPayment: number;
  private _goal: string | null = null;

  constructor(
    recipientId: string,
    mediaRequestCost: number,
    minimalPayment: number,
  ) {
    this._recipientId = recipientId;
    this._mediaRequestCost = mediaRequestCost;
    this._minimalPayment = minimalPayment;
    this.amount = minimalPayment;
    this.treshold = minimalPayment;
  }

  addListener(listener: IPaymentListener) {
    this._listeners.push(listener);
  }

  private checkAmount(size: number, amount: number) {
    let paymentForAttachments = size * this._mediaRequestCost;
    let treshold =
      this._minimalPayment > paymentForAttachments
        ? this._minimalPayment
        : paymentForAttachments;
    let isIncorrect = amount < treshold;
    this.treshold = treshold;
    return { treshold, isIncorrect };
  }

  private validateAmount() {
    let { treshold, isIncorrect } = this.checkAmount(
      this._attachments.length,
      this._amount,
    );
    if (this.error !== null || this._amount !== null) {
      if (isIncorrect) {
        this.updateAmountError(treshold);
      } else {
        this.error = null;
      }
    }
  }

  pay(type: string | null): Promise<any> {
    console.log(`paying with ${type}`);
    let { treshold, isIncorrect } = this.checkAmount(
      this.attachments.length,
      this.amount,
    );
    if (isIncorrect) {
      this.updateAmountError(treshold);
      return Promise.resolve({});
    }
    const attachmentIds = this.attachments.map((attach) => attach.id);
  const apiUrl = window.location.hostname.endsWith(process.env.REACT_APP_DOMAIN ?? "localhost")
    ? process.env.REACT_APP_API_ENDPOINT
    : `https://${window.location.hostname}`;
    return axios.put(
      `${apiUrl}/commands/payment/create`,
      {
        // todo use v7
        id: uuidv4(),
        nickname: this.nickname,
        message: this.text,
        amount: {
          major: this.amount,
          currency: "RUB",
        },
        method: type,
        attachments: attachmentIds,
        recipientId: this._recipientId,
        goal: this._goal
      },
    );
  }

  private updateAmountError(treshold: number) {
    const errorMessage = `Сумма доната должна быть больше минимальной: \u20BD${treshold}`;
    this.error = errorMessage;
  }

  public get treshold(): number {
    return this._treshold;
  }
  public set treshold(value: number) {
    this._treshold = value;
    this._listeners.forEach((listener) => listener.setTreshold(value));
  }
  public get nickname(): string {
    return this._nickname;
  }
  public set nickname(value: string) {
    this._nickname = value;
    this._listeners.forEach((listener) => listener.setNickname(value));
  }
  public get text(): string {
    return this._text;
  }
  public set text(value: string) {
    this._text = value;
    this._listeners.forEach((listener) => listener.setText(value));
  }
  public get amount(): number {
    return this._amount;
  }
  public set amount(value: number) {
    this._amount = value;
    this.validateAmount();
    this._listeners.forEach((listener) => listener.setAmount(value));
  }
  public get attachments(): [] {
    return this._attachments;
  }
  public set attachments(value: []) {
    this._attachments = value;
    this._listeners.forEach((listener) => listener.setAttachments(value));
    this.validateAmount();
  }
  public get error(): string | null {
    return this._error;
  }
  public set error(value: string | null) {
    this._error = value;
    this._listeners.forEach((listener) => listener.setError(value));
  }
  public get goal(): string | null {
    return this._goal;
  }
  public set goal(value: string | null) {
    this._goal = value;
  }
}
