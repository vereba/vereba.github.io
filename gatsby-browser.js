// Prevent right-click save and drag-out on artwork images
exports.onClientEntry = () => {
  document.addEventListener("contextmenu", (e) => {
    if (e.target instanceof HTMLImageElement) {
      e.preventDefault()
    }
  })

  document.addEventListener("dragstart", (e) => {
    if (e.target instanceof HTMLImageElement) {
      e.preventDefault()
    }
  })
}
