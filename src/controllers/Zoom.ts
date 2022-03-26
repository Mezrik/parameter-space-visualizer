import { zoom, ZoomedElementBaseType, ZoomTransform } from "d3";

type ZoomListener = (translate: ZoomTransform) => void;

class Zoom<ZoomRefElement extends ZoomedElementBaseType> {
  private zoomListeners: ZoomListener[] = [];

  // Zoom behaviour, this should be attached to the zoom base (svg, canvas, etc.)
  public zoom = zoom<ZoomRefElement, unknown>();

  constructor(
    scaleExtent?: [number, number],
    translateExtent?: [[number, number], [number, number]]
  ) {
    if (scaleExtent) this.zoom.scaleExtent(scaleExtent);

    if (translateExtent) this.zoom.translateExtent(translateExtent);

    this.zoom.on("zoom", this.handleZoom);
  }

  private handleZoom = (event: any) => {
    const transform: ZoomTransform = event.transform;

    this.zoomListeners.forEach((cb) => cb(transform));
  };

  public onChange(listener: ZoomListener) {
    this.zoomListeners.push(listener);
  }

  public removeListeners() {
    this.zoomListeners = [];
  }
}

export default Zoom;
