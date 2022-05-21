
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

  topCtx.lineWidth = 10;
  topCtx.lineCap = 'round';
  topCtx.lineJoin = 'round';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  type Point = [number, number];
  const points: Point[] = [];


  function clear(context: CanvasRenderingContext2D) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  }

  function draw() {
    clear(topCtx);
    ctx.moveTo(...points[0]);
    for (let index = 1; index < points.length - 1;) {
      const [ x1, y1 ] = points[index];
      const [ x2, y2 ] = points[index + 1];
      const [ x, y ] = [ (x1 + x2) / 2, (y1 + y2) / 2 ];
      ctx.quadraticCurveTo(x1, y1, x, y);
      index++;
      ctx.stroke();
    }
  }


  function onMouseMove(e: MouseEvent) {
    points.push([ (e.pageX - offsetLeft) * window.devicePixelRatio, (e.pageY - offsetTop) * window.devicePixelRatio ]);
    topCtx.lineTo(...points[points.length - 1]);
    topCtx.stroke();
  }

  function onMouseUp() {
    draw();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  function onMouseDown() {
    points.length = 0;
    topCtx.beginPath();
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  topCanvas.addEventListener('mousedown', onMouseDown);
}

export default {
  main,
};
