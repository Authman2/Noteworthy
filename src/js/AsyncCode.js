self.addEventListener('message', (event) => {
    self.postMessage(0);    // Notification for saving in the background.
})