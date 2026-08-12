export function getTheme() {
  return document.documentElement.className
}

export function toggleTheme() {
  const current = getTheme()
  const next = current === 'theme-carbon' ? 'theme-marino' : 'theme-carbon'
  document.documentElement.className = next
  localStorage.setItem('theme', next)
  return next
}
