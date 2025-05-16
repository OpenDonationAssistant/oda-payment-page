import axios from "axios";
import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { uuidv7 } from "uuidv7";

export class PaymentStore {
  private _recipientId: string;
  private _isAnonym: boolean = false;
  private _nickname: string = "Аноним";
  private _text: string = "";
  private _amount: number = 0;
  private _treshold: number = 0;
  private _mediaRequestCost: number;
  private _minimalPayment: number;
  private _attachments: any[] = [];
  private _error: string = "";

  constructor({
    recipientId,
    mediaRequestCost,
    minimalPayment,
  }: {
    recipientId?: string;
    mediaRequestCost?: number;
    minimalPayment?: number;
  }) {
    this._recipientId = recipientId ?? "";
    this._mediaRequestCost = mediaRequestCost ?? 0;
    this._minimalPayment = minimalPayment ?? 0;
    this._amount = this._minimalPayment;
    makeAutoObservable(this);
  }

  private checkAmount(size: number, amount: number) {
    let paymentForAttachments = size * this._mediaRequestCost;
    let treshold =
      this._minimalPayment > paymentForAttachments
        ? this._minimalPayment
        : paymentForAttachments;
    let isIncorrect = amount < treshold;
    this._treshold = treshold;
    return { treshold, isIncorrect };
  }

  private updateAmountError(treshold: number) {
    const errorMessage = `Сумма доната должна быть больше минимальной: \u20BD${treshold}`;
    this.error = errorMessage;
  }

  pay(type: string | null): Promise<any> {
    let { treshold, isIncorrect } = this.checkAmount(
      this.attachments.length,
      this.amount,
    );
    if (isIncorrect) {
      this.updateAmountError(treshold);
      return Promise.resolve({});
    }
    const attachmentIds = this.attachments.map((attach) => attach.id);
    const apiUrl = window.location.hostname.endsWith(
      process.env.REACT_APP_DOMAIN ?? "localhost",
    )
      ? process.env.REACT_APP_API_ENDPOINT
      : `https://${window.location.hostname}`;
    return axios.put(`${apiUrl}/payments/commands/create`, {
      id: uuidv7(),
      nickname: this.nickname,
      message: this.text,
      amount: {
        major: this.amount,
        currency: "RUB",
      },
      method: type,
      attachments: attachmentIds,
      recipientId: this._recipientId,
      //goal: this._goal,
    });
  }

  public get nickname(): string {
    return this._nickname;
  }

  public set nickname(value: string) {
    this._nickname = value;
  }

  public get text(): string {
    return this._text;
  }

  public set text(value: string) {
    this._text = value;
  }

  public get amount(): number {
    return this._amount;
  }

  public set amount(value: number) {
    this._amount = value;
  }

  public get treshold(): number {
    return this._treshold;
  }

  public get minimalPayment() {
    return this._minimalPayment;
  }

  public get mediaRequestCost() {
    return this._mediaRequestCost;
  }

  public get isAnonym(): boolean {
    return this._isAnonym;
  }

  public set isAnonym(value: boolean) {
    this._isAnonym = value;
  }

  public get recipientId() {
    return this._recipientId;
  }

  public get attachments() {
    return this._attachments;
  }

  public set attachment(attachments: any[]) {
    this._attachments = attachments;
  }

  public get error(): string {
    return this._error;
  }
  public set error(value: string) {
    this._error = value;
  }
}

export const PaymentStoreContext = createContext(new PaymentStore({}));
