const run = () => {
  const params = new URL(window.location.href).searchParams
  const outcome = params.get('installation')
  const body = document.querySelector('body')
  const footer = document.createElement('footer')
  footer.classList.add('footer')

  if (outcome === 'success') {
    footer.innerHTML = 'Welcome to the cafe'
    body.appendChild(footer)
  }
  if (outcome === 'failure') {
    footer.innerHTML = 'Failed to enter the Cafe! Please try again!'
    body.appendChild(footer)
  }
}

run()