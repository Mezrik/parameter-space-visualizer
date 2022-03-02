// Temporary constant, should be a part of the class
const MAX_DATA_IN_LEAF = 10;

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

type Extent = [[number, number], [number, number]];

enum Region {
  Southwest = 0,
  Northwest,
  Southeast,
  Northeast,
}

type Accessor<Datum extends {}> = (d: Datum) => number;

// Regions quadtree
class QuadTree<Datum extends {}> {
  private root: Node<Datum>;
  private x: Accessor<Datum> = (d: unknown) => (<{ x: number }>d).x;
  private y: Accessor<Datum> = (d: unknown) => (<{ y: number }>d).y;

  // Width and height accessors default to zero -> nodes represent a point
  private w: Accessor<Datum> = () => 0;
  private h: Accessor<Datum> = () => 0;

  constructor(extent: Extent) {
    // Initialize root as leaf
    this.root = new Node(extent);
  }

  public insert(d: Datum) {
    const { x, y, w, h } = this;
    this.root.insert(d, { x: x(d), y: y(d), width: w(d), height: h(d) });
  }
}

class Node<Datum extends {}> {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;

  private _quads?: [Node<Datum>, Node<Datum>, Node<Datum>, Node<Datum>];
  private _data?: [Datum, Rect][];

  constructor(extent: Extent) {
    const [[x, y], [width, height]] = extent;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this._data = [];
  }

  private split() {
    const { x, y, width, height } = this;
    const midW = width / 2;
    const midH = height / 2;

    this._quads = [
      new Node([
        [x, y],
        [midW, midH],
      ]),
      new Node([
        [x, y + midH],
        [midW, midH],
      ]),
      new Node([
        [x + midW, y],
        [midW, midH],
      ]),
      new Node([
        [x + midW, y + midH],
        [midW, midH],
      ]),
    ];

    const data = this._data;

    // If current split leaf contains data distribute it down
    if (data) {
      this._data = undefined;

      data.forEach(([d, dRect]) => {
        // Get regions which contain or are touching the rect defined by datum d
        const regions = this.getRegions(this.quads, dRect);
        regions.forEach(
          (region) => this.quads && this.quads[region].insert(d, dRect)
        );
      });
    }
  }

  // Check wheter the rect is a part of node (is touching or contained in node)
  private isPartOfNode(rect: Rect, node?: Node<Datum>) {
    return (
      !!node &&
      node.x + node.width <= rect.x &&
      node.y + node.height <= rect.y &&
      node.x >= rect.x + rect.width &&
      node.y >= rect.y + rect.height
    );
  }

  private getRegions(qs: Node<Datum>["quads"], rect: Rect) {
    return Object.values(Region).filter((r, i): r is Region =>
      this.isPartOfNode(rect, qs?.[i])
    );
  }

  public insert(d: Datum, dRect: Rect) {
    // When the node is a quad node
    if (this.quads?.length) {
      // Get regions which contain or are touching the rect defined by datum d
      const regions = this.getRegions(this.quads, dRect);

      regions.forEach(
        (region) => this.quads && this.quads[region].insert(d, dRect)
      );

      return;
    }

    // Otherwise is a leaf and the datum gets stored here
    this._data ? this._data.push([d, dRect]) : (this._data = [[d, dRect]]);

    if (this._data.length > MAX_DATA_IN_LEAF) {
      this.split();
    }
  }

  get quads() {
    return Object.freeze(this._quads);
  }

  get data() {
    return Object.freeze(this._data);
  }
}

export default QuadTree;
