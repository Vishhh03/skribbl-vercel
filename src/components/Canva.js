import React, { useRef, useEffect } from 'react';
import { socket } from '../socket';

const Canvas = ({ roomId }) => {
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';

    const startDraw = (e) => {
      drawing.current = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    };

    const draw = (e) => {
      if (!drawing.current) return;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      socket.emit('drawing', { roomId, data: { x: e.offsetX, y: e.offsetY } });
    };

    const endDraw = () => {
      drawing.current = false;
      ctx.closePath();
    };

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseleave', endDraw);

    socket.on('drawing', ({ x, y }) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 0.1, y + 0.1); // simulate a dot
      ctx.stroke();
    });

    return () => socket.off('drawing');
  }, [roomId]);

  return <canvas ref={canvasRef} width={700} height={500} />;
};

export default Canvas;
