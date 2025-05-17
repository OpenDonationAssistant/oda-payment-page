import axios from "axios";
import { IPaymentListener } from "./IPaymentListener";
import { uuidv7 } from "uuidv7";
import {
  DefaultApiFactory,
  GatewayControllerGatewayData,
} from "@opendonationassistant/oda-payment-service-client";

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
  private _apiUrl: string = "";
  private _fiatGateway: GatewayControllerGatewayData | null = null;

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
    this._apiUrl = window.location.hostname.endsWith(
      process.env.REACT_APP_DOMAIN ?? "localhost",
    )
      ? process.env.REACT_APP_API_ENDPOINT
      : `https://${window.location.hostname}`;
    DefaultApiFactory(undefined, this._apiUrl)
      .listGateways(recipientId)
      .then((gateways) => {
        this._fiatGateway =
          gateways.data
            .filter((gateway) => gateway.enabled)
            .filter((gateway) => gateway.type === "fiat")
            .at(0) ?? null;
      });
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
    if (this._fiatGateway === null) {
      return Promise.resolve({});
    }
    if (isIncorrect) {
      this.updateAmountError(treshold);
      return Promise.resolve({});
    }
    const attachmentIds = this.attachments.map((attach) => attach.id);
    return axios.put(`${this._apiUrl}/payments/commands/create`, {
      id: uuidv7(),
      gatewayCredId: this._fiatGateway.id,
      nickname: this.nickname,
      message: this.text,
      amount: {
        major: this.amount,
        currency: "RUB",
      },
      method: type,
      attachments: attachmentIds,
      recipientId: this._recipientId,
      goal: this._goal,
    });
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
