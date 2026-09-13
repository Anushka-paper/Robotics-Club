import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface LineData {
  points: Point[];
  tension: number;
  friction: number;
  phase: number;
  speed: number;
  radiusX: number;
  radiusY: number;
  thickness: number;
  wiggle: number;
}

interface SleekLineCursorProps {
  friction?: number;
  trails?: number;
  size?: number;
  dampening?: number;
  tension?: number;
  color?: string;
  lineCount?: number;
}

export default function SleekLineCursor({
  friction = 0.5,
  trails = 20,
  size = 50,
  dampening = 0.25,
  tension = 0.98,
  color = "rgba(251, 191, 36, 0.15)", // Highly transparent
  lineCount = 15 
}: SleekLineCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let lines: LineData[] = [];
    
    // Create highly irregular, randomized physics for each line
    for (let l = 0; l < lineCount; l++) {
      let pts: Point[] = [];
      for (let i = 0; i < trails; i++) {
        pts.push({ x: window.innerWidth / 2, y: window.innerHeight / 2, vx: 0, vy: 0 });
      }
      lines.push({
        points: pts,
        tension: tension - (Math.random() * 0.15), // Random tension creates messy expansion/contraction
        friction: friction + (Math.random() * 0.05), // Random friction causes some lines to drag behind
        phase: Math.random() * Math.PI * 2, // Random starting position
        speed: 0.5 + Math.random() * 2, // Completely different orbit speeds
        radiusX: 2 + Math.random() * 25, // Erratic, elliptical horizontal orbit
        radiusY: 2 + Math.random() * 25, // Erratic, elliptical vertical orbit
        thickness: 1 + Math.random() * 6, // Some fat lines, some very thin
        wiggle: Math.random() * 0.8 // Random wind/noise added per frame
      });
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      if (e instanceof MouseEvent) {
        mouse.current = { x: e.clientX, y: e.clientY };
      } else if (e.touches && e.touches.length > 0) {
        mouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onMouseMove);

    mouse.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() * 0.001;
      
      ctx.globalCompositeOperation = 'lighter';
      
      for (let l = 0; l < lineCount; l++) {
        const line = lines[l];
        const pts = line.points;

        // Extremely non-uniform head movement (Lissajous curve-like orbit)
        let head = pts[0];
        head.x = mouse.current.x + Math.cos(time * line.speed + line.phase) * line.radiusX;
        head.y = mouse.current.y + Math.sin(time * (line.speed * 0.7) + line.phase) * line.radiusY;
        
        for (let i = 1; i < trails; i++) {
          const node = pts[i];
          const prevNode = pts[i - 1];
          
          const dx = prevNode.x - node.x;
          const dy = prevNode.y - node.y;
          
          node.vx += dx * line.tension;
          node.vy += dy * line.tension;
          
          // Inject organic, erratic noise (wiggling)
          node.vx += (Math.random() - 0.5) * line.wiggle;
          node.vy += (Math.random() - 0.5) * line.wiggle;
          
          node.vx *= line.friction;
          node.vy *= line.friction;
          
          node.x += node.vx * dampening;
          node.y += node.vy * dampening;
        }

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        
        for (let i = 1; i < trails; i++) {
          ctx.beginPath();
          ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
          ctx.lineTo(pts[i].x, pts[i].y);
          
          // Use the random thickness assigned to this specific line
          ctx.lineWidth = Math.max(0.5, line.thickness * (1 - i / trails));
          ctx.strokeStyle = color;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [friction, trails, size, dampening, tension, color, lineCount]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 99999,
        filter: "blur(3px)",
      }}
    />
  );
}
