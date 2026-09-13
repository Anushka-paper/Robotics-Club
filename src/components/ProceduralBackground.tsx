import { useEffect, useRef, type RefObject } from "react";

const vsSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fsSource = `
  precision highp float;

  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uProgress;

  // Hash & Noise functions
  float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p *= 2.0;
          a *= 0.5;
      }
      return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    // Aspect ratio corrected coordinates
    vec2 st = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);

    // 7 Frames => Progress 0 to 1 scales to 0 to 6
    float frameProgress = uProgress * 6.0;
    float currentFrame = floor(frameProgress);
    
    // Smooth cinematic interpolation between frames
    float localProgress = smoothstep(0.0, 1.0, fract(frameProgress));

    // Base colors
    vec3 colorDark = vec3(0.04, 0.045, 0.05); // Deep black / charcoal
    vec3 colorLight = vec3(0.12, 0.12, 0.14); // Graphite gray
    vec3 colorYellow = vec3(0.96, 0.77, 0.05); // Robotics Yellow

    // Frame States: [brightness, contrast, noiseStrength, yellowIntensity]
    vec4 s0 = vec4(0.72, 1.05, 0.08, 0.10); // Frame 01 - First Build
    vec4 s1 = vec4(0.76, 1.08, 0.06, 0.16); // Frame 02 - Control Systems
    vec4 s2 = vec4(0.82, 1.04, 0.09, 0.20); // Frame 03 - The Lab
    vec4 s3 = vec4(0.74, 1.08, 0.05, 0.14); // Frame 04 - Software
    vec4 s4 = vec4(0.78, 1.06, 0.07, 0.22); // Frame 05 - Keep Building
    vec4 s5 = vec4(0.75, 1.05, 0.06, 0.20); // Frame 06 - Continuation
    vec4 s6 = vec4(0.68, 1.10, 0.05, 0.15); // Frame 07 - Finale

    vec4 currentState = s0;
    vec4 nextState = s1;

    // Use a chain of mixes to avoid dynamic branching issues on older GPUs
    vec4 m0 = mix(s0, s1, localProgress);
    vec4 m1 = mix(s1, s2, localProgress);
    vec4 m2 = mix(s2, s3, localProgress);
    vec4 m3 = mix(s3, s4, localProgress);
    vec4 m4 = mix(s4, s5, localProgress);
    vec4 m5 = mix(s5, s6, localProgress);
    vec4 m6 = mix(s6, s6, localProgress);

    vec4 params = m0;
    if (currentFrame == 1.0) params = m1;
    if (currentFrame == 2.0) params = m2;
    if (currentFrame == 3.0) params = m3;
    if (currentFrame == 4.0) params = m4;
    if (currentFrame == 5.0) params = m5;
    if (currentFrame >= 6.0) params = m6;

    float p_brightness = params.x;
    float p_contrast = params.y;
    float p_noise = params.z;
    float p_yellow = params.w;

    // Base volumetric background gradient
    float radialDist = length(st - vec2(0.0, 0.5));
    vec3 baseColor = mix(colorLight, colorDark, smoothstep(0.0, 2.0, radialDist));

    // Procedural Haze / Noise
    float envNoise = fbm(st * 2.0 + vec2(uTime * 0.05, -uTime * 0.02));
    baseColor += vec3(envNoise * p_noise);

    // Warm Yellow Volumetric Bloom (top/center)
    float yellowBloom = smoothstep(1.5, 0.0, radialDist) * p_yellow;
    baseColor += colorYellow * yellowBloom * (0.8 + 0.2 * noise(st * 5.0 - uTime * 0.5));

    // Calculate effect blending weights based on continuous frameProgress
    // These weights peak at their respective frames and fade out smoothly
    float w1 = max(0.0, 1.0 - abs(frameProgress - 1.0)); // Signal lines
    float w2 = max(0.0, 1.0 - abs(frameProgress - 2.0)); // Lab verticals
    float w3 = max(0.0, 1.0 - abs(frameProgress - 3.0)); // Data grid
    float w4 = max(0.0, 1.0 - abs(frameProgress - 4.0)); // Horizon expansive
    float w5 = max(0.0, 1.0 - abs(frameProgress - 5.0)); // Continuation
    float w6 = max(0.0, 1.0 - abs(frameProgress - 6.0)); // Finale

    // Effect 1: Control Signals (Frame 02)
    float signalLine = smoothstep(0.98, 1.0, sin(uv.y * 30.0 - uTime * 1.5));
    float signalScan = smoothstep(0.95, 1.0, sin(uv.y * 2.0 + uTime * 2.0));
    baseColor += colorYellow * (signalLine * 0.05 + signalScan * 0.08) * w1;

    // Effect 2: Vertical Lab Lights (Frame 03)
    float vertLight1 = smoothstep(0.9, 1.0, sin(uv.x * 8.0 + envNoise * 0.5));
    float vertLight2 = smoothstep(0.95, 1.0, sin(uv.x * 20.0 - uTime * 0.2));
    baseColor += vec3(0.5) * (vertLight1 * 0.08 + vertLight2 * 0.05) * w2;
    float floorReflect = smoothstep(0.3, 0.0, uv.y);
    baseColor += colorYellow * floorReflect * 0.1 * w2;

    // Effect 3: Software Data Grid (Frame 04)
    vec2 gridUv = fract(uv * 15.0);
    float gridLine = smoothstep(0.03, 0.0, gridUv.x) + smoothstep(0.03, 0.0, gridUv.y);
    float dataDots = smoothstep(0.95, 1.0, hash(floor(uv * 30.0) + floor(uTime * 5.0)));
    baseColor += (vec3(0.15) * gridLine + colorYellow * dataDots * 0.2) * w3;

    // Effect 4 & 5 & 6: Horizon Glow / Cinematic depth
    float combinedHorizonWeight = w4 * 0.8 + w5 * 0.9 + w6 * 1.0;
    float horizonGlow = smoothstep(0.5, 0.0, abs(uv.y - 0.25));
    baseColor += colorYellow * horizonGlow * 0.15 * combinedHorizonWeight;

    // Deepen blacks progressively towards the finale
    baseColor = mix(baseColor, baseColor * 0.6, w6 * 0.8);

    // Global Post-Processing
    // 1. Contrast & Brightness
    baseColor *= p_brightness;
    baseColor = clamp((baseColor - 0.5) * p_contrast + 0.5, 0.0, 1.0);

    // 2. Cinematic Vignette
    float vig = length(uv - 0.5) * 2.0;
    float vignetteStrength = mix(0.65, 0.9, w6); // Darker vignette in finale
    baseColor *= 1.0 - smoothstep(0.6, 1.5, vig) * vignetteStrength;

    // 3. Film Grain
    float grain = hash(uv * 133.33 + uTime * 100.0);
    float grainStrength = mix(0.04, 0.08, envNoise);
    baseColor += (grain - 0.5) * grainStrength;

    gl_FragColor = vec4(baseColor, 1.0);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function ProceduralBackground({
  scroll,
  className = "",
}: {
  scroll: RefObject<number>;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uProgress = gl.getUniformLocation(program, "uProgress");

    let animationFrameId: number;
    let startTime = performance.now();

    const resize = () => {
      // Limit DPI to 1.5 to maintain solid 60FPS on high-DPI laptops/mobiles
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const displayWidth = Math.round(canvas.clientWidth * dpr);
      const displayHeight = Math.round(canvas.clientHeight * dpr);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      }
    };

    const render = (now: number) => {
      resize();

      gl.useProgram(program);

      // Pass Resolution
      gl.uniform2f(uResolution, gl.canvas.width, gl.canvas.height);

      // Pass Time
      const time = (now - startTime) / 1000;
      gl.uniform1f(uTime, time);

      // Pass Scroll Progress (Read directly from ref to avoid React renders)
      const currentProgress = scroll.current || 0;
      gl.uniform1f(uProgress, currentProgress);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [scroll]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
