import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import lottie from 'lottie-web'
import animationData from './assets/headeranimation.json'

gsap.registerPlugin(ScrollTrigger)

let hasStarted = false

// Load Lottie animation
const animation = lottie.loadAnimation({
  container: document.getElementById('lottie-container'),
  renderer: 'svg',
  loop: false,
  autoplay: false,
  animationData: animationData
})

// Play only the "loop" marker segment
animation.addEventListener('DOMLoaded', () => {
  const markers = animation.markers
  const loopMarker = markers?.find(marker => marker.payload?.name === 'loop' || marker.cm === 'loop')

  if (loopMarker) {
    const loopStart = loopMarker.tm
    const loopEnd = animation.totalFrames - 1

    // Wait for first complete, then set up the loop
    let hasPlayedOnce = false

    animation.addEventListener('enterFrame', (e) => {
      if (!hasPlayedOnce && e.currentTime >= loopStart) {
        hasPlayedOnce = true
        animation.loop = false
      }
    })

    animation.addEventListener('complete', () => {
      if (hasPlayedOnce) {
        animation.playSegments([loopStart, loopEnd], true)
      }
    })
  } else {
    // Fallback: just loop the whole animation
    animation.loop = true
  }
})

// Click to play
const lottieContainer = document.getElementById('lottie-container')
lottieContainer.classList.add('grayscale')

lottieContainer.addEventListener('click', () => {
  if (!hasStarted) {
    hasStarted = true
    // Remove grayscale from all elements
    document.querySelectorAll('.grayscale').forEach(el => {
      el.classList.remove('grayscale')
    })
    animation.play()
  }
})

// Fade in the Lottie container
gsap.to('.lottie-container', {
  opacity: 1,
  duration: 0.5
})
