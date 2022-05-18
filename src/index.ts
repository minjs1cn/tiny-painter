export function main() {
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  const container = document.querySelector('#app') as HTMLElement;
  container.style.border = '1px solid #000';
  const { offsetWidth, offsetHeight, offsetLeft, offsetTop } = container;
  canvas.width = offsetWidth * window.devicePixelRatio;
  canvas.height = offsetHeight * window.devicePixelRatio;
  canvas.style.width = `${offsetWidth}px`;
  canvas.style.height = `${offsetHeight}px`;
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  type Point = [number, number];

  const points: Point[] = [];

  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function draw(p: Point[]) {
    if (p.length % 2 === 1) {
      // 奇数
      clear();
      for (let index = 0; index < p.length - 1; index += 2) {
        ctx.moveTo(...p[index]);
        ctx.quadraticCurveTo(...p[index + 1], ...p[index + 2]);
        ctx.stroke();
      }
    } else {
      ctx.lineTo(...p[points.length - 1]);
      ctx.stroke();
    }
  }

  function onMouseMove(e: MouseEvent) {
    points.push([ (e.pageX - offsetLeft) * window.devicePixelRatio, (e.pageY - offsetTop) * window.devicePixelRatio ]);

    if (points.length === 1) {
      ctx.moveTo(...points[0]);
    } else {
      draw(points);
    }
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  function onMouseDown() {
    points.length = 0;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  canvas.addEventListener('mousedown', onMouseDown);
}

export default {
  main,
};
