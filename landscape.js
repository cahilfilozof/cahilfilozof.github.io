import * as THREE from './vendor/three.module.min.js';

// Original conceptual terrain, not a survey or an existing portfolio project.
const host = document.querySelector('#landscape-scene');
const hero = document.querySelector('.hero');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
} catch {
  hero.classList.add('terrain-fallback');
}
if (renderer) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 80);
  camera.position.set(8, 7.5, 10);
  camera.lookAt(0, .1, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.setClearColor(0x000000, 0);
  host.append(renderer.domElement);
  host.classList.add('ready');
  hero.classList.add('has-webgl');
  const world = new THREE.Group();
  world.rotation.y = -.32;
  scene.add(world);
  scene.add(new THREE.HemisphereLight(0xfff6e6, 0x4c6686, 2.7));
  const sun = new THREE.DirectionalLight(0xffe9cc, 3.2);
  sun.position.set(-4, 8, 6);
  scene.add(sun);
  function height(x, z) {
    return .08 + 1.75 * Math.exp(-((x + .7) ** 2 / 4.5 + (z + .55) ** 2 / 3.1)) + .7 * Math.exp(-((x - 1.6) ** 2 / 1.3 + (z - .6) ** 2 / 2.1)) + .13 * Math.sin(x * 2 + z) * Math.cos(z * 1.4);
  }
  const geometry = new THREE.PlaneGeometry(7.2, 6.2, 100, 90);
  geometry.rotateX(-Math.PI / 2);
  const positions = geometry.attributes.position;
  const colors = [];
  const low = new THREE.Color('#91b9a0'), high = new THREE.Color('#dfe6a4');
  for (let i = 0; i < positions.count; i++) {
    const h = height(positions.getX(i), positions.getZ(i));
    positions.setY(i, h);
    const color = low.clone().lerp(high, Math.min(1, h / 2));
    colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .94, side: THREE.DoubleSide });
  material.onBeforeCompile = shader => {
    shader.vertexShader = 'varying float vElevation;\n' + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvElevation = position.y;');
    shader.fragmentShader = 'varying float vElevation;\n' + shader.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\nfloat contour = abs(fract(vElevation * 8.0 - 0.5) - 0.5) / max(fwidth(vElevation * 8.0), 0.001);\nfloat line = 1.0 - smoothstep(0.0, 1.0, contour);\ndiffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.19, 0.34, 0.28), line * 0.43);');
  };
  world.add(new THREE.Mesh(geometry, material));
  const base = new THREE.Mesh(new THREE.BoxGeometry(7.2, .28, 6.2), new THREE.MeshStandardMaterial({ color: '#bc8c66', roughness: 1 }));
  base.position.y = -.2;
  world.add(base);
  const waterMaterial = new THREE.ShaderMaterial({
    transparent: true, side: THREE.DoubleSide,
    uniforms: { time: { value: 0 }, tint: { value: new THREE.Color('#468faa') } },
    vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader: 'varying vec2 vUv; uniform float time; uniform vec3 tint; void main(){float wave=sin(vUv.x*90.0+sin(vUv.y*20.0+time)*2.0+time)*.035;gl_FragColor=vec4(tint+wave,0.76);}'
  });
  const water = new THREE.Mesh(new THREE.PlaneGeometry(7.18, 6.18), waterMaterial);
  water.rotation.x = -Math.PI / 2;
  water.position.y = .16;
  world.add(water);
  const trees = new THREE.Group();
  const trunkGeometry = new THREE.CylinderGeometry(.022, .028, .23, 5);
  const crownGeometry = new THREE.IcosahedronGeometry(.17, 1);
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: '#806749' });
  const crownMaterials = ['#397460', '#578e65', '#bec76c', '#cf997a'].map(color => new THREE.MeshStandardMaterial({ color, roughness: 1 }));
  for (let i = 0; i < 68; i++) {
    const x = Math.sin(i * 123.4) * 3.1, z = Math.cos(i * 47.7) * 2.7, y = height(x, z);
    if (y < .31 || Math.abs(z - Math.sin(x) * .55) < .22) continue;
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = .12;
    const crown = new THREE.Mesh(crownGeometry, crownMaterials[i % 4]);
    crown.position.y = .34;
    crown.scale.y = 1.3 + (i % 3) * .2;
    tree.add(trunk, crown);
    tree.position.set(x, y, z);
    trees.add(tree);
  }
  world.add(trees);
  const routePoints = [];
  for (let i = 0; i <= 90; i++) {
    const x = -3.25 + i / 90 * 6.5, z = Math.sin(x) * .55;
    routePoints.push(new THREE.Vector3(x, height(x, z) + .026, z));
  }
  world.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(routePoints), 110, .035, 5, false), new THREE.MeshStandardMaterial({ color: '#eed6b8' })));
  const target = { rotation: -.32, tilt: 0, water: .16, treeScale: 1 };
  let visible = true, running = false, frame = 0, time = 0, previousTime = 0;
  const motion = () => window.portfolioMotion?.enabled ?? !matchMedia('(prefers-reduced-motion: reduce)').matches;
  function render(now = 0) {
    const delta = Math.max(0, Math.min((now - previousTime) / 1000, .05));
    previousTime = now;
    if (motion()) time += delta;
    world.rotation.y += (target.rotation - world.rotation.y) * .045;
    world.rotation.x += (target.tilt - world.rotation.x) * .045;
    water.position.y += (target.water - water.position.y) * .04;
    // Grow each crown in place, keeping its trunk rooted in the terrain.
    trees.children.forEach(tree => { const crown = tree.children[1]; crown.scale.x += (target.treeScale - crown.scale.x) * .06; crown.scale.z = crown.scale.x; });
    world.position.y = motion() ? Math.sin(time * .45) * .055 : 0;
    waterMaterial.uniforms.time.value = time * .65;
    renderer.render(scene, camera);
    if (running) frame = requestAnimationFrame(render);
  }
  function sync() {
    cancelAnimationFrame(frame);
    running = visible && !document.hidden && motion();
    previousTime = performance.now();
    render(previousTime);
  }
  function resize() {
    const { width, height: h } = host.getBoundingClientRect();
    if (!width || !h) return;
    camera.aspect = width / h;
    camera.position.set(8, 7.5, 10).multiplyScalar(camera.aspect < 1 ? 1.2 : 1);
    camera.updateProjectionMatrix();
    renderer.setSize(width, h);
    if (!running) render();
  }
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { threshold: 0 }).observe(host);
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('motionchange', sync);
  hero.addEventListener('pointermove', event => {
    if (!motion() || event.pointerType !== 'mouse') return;
    const r = host.getBoundingClientRect();
    target.rotation = -.32 + Math.max(-.5, Math.min(.5, (event.clientX - r.left) / r.width - .5)) * .55;
    target.tilt = ((event.clientY - r.top) / r.height - .5) * .08;
  });
  hero.addEventListener('pointerleave', () => { target.rotation = -.32; target.tilt = 0; });
  document.querySelectorAll('[data-layer]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-layer]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    target.water = button.dataset.layer === 'water' ? .48 : .16;
    target.treeScale = button.dataset.layer === 'ecology' ? 1.65 : 1;
    hero.dataset.layer = button.dataset.layer;
    if (!motion()) { water.position.y = target.water; trees.children.forEach(tree => { tree.children[1].scale.x = tree.children[1].scale.z = target.treeScale; }); render(); }
  }));
  renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); running = false; cancelAnimationFrame(frame); host.classList.remove('ready'); hero.classList.remove('has-webgl'); hero.classList.add('terrain-fallback'); });
  renderer.domElement.addEventListener('webglcontextrestored', () => { host.classList.add('ready'); hero.classList.add('has-webgl'); hero.classList.remove('terrain-fallback'); sync(); });
  resize();
  sync();
}
