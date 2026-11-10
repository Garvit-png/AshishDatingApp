"use client";

import { useEffect, useRef } from "react";

/**
 * Animated "silk" background — plain WebGL, no three.js.
 * (~3KB instead of ~600KB.) Pauses when off-screen or when the tab is hidden.
 */

const VERT = `attribute vec2 p; varying vec2 vUv; void main(){ vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `precision mediump float;
varying vec2 vUv;
uniform float uTime; uniform vec3 uColor; uniform float uSpeed; uniform float uScale; uniform float uNoise; uniform vec2 uRes;
const float e = 2.71828182845904523536;
float noise(vec2 t){ vec2 r = e * sin(e * t); return fract(r.x * r.y * (1.0 + t.x)); }
void main(){
  vec2 uv = vUv * uScale;
  vec2 tex = uv * uScale;
  float t = uSpeed * uTime;
  tex.y += 0.03 * sin(8.0 * tex.x - t);
  float pattern = 0.6 + 0.4 * sin(5.0 * (tex.x + tex.y + cos(3.0 * tex.x + 5.0 * tex.y) + 0.02 * t) + sin(20.0 * (tex.x + tex.y - 0.1 * t)));
  vec3 col = uColor * pattern * 3.0 - noise(gl_FragCoord.xy) / 15.0 * uNoise;
  gl_FragColor = vec4(col, 1.0);
}`;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "").padEnd(6, "0");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
}

export default function Silk({
  color = "#ff0000",
  speed = 5,
  scale = 1,
  noiseIntensity = 1.5,
  className = "",
}: {
  color?: string;
  speed?: number;
  scale?: number;
  noiseIntensity?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorRef = useRef(color);
  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, powerPreference: "low-power" });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uTime = u("uTime"), uColor = u("uColor"), uRes = u("uRes");
    gl.uniform1f(u("uSpeed"), speed);
    gl.uniform1f(u("uScale"), scale);
    gl.uniform1f(u("uNoise"), noiseIntensity);

    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);

    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let time = 0;
    let last = performance.now();
    let raf = 0;
    let running = false;
    const frame = (now: number) => {
      time += Math.min(0.05, (now - last) / 1000) * 0.1;
      last = now;
      gl.uniform1f(uTime, time);
      gl.uniform3f(uColor, ...hexToRgb(colorRef.current));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (running) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    frame(performance.now()); // draw one frame immediately
    let inView = true;
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView && !document.hidden) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden || !inView ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [speed, scale, noiseIntensity]);

  return <canvas ref={canvasRef} className={`block w-full h-full ${className}`} aria-hidden />;
}
