export function navigate(href) {
  if (window.location.pathname === href) return
  window.history.pushState({}, '', href)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function handleInternalNavigation(event, href) {
  if (event.defaultPrevented || (event.button != null && event.button !== 0) || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  navigate(href)
}
