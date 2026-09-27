"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const vertex = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`;

// Ripple + RGB split around the pointer; cover-fit with a focal point like object-position.
const fragment = /* glsl */ `
precision highp float;
uniform sampler2D tMap;
uniform vec2 uMouse;
uniform float uHover;
uniform float uTime;
uniform vec2 uScale;
uniform vec2 uOffset;
varying vec2 vUv;
void main() {
  vec2 uv = vUv;
  vec2 d = uv - uMouse;
  float dist = length(d);
  vec2 dir = d / max(dist, 1e-4);
  float falloff = smoothstep(0.55, 0.0, dist) * uHover;
  uv += dir * sin(dist * 34.0 - uTime * 5.0) * 0.010 * falloff;
  vec2 tuv = uv * uScale + uOffset;
  float shift = 0.012 * falloff;
  float r = texture2D(tMap, tuv + dir * shift).r;
  float g = texture2D(tMap, tuv).g;
  float b = texture2D(tMap, tuv - dir * shift).b;
  gl_FragColor = vec4(r, g, b, 1.0);
}
`;

interface WebGLHoverProps {
  src: string;
  /** object-position in % (focal point) */
  focalX?: number;
  focalY?: number;
  /** Parent hover state — the canvas mounts on first hover and animates in/out. */
  active: boolean;
  className?: string;
}

/**
 * Lazy WebGL distortion layer drawn over an <img>. Only created on first hover
 * (the "full" tier decides whether to render this at all); if WebGL or the
 * image's CORS fails, it silently stays invisible and the plain <img> shows.
 */
export function WebGLHover({ src, focalX = 50, focalY = 50, active, className }: WebGLHoverProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const state = useRef({ hover: 0, target: 0, mouse: [0.5, 0.5] as [number, number], ready: false });
  const started = useRef(false);
  const unmounted = useRef(false);
  const teardown = useRef<(() => void) | null>(null);

  // Dispose the GL context only when the card unmounts (not on hover changes).
  useEffect(() => {
    unmounted.current = false;
    return () => {
      unmounted.current = true;
      teardown.current?.();
      teardown.current = null;
      started.current = false;
    };
  }, []);

  useEffect(() => {
    state.current.target = active ? 1 : 0;
    // Release the GL context shortly after the pointer leaves: browsers cap live
    // WebGL contexts (~16), and a gallery can have more cards than that.
    if (!active) {
      const t = setTimeout(() => {
        teardown.current?.();
        teardown.current = null;
        started.current = false;
      }, 1200);
      return () => clearTimeout(t);
    }
    if (started.current) return;
    started.current = true;
    state.current.hover = 0;
    state.current.ready = false;

    const wrap = wrapRef.current;
    if (!wrap) return;
    let raf = 0;

    (async () => {
      const { Renderer, Program, Mesh, Triangle, Texture } = await import("ogl");
      if (unmounted.current) return;
      let renderer: InstanceType<typeof Renderer>;
      try {
        renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 2), alpha: true });
      } catch {
        return; // no WebGL
      }
      const gl = renderer.gl;
      const canvas = gl.canvas as HTMLCanvasElement;
      canvas.className = "absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300";
      wrap.appendChild(canvas);
      // If the browser evicts this context, drop back to the plain <img>.
      canvas.addEventListener("webglcontextlost", () => {
        cancelAnimationFrame(raf);
        canvas.style.opacity = "0";
        state.current.ready = false;
      });

      const texture = new Texture(gl, { generateMipmaps: false });
      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          tMap: { value: texture },
          uMouse: { value: state.current.mouse },
          uHover: { value: 0 },
          uTime: { value: 0 },
          uScale: { value: [1, 1] },
          uOffset: { value: [0, 0] },
        },
      });
      const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

      const img = new Image();
      img.crossOrigin = "anonymous";
      let imgW = 1;
      let imgH = 1;

      const fit = () => {
        const w = wrap.clientWidth;
        const h = wrap.clientHeight;
        renderer.setSize(w, h);
        // cover: scale UVs so the image fills the box, then offset by the focal point
        const s = Math.max(w / imgW, h / imgH);
        const sx = w / (imgW * s);
        const sy = h / (imgH * s);
        program.uniforms.uScale.value = [sx, sy];
        program.uniforms.uOffset.value = [(1 - sx) * (focalX / 100), (1 - sy) * (1 - focalY / 100)];
      };

      img.onload = () => {
        if (unmounted.current) return;
        imgW = img.naturalWidth;
        imgH = img.naturalHeight;
        try {
          texture.image = img; // throws on tainted (non-CORS) images in some browsers
        } catch {
          return;
        }
        state.current.ready = true;
        fit();
      };
      img.src = src;

      const ro = new ResizeObserver(fit);
      ro.observe(wrap);

      const onMove = (e: PointerEvent) => {
        const r = wrap.getBoundingClientRect();
        state.current.mouse[0] = (e.clientX - r.left) / r.width;
        state.current.mouse[1] = 1 - (e.clientY - r.top) / r.height;
      };
      wrap.parentElement?.addEventListener("pointermove", onMove);

      const loop = (t: number) => {
        raf = requestAnimationFrame(loop);
        const s = state.current;
        s.hover += (s.target - s.hover) * 0.08;
        if (!s.ready) return;
        canvas.style.opacity = s.hover > 0.02 ? "1" : "0";
        if (s.hover < 0.002 && s.target === 0) return; // idle: skip draws
        program.uniforms.uHover.value = s.hover;
        program.uniforms.uTime.value = t / 1000;
        try {
          renderer.render({ scene: mesh }); // texture upload happens here; a CORS-tainted image throws
        } catch {
          cancelAnimationFrame(raf);
          canvas.style.opacity = "0";
          s.ready = false;
        }
      };
      raf = requestAnimationFrame(loop);

      teardown.current = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        wrap.parentElement?.removeEventListener("pointermove", onMove);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        canvas.remove();
      };
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- src/focal are fixed per card; GL is created once
  }, [active]);

  return <div ref={wrapRef} className={cn("pointer-events-none absolute inset-0", className)} aria-hidden="true" />;
}
