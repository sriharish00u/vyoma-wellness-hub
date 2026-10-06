import React, { useEffect, useRef } from "react";

interface AmbientAuraCanvasProps {
  className?: string;
  intensity?: number;
}

export const AmbientAuraCanvas: React.FC<AmbientAuraCanvasProps> = ({
  className = "",
  intensity = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });

    let animationId: number;
    let program: WebGLProgram | null = null;
    let mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
    let startTime = performance.now();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX / window.innerWidth;
      mouse.targetY = 1.0 - e.clientY / window.innerHeight;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouse.targetX = e.touches[0].clientX / window.innerWidth;
        mouse.targetY = 1.0 - e.touches[0].clientY / window.innerHeight;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    if (!gl) {
      // If WebGL2 is unavailable, canvas will show subtle CSS fallback
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("touchmove", handleTouchMove);
      };
    }

    const VERT_SRC = `#version 300 es
      in vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const FRAG_SRC = `#version 300 es
      precision highp float;
      out vec4 fragColor;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_intensity;

      // Simplex-inspired smooth hash & noise
      vec2 hash2(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return fract(sin(p) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                       dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
                   mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                       dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
      }

      // Harmonic palette for Yoga & Wellness: Emerald Green, Ocean Teal, Warm Sunrise Gold, Pure Serenity
      vec3 palette(float t) {
        vec3 a = vec3(0.08, 0.16, 0.14); // Deep calm forest base
        vec3 b = vec3(0.35, 0.45, 0.38); // Gentle emerald amplitude
        vec3 c = vec3(0.9, 1.1, 0.8);   // Frequency
        vec3 d = vec3(0.12, 0.45, 0.32); // Phase
        return a + b * cos(6.28318 * (c * t + d));
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
        vec2 m = (u_mouse - 0.5) * vec2(u_resolution.x / min(u_resolution.x, u_resolution.y), 1.0);

        float t = u_time * 0.18;
        
        // Gentle cursor attraction ripple
        float dMouse = length(uv - m);
        float mouseWave = sin(dMouse * 10.0 - u_time * 1.5) * exp(-dMouse * 2.8) * 0.08;
        
        // Organic flowing layers (Breathe rhythm)
        float breathe = 0.5 + 0.5 * sin(t * 0.8);
        vec2 p = uv * 2.2 + mouseWave;
        
        float q1 = noise(p + vec2(t * 0.4, -t * 0.3));
        float q2 = noise(p * 1.6 + vec2(-t * 0.3, t * 0.5) + q1 * 0.6);
        float field = noise(p * 0.8 + q2 * 1.2 + breathe * 0.2);

        // Color computation
        vec3 col = palette(field * 1.2 + breathe * 0.3 + length(uv) * 0.4);
        
        // Add subtle golden sunrise morning glow in the upper corner
        vec2 sunrisePos = vec2(0.4, 0.45);
        float sunriseGlow = exp(-length(uv - sunrisePos) * 2.2) * (0.35 + 0.15 * sin(t * 0.5));
        vec3 gold = vec3(0.98, 0.78, 0.42); // Warm morning sun
        col = mix(col, gold, sunriseGlow * 0.45);

        // Calming emerald highlights
        float emeraldGlow = exp(-length(uv + vec2(0.35, -0.2)) * 2.0);
        vec3 emerald = vec3(0.18, 0.78, 0.55);
        col = mix(col, emerald, emeraldGlow * 0.3);

        // Soft vignette to keep text highly legible
        float vignette = smoothstep(1.3, 0.2, length(uv));
        col *= vignette * 0.9 + 0.1;

        // Subtle film grain
        float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + u_time * 43.0) * 43758.5453);
        col += (grain - 0.5) * 0.025;

        fragColor = vec4(col, 0.88 * u_intensity);
      }
    `;

    function createShader(type: number, src: string) {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn("Shader error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl.VERTEX_SHADER, VERT_SRC);
    const fs = createShader(gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) return;

    program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Full screen quad
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uIntensity = gl.getUniformLocation(program, "u_intensity");

    const resize = () => {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = canvas.clientWidth * dpr;
      const height = canvas.clientHeight * dpr;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    window.addEventListener("resize", resize);
    resize();

    const render = () => {
      if (!gl || !program) return;
      resize();

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const elapsed = (performance.now() - startTime) * 0.001;

      gl.useProgram(program);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uIntensity, intensity);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      if (gl && program) {
        gl.deleteProgram(program);
      }
    };
  }, [intensity]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="h-full w-full object-cover opacity-90 transition-opacity duration-1000"
      />
      {/* Gentle gradient overlay for high contrast & elegance */}
      <div className="absolute inset-0 bg-radial from-transparent via-background/60 to-background/95" />
    </div>
  );
};
