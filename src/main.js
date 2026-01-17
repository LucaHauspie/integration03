import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import lottie from 'lottie-web'
import animationData from './assets/int3.json'

gsap.registerPlugin(ScrollTrigger)

// Load Lottie animation
const animation = lottie.loadAnimation({
  container: document.getElementById('lottie-container'),
  renderer: 'svg',
  loop: false,
  autoplay: false,
  animationData: animationData
})

// Fade in the Lottie container
gsap.to('.lottie-container', {
  opacity: 1,
  duration: 0.5
})

// ScrollTrigger to control Lottie animation playback
gsap.to(animation, {
  frame: animation.totalFrames - 1,
  scrollTrigger: {
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
    markers: false,
    onUpdate: (self) => {
      animation.goToAndStop(self.progress * (animation.totalFrames - 1), true)
    }
  }
})

// ScrollTrigger animation for container width
gsap.to('.container', {
  width: '50vw',
  scrollTrigger: {
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
    markers: false
  }
})
