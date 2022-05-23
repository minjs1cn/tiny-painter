function setStyle(el: HTMLElement, style: Partial<CSSStyleDeclaration>) {
  Object.keys(style).forEach(key => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    el.style[key] = style[key];
  });
}


function createCanvas(width = 100, height = 100) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  setStyle(canvas, {
    width: '100%',
    height: '100%',
  });
  return canvas;
}

export interface IPoint {
  x: number;
  y: number;
  v: number;
}

export function main() {
  const container = document.querySelector('#app') as HTMLElement;
  container.style.border = '1px solid #000';
  container.style.position = 'relative';
  const { offsetWidth, offsetHeight, offsetLeft, offsetTop } = container;
  const width = offsetWidth * window.devicePixelRatio;
  const height = offsetHeight * window.devicePixelRatio;
  const canvas = createCanvas(width, height);
  const topCanvas = createCanvas(canvas.width, canvas.height);
  setStyle(topCanvas, {
    left: '0px',
    top: '0px',
    position: 'absolute',
  });

  container.appendChild(canvas);
  container.appendChild(topCanvas);

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const topCtx = topCanvas.getContext('2d') as CanvasRenderingContext2D;

  const lineWidth = 30;
  topCtx.lineWidth = lineWidth;
  topCtx.lineCap = 'round';
  topCtx.lineJoin = 'round';
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  let points: IPoint[] = [];
  let startTime = 0;

  function clear(context: CanvasRenderingContext2D) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  }

  function draw() {
    clear(topCtx);
    const [ { x: sx, y: sy } ] = points;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    for (let index = 1; index < points.length - 1;) {
      const { x: x1, y: y1, v: v1 } = points[index];
      const { x: x2, y: y2, v: v2 } = points[index + 1];
      const [ x, y ] = [ (x1 + x2) / 2, (y1 + y2) / 2 ];
      ctx.save();
      const v = (v1 + v2) / 2;
      ctx.lineWidth = lineWidth / v;
      ctx.quadraticCurveTo(x1, y1, x, y);
      index++;
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawPoint() {
    clear(topCtx);
    const [ { x: sx, y: sy } ] = points;
    ctx.beginPath();
    ctx.save();
    ctx.lineTo(sx, sy);
    ctx.stroke();
    ctx.restore();
  }

  function distance(p1: IPoint, p2: IPoint) {
    const { x: x1, y: y1 } = p1;
    const { x: x2, y: y2 } = p2;
    const dx = Math.abs(x1 - x2) ** 2;
    const dy = Math.abs(y1 - y2) ** 2;
    return Math.sqrt(dx + dy);
  }

  function reset() {
    points = [];
    startTime = 0;
    topCtx.beginPath();
  }

  function onMouseMove(e: MouseEvent) {
    const point = {
      x: (e.pageX - offsetLeft) * window.devicePixelRatio,
      y: (e.pageY - offsetTop) * window.devicePixelRatio,
      v: 1,
    };
    points.push(point);
    const currentTime = Date.now();
    let vt = 1;
    if (startTime !== 0) {
      const duration = currentTime - startTime;
      const dx = distance(points[points.length - 2], points[points.length - 1]);
      vt = Math.max(Math.min(dx / duration, lineWidth), 1);
    }
    point.v = vt;
    startTime = currentTime;

    topCtx.save();
    topCtx.lineWidth = lineWidth / vt;
    const { x, y } = points[points.length - 1];
    topCtx.lineTo(x, y);
    topCtx.stroke();
    topCtx.restore();

    if (points.length === 2) {
      const [ { x: x1, y: y1 } ] = points;
      const [ , { x: x2, y: y2 } ] = points;
      if (x1 === x2 && y1 === y2) {
        drawPoint();
        reset();
      }
    }
  }

  function onMouseUp() {
    if (points.length > 0) {
      draw();
    }
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  function onMouseDown() {
    reset();
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  topCanvas.addEventListener('mousedown', onMouseDown);
}

export default {
  main,
};
