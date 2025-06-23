import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

export function init3DAnimation(containerId: string): void {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 5);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const container = document.getElementById(containerId);
  if (!container) return;
  container.appendChild(renderer.domElement);

  const loader = new GLTFLoader();
  loader.load('assets/models/pear_product.glb', gltf => {
    const model = gltf.scene;
    model.rotation.y = Math.PI;
    scene.add(model);

    gsap.to(model.rotation, {
      y: 0,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    animate();
  });

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
}

export function initScrollAnimations(): void {
  document.querySelectorAll<HTMLElement>('.feature').forEach(el => {
    gsap.to(el, {
      y: () => window.innerHeight * +el.dataset['speed']!,
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  gsap.fromTo('.overlay-text', { opacity: 0, y: 50 }, {
    opacity: 1, y: 0,
    scrollTrigger: {
      trigger: '#cinematic',
      start: 'top center',
      end: 'bottom center',
      scrub: true
    }
  });

  ScrollTrigger.create({
    trigger: '#shop',
    onUpdate: ({ progress }) => {
      const bg = document.querySelector<HTMLElement>('.shop-bg');
      if (bg) {
        bg.style.transform = `translateY(${ -20 + progress * 20 }%)`;
      }
    }
  });
}
