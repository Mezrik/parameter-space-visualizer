import { zoom, ZoomedElementBaseType, ZoomTransform, ZoomScale } from "d3";

type ZoomListener<XScale, YScale> = (xScale: XScale, yScale?: YScale) => void;

class Zoom<
  ZoomRefElement extends ZoomedElementBaseType,
  XScale extends ZoomScale,
  YScale extends ZoomScale
> {
  private xScale: XScale;
  private yScale?: YScale;

  private zoomListeners: ZoomListener<XScale, YScale>[] = [];

  // Zoom behaviour, this should be attached to the zoom base (svg, canvas, etc.)
  public zoom = zoom<ZoomRefElement, unknown>();

  constructor(xScale: XScale, yScale?: YScale, scaleExtent?: [number, number]) {
    this.xScale = xScale;
    this.yScale = yScale;

    if (scaleExtent) this.zoom.scaleExtent(scaleExtent);
    this.zoom.on("zoom", this.handleZoom);
  }

  public onChange(listener: ZoomListener<XScale, YScale>) {
    this.zoomListeners.push(listener);
  }

  private handleZoom = (event: any) => {
    const transform: ZoomTransform = event.transform;

    let updatedY: YScale;
    const updatedX = transform.rescaleX(this.xScale);
    if (this.yScale) updatedY = transform.rescaleY(this.yScale);

    this.zoomListeners.forEach((cb) => cb(updatedX, updatedY));
  };
}

export default Zoom;
