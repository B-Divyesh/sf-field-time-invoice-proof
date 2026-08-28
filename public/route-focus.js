const announceRoute = () => {
  const heading = document.querySelector('h1')
  const announcer = document.querySelector('#route-announcer')
  if (!heading || !announcer) return
  heading.setAttribute('tabindex', '-1')
  heading.focus({ preventScroll: true })
  announcer.textContent = document.title
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', announceRoute, { once: true })
} else {
  announceRoute()
}

window.addEventListener('pageshow', (event) => {
  if (event.persisted) window.setTimeout(announceRoute, 0)
})
