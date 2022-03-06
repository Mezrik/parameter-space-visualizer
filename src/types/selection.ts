import { BaseType, Selection } from "d3-selection";

export type SimpleSelection<GElement extends BaseType> = Selection<
  GElement,
  unknown,
  null,
  undefined
>;
