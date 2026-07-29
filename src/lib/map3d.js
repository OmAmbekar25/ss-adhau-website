import * as THREE from "three";
import gsap from "gsap";

/**
 * 3D extruded map of MP + Maharashtra with a survey-beacon journey.
 *
 * The travelling light is a diamond survey beacon (octahedron) with a
 * comet tail stretched along its direction of travel. It docks into each
 * station on arrival (shrinks/merges), the station "receives the signal"
 * (ripple + scan wave + drifting particles), then the beacon re-emerges
 * toward the next city.
 *
 * Driven imperatively from MapJourney's ScrollTrigger:
 *   setCamera({cx, cy, k})
 *   setProgress(q)         — station i is hit exactly at q = i/(N-1)
 *   setActive(idx, finale)
 *   arriveAt(idx)          — one-shot arrival pulse (scan ring etc.)
 *   finaleWave()           — sequential light-up + pulse along the route,
 *                            returns the gsap timeline (kill to cancel)
 *   dispose()
 */

const DEPTH = 7;
const GOLD = 0xa9752e;
const GOLD_LIGHT = 0xc89b52;
const CREAM = 0xfff3da;

function ringToShape(ring) {
  const shape = new THREE.Shape();
  ring.forEach(([x, y], i) => {
    if (i === 0) shape.moveTo(x, -y);
    else shape.lineTo(x, -y);
  });
  shape.closePath();
  return shape;
}

export function createMap3D(container, { polyMP, polyMH, cityPts, labelEls }) {
  const N = cityPts.length;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 1, 6000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0x070606, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const disposables = [];
  const track = (obj) => {
    disposables.push(obj);
    return obj;
  };

  /* ---------- lights (hemisphere "breathes" very slightly) ---------- */
  const hemi = new THREE.HemisphereLight(0xffffff, 0xd8d0c0, 1.05);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffffff, 1.3);
  sun.position.set(300, 650, -250);
  scene.add(sun);

  /* ---------- extruded districts ---------- */
  const buildState = (rings, color) => {
    const mat = track(
      new THREE.MeshStandardMaterial({ color, roughness: 0.92, metalness: 0 })
    );
    const group = new THREE.Group();
    rings.forEach((ring) => {
      const geo = track(
        new THREE.ExtrudeGeometry(ringToShape(ring), {
          depth: DEPTH,
          bevelEnabled: false,
        })
      );
      geo.rotateX(-Math.PI / 2);
      group.add(new THREE.Mesh(geo, mat));
    });
    return group;
  };
  scene.add(buildState(polyMP, 0xffffff));
  scene.add(buildState(polyMH, 0xf6f2e9));

  const lineMat = track(new THREE.LineBasicMaterial({ color: 0xd8d5cc }));
  [...polyMP, ...polyMH].forEach((ring) => {
    const pts = ring.map(([x, y]) => new THREE.Vector3(x, DEPTH + 0.25, y));
    const geo = track(new THREE.BufferGeometry().setFromPoints(pts));
    scene.add(new THREE.LineLoop(geo, lineMat));
  });

  /* ---------- route: thin metallic rail + golden light inside ------- */
  const curve = new THREE.CatmullRomCurve3(
    cityPts.map((p) => new THREE.Vector3(p.x, DEPTH + 2.2, p.y))
  );

  const TUBULAR = 400;
  const RADIAL = 8;
  const INDICES_PER_SEG = RADIAL * 6;

  const rail = new THREE.Mesh(
    track(new THREE.TubeGeometry(curve, TUBULAR, 0.45, RADIAL)),
    track(
      new THREE.MeshStandardMaterial({
        color: 0xb9b5aa,
        metalness: 0.75,
        roughness: 0.35,
      })
    )
  );
  scene.add(rail);

  const goldTube = new THREE.Mesh(
    track(new THREE.TubeGeometry(curve, TUBULAR, 0.55, RADIAL)),
    track(
      new THREE.MeshStandardMaterial({
        color: GOLD,
        emissive: GOLD_LIGHT,
        emissiveIntensity: 0.9,
        roughness: 0.4,
      })
    )
  );
  goldTube.geometry.setDrawRange(0, 0);
  scene.add(goldTube);

  /* soft light halo around the filled portion */
  const halo = new THREE.Mesh(
    track(new THREE.TubeGeometry(curve, TUBULAR, 1.2, RADIAL)),
    track(
      new THREE.MeshBasicMaterial({
        color: GOLD_LIGHT,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    )
  );
  halo.geometry.setDrawRange(0, 0);
  scene.add(halo);

  /* ---------- stations: flat rings with a core ---------- */
  const todoTorusMat = track(
    new THREE.MeshStandardMaterial({ color: 0xc9c5b9, roughness: 0.7 })
  );
  const doneTorusMat = track(
    new THREE.MeshStandardMaterial({
      color: GOLD,
      emissive: GOLD_LIGHT,
      emissiveIntensity: 0.55,
      roughness: 0.45,
    })
  );
  const coreMat = track(
    new THREE.MeshStandardMaterial({
      color: CREAM,
      emissive: 0xe9c98f,
      emissiveIntensity: 1.1,
      roughness: 0.3,
    })
  );
  const torusGeo = track(new THREE.TorusGeometry(2.6, 0.45, 12, 32));
  torusGeo.rotateX(Math.PI / 2);
  const coreGeo = track(new THREE.CylinderGeometry(0.9, 0.9, 0.8, 16));

  const stations = cityPts.map((p) => {
    const g = new THREE.Group();
    const torus = new THREE.Mesh(torusGeo, todoTorusMat);
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.visible = false;
    g.add(torus, core);
    g.position.set(p.x, DEPTH + 1, p.y);
    scene.add(g);
    return { g, torus, core };
  });

  /* ---------- survey beacon (◆) with comet tail ---------- */
  const beacon = new THREE.Group();
  const diamond = new THREE.Mesh(
    track(new THREE.OctahedronGeometry(2)),
    track(
      new THREE.MeshStandardMaterial({
        color: CREAM,
        emissive: 0xe9c98f,
        emissiveIntensity: 1.7,
        roughness: 0.15,
      })
    )
  );
  diamond.scale.set(0.8, 1.25, 0.8); // slightly elongated diamond
  const tailGeo = track(new THREE.ConeGeometry(0.9, 7, 10));
  tailGeo.rotateX(-Math.PI / 2); // apex trails behind (-z)
  const tailMat = track(
    new THREE.MeshBasicMaterial({
      color: GOLD_LIGHT,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  const tail = new THREE.Mesh(tailGeo, tailMat);
  tail.position.z = -4.2;
  const beaconLight = new THREE.PointLight(GOLD_LIGHT, 260, 90, 2);
  beacon.add(diamond, tail, beaconLight);
  scene.add(beacon);

  /* ---------- pulse props: scan rings, particles, finale pulse ------ */
  const scanRings = [0, 1].map(() => {
    const m = new THREE.Mesh(
      track(new THREE.RingGeometry(1, 1.25, 48)),
      track(
        new THREE.MeshBasicMaterial({
          color: GOLD_LIGHT,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      )
    );
    m.geometry.rotateX(-Math.PI / 2);
    m.visible = false;
    scene.add(m);
    return m;
  });
  let scanIdx = 0;

  const particleGeo = track(new THREE.SphereGeometry(0.45, 8, 8));
  const particles = Array.from({ length: 10 }, () => {
    const mat = track(
      new THREE.MeshBasicMaterial({
        color: GOLD_LIGHT,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      })
    );
    const m = new THREE.Mesh(particleGeo, mat);
    m.visible = false;
    scene.add(m);
    return m;
  });

  const finalePulse = new THREE.Mesh(
    track(new THREE.SphereGeometry(2.2, 16, 16)),
    track(
      new THREE.MeshBasicMaterial({
        color: CREAM,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    )
  );
  finalePulse.visible = false;
  scene.add(finalePulse);

  /* ---------- ambient dust (barely-there drift) ---------- */
  const DUST = 130;
  const dustPos = new Float32Array(DUST * 3);
  const dustBaseY = new Float32Array(DUST);
  const dustPhase = new Float32Array(DUST);
  for (let i = 0; i < DUST; i++) {
    dustPos[i * 3] = 40 + Math.random() * 920;
    dustBaseY[i] = DEPTH + 6 + Math.random() * 70;
    dustPos[i * 3 + 1] = dustBaseY[i];
    dustPos[i * 3 + 2] = 40 + Math.random() * 1100;
    dustPhase[i] = Math.random() * Math.PI * 2;
  }
  const dustGeo = track(new THREE.BufferGeometry());
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(
    dustGeo,
    track(
      new THREE.PointsMaterial({
        color: GOLD_LIGHT,
        size: 1.5,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
      })
    )
  );
  scene.add(dust);

  /* ---------- state ---------- */
  const camState = { cx: 500, cy: 560, k: 1 };
  const beaconPos = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const lookAhead = new THREE.Vector3();

  const setCamera = ({ cx, cy, k }) => {
    Object.assign(camState, { cx, cy, k });
  };

  const setProgress = (q) => {
    curve.getPoint(q, beaconPos);
    beacon.position.copy(beaconPos);

    // orient tail opposite the direction of travel
    curve.getTangent(q, tangent);
    lookAhead.copy(beaconPos).add(tangent);
    beacon.lookAt(lookAhead);

    /* docking: shrink/merge into the station near arrival, re-emerge on
       departure. f = 0 docked, 1 travelling. */
    const s = q * (N - 1);
    const d = Math.abs(s - Math.round(s)); // 0..0.5 within segment
    const f = THREE.MathUtils.clamp(d / 0.1, 0, 1);
    const sc = 0.2 + 0.8 * f;
    beacon.scale.set(sc, sc, sc);
    tailMat.opacity = 0.35 * f;
    beaconLight.intensity = 90 + 190 * f;

    const seg = Math.floor(q * TUBULAR);
    goldTube.geometry.setDrawRange(0, seg * INDICES_PER_SEG);
    halo.geometry.setDrawRange(0, seg * INDICES_PER_SEG);
  };

  const setActive = (idx, finale) => {
    stations.forEach(({ g, torus, core }, i) => {
      const lit = finale || i <= idx;
      torus.material = lit ? doneTorusMat : todoTorusMat;
      core.visible = lit;
      if (!(i === idx && !finale)) g.scale.set(1, 1, 1);
    });
  };

  /* one-shot arrival: station receives the signal */
  const arriveAt = (idx) => {
    const { g, core } = stations[idx];
    const p = cityPts[idx];

    // station expands then settles
    gsap.fromTo(
      g.scale,
      { x: 1, y: 1, z: 1 },
      {
        x: 1.45,
        y: 1.45,
        z: 1.45,
        duration: 0.35,
        ease: "power3.out",
        yoyo: true,
        repeat: 1,
        repeatDelay: 0.15,
      }
    );
    // inner core pulse
    gsap.fromTo(
      core.scale,
      { x: 1, y: 1, z: 1 },
      { x: 1.8, y: 2.2, z: 1.8, duration: 0.3, ease: "power2.out", yoyo: true, repeat: 1 }
    );

    // one soft expanding scan wave — "inspection completed"
    const ring = scanRings[scanIdx++ % scanRings.length];
    ring.position.set(p.x, DEPTH + 0.6, p.y);
    ring.visible = true;
    gsap.fromTo(
      ring.scale,
      { x: 1, y: 1, z: 1 },
      { x: 22, y: 22, z: 22, duration: 1.1, ease: "power2.out" }
    );
    gsap.fromTo(
      ring.material,
      { opacity: 0.5 },
      {
        opacity: 0,
        duration: 1.1,
        ease: "power2.out",
        onComplete: () => (ring.visible = false),
      }
    );

    // tiny particles drift away
    particles.forEach((m) => {
      const a = Math.random() * Math.PI * 2;
      const r = 6 + Math.random() * 9;
      m.position.set(p.x, DEPTH + 2, p.y);
      m.visible = true;
      m.material.opacity = 0.7;
      gsap.to(m.position, {
        x: p.x + Math.cos(a) * r,
        y: DEPTH + 5 + Math.random() * 6,
        z: p.y + Math.sin(a) * r,
        duration: 0.9,
        ease: "power2.out",
      });
      gsap.to(m.material, {
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        onComplete: () => (m.visible = false),
      });
    });
  };

  /* finale: stations light one after another, then a pulse runs the route */
  const finaleWave = () => {
    const tl = gsap.timeline();
    stations.forEach(({ g, torus, core }, i) => {
      tl.call(
        () => {
          torus.material = doneTorusMat;
          core.visible = true;
          gsap.fromTo(
            g.scale,
            { x: 1, y: 1, z: 1 },
            { x: 1.4, y: 1.4, z: 1.4, duration: 0.25, ease: "power3.out", yoyo: true, repeat: 1 }
          );
        },
        null,
        i * 0.08
      );
    });
    const runner = { v: 0 };
    tl.to(
      runner,
      {
        v: 1,
        duration: 0.9,
        ease: "power2.inOut",
        onStart: () => {
          finalePulse.visible = true;
          finalePulse.material.opacity = 0.85;
        },
        onUpdate: () => {
          finalePulse.position.copy(curve.getPoint(runner.v));
        },
        onComplete: () => {
          gsap.to(finalePulse.material, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => (finalePulse.visible = false),
          });
        },
      },
      N * 0.08 + 0.1
    );
    return tl;
  };

  /* ---------- render loop ---------- */
  /* THREE.Clock is deprecated in this three.js version — plain timing
     needs no replacement API. */
  const t0 = performance.now();
  const elapsed = () => (performance.now() - t0) / 1000;
  const labelV = new THREE.Vector3();
  let raf;
  let w = 1;
  let h = 1;

  const render = () => {
    raf = requestAnimationFrame(render);
    const t = elapsed();

    // beacon idle spin
    diamond.rotation.y = t * 1.2;

    // ambient breathing + dust drift
    hemi.intensity = 1.05 + Math.sin(t * 0.4) * 0.045;
    const pos = dustGeo.attributes.position;
    for (let i = 0; i < DUST; i++) {
      pos.array[i * 3 + 1] = dustBaseY[i] + Math.sin(t * 0.25 + dustPhase[i]) * 3.5;
    }
    pos.needsUpdate = true;

    /* cinematic camera: keyframed target, gently pulled toward the
       beacon while zoomed in so the camera follows the journey */
    const dist = 950 / camState.k;
    const follow = 0.3 * THREE.MathUtils.clamp((camState.k - 1.5) / 2, 0, 1);
    const tx = camState.cx * (1 - follow) + beacon.position.x * follow;
    const tz = camState.cy * (1 - follow) + beacon.position.z * follow;
    camera.position.set(tx, dist * 0.8, tz + dist * 0.62);
    camera.lookAt(tx, DEPTH, tz);

    renderer.render(scene, camera);

    labelEls.forEach((el, i) => {
      if (!el) return;
      const p = cityPts[i];
      labelV.set(p.x, DEPTH + 9, p.y).project(camera);
      const sx = (labelV.x * 0.5 + 0.5) * w;
      const sy = (-labelV.y * 0.5 + 0.5) * h;
      el.style.transform = `translate(-50%, -130%) translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px)`;
      el.style.display = labelV.z < 1 ? "" : "none";
    });
  };

  const resize = () => {
    w = container.clientWidth || 1;
    h = container.clientHeight || 1;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();
  setProgress(0);
  setActive(0, false);
  render();

  return {
    setCamera,
    setProgress,
    setActive,
    arriveAt,
    finaleWave,
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
