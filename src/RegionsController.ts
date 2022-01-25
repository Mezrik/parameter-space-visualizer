import Config from "./Config";
import DataController from "./DataController";

class RegionsController<T> extends DataController<T> {
  constructor(config: Config<T>) {
    super(config);
  }

  initialize(w: number, h: number) {
    super.initialize(w, h);

    const dataBinding = this.dataContainer
      ?.selectAll("custom.rect")
      .data(this.config.data);
  }
}

export default RegionsController;
