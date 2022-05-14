import { zoom, ZoomedElementBaseType, zoomIdentity, ZoomTransform } from 'd3-zoom';

type ZoomListener = (translate: ZoomTransform) => void;

class Zoom<ZoomRefElement extends ZoomedElementBaseType> {
  private zoomListeners: ZoomListener[] = [];
  private _currentTransfrom: ZoomTransform = zoomIdentity;

  // Zoom behaviour, this should be attached to the zoom base (svg, canvas, etc.)
  public zoom = zoom<ZoomRefElement, unknown>();

  constructor(
    scaleExtent?: [number, number],
    translateExtent?: [[number, number], [number, number]],
  ) {
    if (scaleExtent) this.zoom.scaleExtent(scaleExtent);

    if (translateExtent) this.zoom.translateExtent(translateExtent);

    this.zoom.on('zoom', this.handleZoom);
  }

  private handleZoom = (event: any) => {
    const transform: ZoomTransform = event.transform;
    this._currentTransfrom = transform;

    this.zoomListeners.forEach(cb => cb(transform));
  };

  public onChange(listener: ZoomListener) {
    this.zoomListeners.push(listener);
  }

  public removeListeners() {
    this.zoomListeners = [];
  }

  get currentTransfrom() {
    return this._currentTransfrom;
  }
}

export default Zoom;
