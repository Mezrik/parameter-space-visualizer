import { zoom, ZoomedElementBaseType, ZoomTransform, ZoomScale } from "d3";

type ZoomListener = (translate: ZoomTransform) => void;

class Zoom<ZoomRefElement extends ZoomedElementBaseType> {
  private zoomListeners: ZoomListener[] = [];

  // Zoom behaviour, this should be attached to the zoom base (svg, canvas, etc.)
  public zoom = zoom<ZoomRefElement, unknown>();

  constructor(scaleExtent?: [number, number]) {
    if (scaleExtent) this.zoom.scaleExtent(scaleExtent);
    this.zoom.on("zoom", this.handleZoom);
  }

  public onChange(listener: ZoomListener) {
    this.zoomListeners.push(listener);
  }

  private handleZoom = (event: any) => {
    const transform: ZoomTransform = event.transform;

    this.zoomListeners.forEach((cb) => cb(transform));
  };
}

export default Zoom;
