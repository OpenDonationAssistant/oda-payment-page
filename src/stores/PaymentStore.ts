import {
  DefaultApiFactory,
  GatewayControllerGatewayData,
} from "@opendonationassistant/oda-payment-service-client";
import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { uuidv7 } from "uuidv7";
import { ActionsStore } from "./ActionsStore";

export class PaymentStore {
  private _recipientId: string;
  private _isAnonym: boolean = false;
  private _nickname: string = "";
  private _text: string = "";
  private _amount: number = 0;
  private _treshold: number = 0;
  private _mediaRequestCost: number;
  private _minimalPayment: number;
  private _attachments: any[] = [];
  private _error: string = "";
  private _apiUrl: string = "";
  private _gateways: GatewayControllerGatewayData[] = [];
  private _marker: string;
  private _goal: string | null = null;
  private _actionStore: ActionsStore;

  constructor({
    recipientId,
    mediaRequestCost,
    minimalPayment,
    actionStore,
  }: {
    recipientId?: string;
    mediaRequestCost?: number;
    minimalPayment?: number;
    actionStore: ActionsStore;
  }) {
    this._actionStore = actionStore;
    this._recipientId = recipientId ?? "";
    this._mediaRequestCost = mediaRequestCost ?? 0;
    this._minimalPayment = minimalPayment ?? 0;
    this._treshold = this._minimalPayment;
    this._amount = this._minimalPayment;
    this._nickname = localStorage.getItem("nickname") ?? "";
    const marker = localStorage.getItem("marker");
    if (!marker) {
      this._marker = uuidv7();
      localStorage.setItem("marker", this._marker);
    } else {
      this._marker = marker;
    }
    this._apiUrl = window.location.hostname.endsWith(
      process.env.REACT_APP_DOMAIN ?? "localhost",
    )
      ? (process.env.REACT_APP_API_ENDPOINT ?? "localhost")
      : `https://${window.location.hostname}`;
    DefaultApiFactory(undefined, this._apiUrl)
      .listGateways(recipientId ?? "")
      .then((gateways) => {
        this._gateways = gateways.data.filter((gateway) => gateway.enabled);
      });
    makeAutoObservable(this);
  }

  public checkAmount() {
    let costs =
      this._attachments.length * this._mediaRequestCost +
      this._actionStore.cost;
    console.log("costs", costs);
    this._treshold =
      this._minimalPayment > costs ? this._minimalPayment : costs;
    this._error =
      this._amount < this._treshold
        ? `Сумма доната должна быть больше минимальной: \u20BD${this._treshold}`
        : "";
  }

  public get hasFiatGateway(): boolean {
    return (
      this._gateways.filter((gateway) => gateway.type === "fiat").at(0) !==
      undefined
    );
  }

  public get hasCryptoGateway(): boolean {
    return (
      this._gateways.filter((gateway) => gateway.type === "crypto").at(0) !==
      undefined
    );
  }

  pay({ method, type }: { method?: string; type: string }): Promise<any> {
    this.checkAmount();
    if (this._error) {
      return Promise.resolve({});
    }
    const actions = this._actionStore.added.map((added) => {
      let parameters: any = {};
      added.parameters.map((parameter) => {
        parameters[parameter.id] = parameter.value;
      });
      return { id: added.id, actionId: added.action.id, parameters: parameters};
    });
    return DefaultApiFactory(undefined, this._apiUrl).createDraft({
      id: uuidv7(),
      nickname: this.isAnonym ? "" : this.nickname,
      gatewayCredId:
        this._gateways.filter((gateway) => gateway.type === type).at(0)?.id ??
        "",
      message: this.text,
      amount: {
        major: this.amount,
        minor: 0,
        currency: "RUB",
      },
      method: method ?? "",
      attachments: this.attachments.map((attach) => attach.id),
      recipientId: this._recipientId,
      goal: this._goal ?? "",
      auction: {item:"", isNew: false},
      actions: actions
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
    this.checkAmount();
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

  public set attachments(attachments: any[]) {
    this._attachments = attachments;
    this.checkAmount();
  }

  public get attachments() {
    return this._attachments;
  }

  public set attachment(attachments: any[]) {
    this._attachments = attachments;
    this.checkAmount();
  }

  public get error(): string {
    return this._error;
  }
  public set error(value: string) {
    this._error = value;
  }
  public get marker(): string {
    return this._marker;
  }
  public set marker(value: string) {
    this._marker = value;
  }

  public set goal(id: string | null) {
    this._goal = id;
  }

  public get goal(): string | null {
    return this._goal;
  }
}

export const PaymentStoreContext = createContext<PaymentStore | null>(null);
