import { Rect } from '@timohausmann/quadtree-js';

export const rectsOverlapping = (r1: Rect, r2: Rect) => {
  return (
    r1.x + r1.width >= r2.x &&
    r1.y + r1.height >= r2.y &&
    r1.x <= r2.x + r2.width &&
    r1.y <= r2.y + r2.height
  );
};
