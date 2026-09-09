export function navigate(href) {
  const path = href.startsWith('/') ? href : `/${href}`
  const hash = `#${path}`
  if (window.location.hash === hash) return
  window.location.hash = path
}

export function handleInternalNavigation(event, href) {
  if (event.defaultPrevented || (event.button != null && event.button !== 0) || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  navigate(href)
}
