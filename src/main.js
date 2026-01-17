import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let hasStarted = false
let animation = null
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Setup loop marker segment playback
 */
const setupLoopMarker = () => {
  const markers = animation.markers
  const loopMarker = markers?.find(marker => marker.payload?.name === 'loop' || marker.cm === 'loop')

  if (loopMarker) {
    const loopStart = loopMarker.tm
    const loopEnd = animation.totalFrames - 1
    let hasPlayedOnce = false

    animation.addEventListener('enterFrame', (e) => {
      if (!hasPlayedOnce && e.currentTime >= loopStart) {
        hasPlayedOnce = true
        animation.loop = false
      }
    })

    animation.addEventListener('complete', () => {
      if (hasPlayedOnce && !prefersReducedMotion) {
        animation.playSegments([loopStart, loopEnd], true)
      }
    })
  } else {
    animation.loop = !prefersReducedMotion
  }
}

/**
 * Initialize Lottie animation with loop marker support
 * Uses dynamic import for code-splitting to reduce initial bundle size
 */
const initLottieAnimation = async () => {
  // Dynamically import lottie-web and animation data
  const [{ default: lottie }, { default: animationData }] = await Promise.all([
    import('lottie-web'),
    import('./assets/headeranimation.json')
  ])

  animation = lottie.loadAnimation({
    container: document.getElementById('lottie-container'),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    animationData: animationData
  })

  animation.addEventListener('DOMLoaded', setupLoopMarker)
}

// Track all animated images globally
let allAnimatedImages = []
const MAX_VISIBLE_IMAGES = 2

/**
 * Get count of currently visible images
 */
const getVisibleCount = () => {
  return allAnimatedImages.filter(img => img.style.opacity === '1').length
}

/**
 * Hide a random visible image
 */
const hideRandomVisibleImage = () => {
  const visibleImages = allAnimatedImages.filter(img => img.style.opacity === '1')
  if (visibleImages.length > 0) {
    const randomIndex = Math.floor(Math.random() * visibleImages.length)
    visibleImages[randomIndex].style.opacity = '0'
  }
}

/**
 * Create and animate random Walt images
 */
const animateWaltImages = () => {
  const header = document.querySelector('.header')
  const waltImages = []

  // Create 5 walt image elements
  for (let i = 1; i <= 5; i++) {
    const img = document.createElement('img')
    img.src = new URL(`./assets/walt${i}.jpg`, import.meta.url).href
    img.alt = `Walter Van Beirendonck ${i}`
    img.className = 'walt-image'
    img.style.opacity = '0'
    header.appendChild(img)
    waltImages.push(img)
    allAnimatedImages.push(img)
  }

  // Randomly show/hide images instantly
  const toggleRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * waltImages.length)
    const img = waltImages[randomIndex]
    const isVisible = img.style.opacity === '1'

    if (isVisible) {
      // Hide image instantly
      img.style.opacity = '0'
    } else {
      // Check if we're at max visible limit
      if (getVisibleCount() >= MAX_VISIBLE_IMAGES) {
        hideRandomVisibleImage()
      }

      // Show image at random position instantly
      const headerRect = header.getBoundingClientRect()
      const maxX = headerRect.width - 50
      const maxY = headerRect.height - 50
      const randomX = Math.random() * Math.max(0, maxX)
      const randomY = Math.random() * Math.max(0, maxY)

      img.style.left = `${randomX}px`
      img.style.top = `${randomY}px`
      img.style.opacity = '1'
    }
  }

  // Start random loop with moderate timing
  setInterval(toggleRandomImage, 500)
}

/**
 * Create and animate special effect images with animations
 */
const animateSpecialImages = () => {
  const header = document.querySelector('.header')
  const specialImages = []

  // Define special images with their animation classes
  const imageConfigs = [
    { name: 'asianletter', className: 'special-image special-image--swing' },
    { name: 'boom', className: 'special-image special-image--pulse' },
    { name: 'radioactive', className: 'special-image special-image--spin' },
    { name: 'radioactive2', className: 'special-image special-image--spin' }
  ]

  // Create special image elements
  imageConfigs.forEach(config => {
    const img = document.createElement('img')
    img.src = new URL(`./assets/${config.name}.svg`, import.meta.url).href
    img.alt = config.name
    img.className = config.className
    img.style.opacity = '0'
    header.appendChild(img)
    specialImages.push(img)
    allAnimatedImages.push(img)
  })

  // Randomly show/hide special images
  const toggleRandomSpecialImage = () => {
    const randomIndex = Math.floor(Math.random() * specialImages.length)
    const img = specialImages[randomIndex]
    const isVisible = img.style.opacity === '1'

    if (isVisible) {
      // Hide image
      img.style.opacity = '0'
    } else {
      // Check if we're at max visible limit
      if (getVisibleCount() >= MAX_VISIBLE_IMAGES) {
        hideRandomVisibleImage()
      }

      // Show image at random position
      const headerRect = header.getBoundingClientRect()
      const maxX = headerRect.width - 80
      const maxY = headerRect.height - 80
      const randomX = Math.random() * Math.max(0, maxX)
      const randomY = Math.random() * Math.max(0, maxY)

      img.style.left = `${randomX}px`
      img.style.top = `${randomY}px`
      img.style.opacity = '1'
    }
  }

  // Start random loop with slower timing
  setInterval(toggleRandomSpecialImage, 900)
}

/**
 * Handle animation click interaction
 */
const initClickInteraction = () => {
  const lottieContainer = document.getElementById('lottie-container')
  const header = document.querySelector('.header');
  const h1 = document.querySelector('h1');
  const subtitle = document.querySelector('.subtitle');

  lottieContainer.addEventListener('click', () => {
    if (!hasStarted) {
      hasStarted = true

      // Remove floating animation
      lottieContainer.classList.add('lottie-container--playing')

      // Remove grayscale from header
      header.classList.remove('grayscale');
      h1.classList.remove('grayscale');
      subtitle.classList.remove('grayscale');

      // Hide all hoek images
      const hoekImages = document.querySelectorAll('.header-grid__hoek')
      hoekImages.forEach(img => {
        if (!prefersReducedMotion) {
          img.style.opacity = '0'
          img.style.transition = 'opacity 0.5s ease'
          setTimeout(() => img.style.display = 'none', 500)
        } else {
          img.style.display = 'none'
        }
      })

      // Start Walt images animation
      animateWaltImages()

      // Start special images animation
      animateSpecialImages()

      animation.play()
    }
  })
}

/**
 * Fade in the Lottie container
 */
const initFadeInAnimation = () => {
  gsap.to('.lottie-container', {
    opacity: 1,
    duration: 0.5
  })
}

/**
 * Initialize all hero section functionality
 */
const init = () => {
  initLottieAnimation()
  initClickInteraction()
  initFadeInAnimation()
}

// Start initialization
init()
