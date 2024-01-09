export class AssistController {
  tooltips: Map<string,boolean> = new Map();

  constructor(){
    this.tooltips.set("video-search", false);
    const showedTooltips = new Map<string, boolean>(JSON.parse(localStorage.getItem("assist") ?? "[]"));
    showedTooltips.forEach((value, key) => {
      this.tooltips.set(key, value);
    });
    localStorage.setItem("assist", JSON.stringify(Array.from(this.tooltips)));
  }

}
