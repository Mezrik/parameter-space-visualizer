import { quadtree } from "d3-quadtree";

type Accessor<T> = (d: T) => number;

type TreeSpaceBoundaries = { width: number; height: number };

class Quadtree {
  constructor(bounds: TreeSpaceBoundaries) {}
}

const constructQuadTree = <T>(data: T[], x: Accessor<T>, y: Accessor<T>) => {
  const tree = quadtree(data, x, y);
};
