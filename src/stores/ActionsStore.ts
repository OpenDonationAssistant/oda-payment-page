import { makeAutoObservable } from "mobx";

export interface ActionParameter {
  id: string;
  name: string;
  type: string;
}

export interface Action {
  id: string;
  name: string;
  description: string;
  parameters: ActionParameter[];
  cost: number;
}

export interface ActionCategory {
  name: string;
  actions: Action[];
}

export class ActionsStore {
  constructor() {
    makeAutoObservable(this);
  }

  public get available(): ActionCategory[] {
    return [
      {
        name: "Инвентарь",
        actions: [
          {
            id: "coin",
            name: "Закинуть монету",
            description: "Закинуть монеты",
            parameters: [],
            cost: 10,
          },
          {
            id: "key",
            name: "Подарить Ключ",
            description: "Закинуть ключ",
            parameters: [],
            cost: 100,
          },
          {
            id: "shoe",
            name: "Подарить башмаки",
            description: "Закинуть ключ",
            parameters: [],
            cost: 200,
          },
          {
            id: "trash",
            name: "Выбрать что-то случайным образом и выбросить",
            description: "Закинуть ключ",
            parameters: [],
            cost: 2000,
          },
        ],
      },
      {
        name: "Мобы",
        actions: [
          {
            id: "coin",
            name: "Монета",
            description: "Закинуть монеты",
            parameters: [],
          },
          {
            id: "key",
            name: "Ключ",
            description: "Закинуть ключ",
            parameters: [],
          },
        ],
      },
      {
        name: "Погода",
        actions: [
          {
            id: "coin",
            name: "Монета",
            description: "Закинуть монеты",
            parameters: [],
          },
          {
            id: "key",
            name: "Ключ",
            description: "Закинуть ключ",
            parameters: [],
          },
        ],
      },
    ];
  }

  public get added(): Action[] {
    return [
      {
        id: "coin",
        name: "Закинуть монеты",
        description: "Закинуть монеты",
        parameters: [],
      },
      {
        id: "key",
        name: "Подарить ключ",
        description: "Закинуть ключ",
        parameters: [],
      },
    ];
  }
}
