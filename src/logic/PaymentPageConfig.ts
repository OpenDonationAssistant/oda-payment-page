import { Amount } from "../types";

export interface Goal {
  id: string;
  fullDescription: string;
  briefDescription: string;
  requiredAmount: Amount;
  accumulatedAmount: Amount;
  selected?: boolean;
  default: boolean;
}

export class PaymentPageConfig {
  config: any = {};

  private _email: string = "";
  private _fio: string = "";
  private _inn: string = "";
  private _requestsEnabled = true;
  private _requestsDisabledPermanently = false;
  private _requestCost = 100;
  private _arbitraryText: string | null = null;
  private _goals: Goal[] = [];
  private _payButtonText: string | null = null;
  private _customCss: string | null = null;
  private _gateway: string | null = null;
  private _tooltip: string = "";

  constructor(json: any) {
    this.config = json;
    this.requestsEnabled = json.value["media.requests.enabled"] ?? true;
    this.requestsDisabledPermanently =
      json.value["media.requests.disabled.permanently"] ?? false;
    this.requestCost = json.value["media.requests.cost"] ?? 100;
    this.email = json.value["email"] ?? "";
    this.fio = json.value["fio"] ?? "";
    this.inn = json.value["inn"] ?? "";
    this.arbitraryText = json.value["arbitraryText"] ?? null;
    this._goals = json.value["goals"] ?? [];
    this._goals.map((goal) => {
      if (goal.default) {
        goal.selected = true;
      }
      return goal;
    });
    this._payButtonText = json.value["payButtonText"] ?? "";
    this._customCss = json.value["customCss"] ?? null;
    this._gateway = json.value["gateway"] ?? null;
    this._tooltip = json.value["tooltip"] ?? "";
  }

  public get email(): string {
    return this._email;
  }
  public set email(value: string) {
    this._email = value;
  }
  public get fio(): string {
    return this._fio;
  }
  public set fio(value: string) {
    this._fio = value;
  }
  public get inn(): string {
    return this._inn;
  }
  public set inn(value: string) {
    this._inn = value;
  }
  public get requestsEnabled() {
    return this._requestsEnabled;
  }
  public set requestsEnabled(value) {
    this._requestsEnabled = value;
  }
  public get requestsDisabledPermanently() {
    return this._requestsDisabledPermanently;
  }
  public set requestsDisabledPermanently(value) {
    this._requestsDisabledPermanently = value;
  }
  public get requestCost() {
    return this._requestCost;
  }
  public set requestCost(value) {
    this._requestCost = value;
  }
  public get arbitraryText(): string | null {
    return this._arbitraryText;
  }
  public set arbitraryText(value: string | null) {
    this._arbitraryText = value;
  }
  public get goals(): Goal[] {
    return this._goals;
  }
  public set goals(value: Goal[]) {
    this._goals = value;
  }
  public get payButtonText(): string | null {
    return this._payButtonText;
  }
  public set payButtonText(value: string | null) {
    this._payButtonText = value;
  }
  public get customCss(): string | null {
    return this._customCss;
  }
  public set customCss(value: string | null) {
    this._customCss = value;
  }
  public set gateway(value: string | null) {
    this._gateway = value;
  }
  public get gateway(): string | null {
    return this._gateway;
  }
  public set tooltip(value: string) {
    this._tooltip = value;
  }
  public get tooltip(): string {
    return this._tooltip;
  }
}
