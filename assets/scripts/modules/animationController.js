export class AnimationController {
  constructor({ overlay, slot, revealDuration = 880, tailDelay = 480 }) {
    this.overlay = overlay;
    this.slot = slot;
    this.revealDuration = revealDuration;
    this.tailDelay = tailDelay;
    this.isAnimating = false;
  }

  async playSequence(characters) {
    if (this.isAnimating) {
      return;
    }
    this.isAnimating = true;
    this.showOverlay();
    for (const char of characters) {
      await this.reveal(char);
    }
    await this.delay(this.tailDelay);
    this.hideOverlay();
    this.isAnimating = false;
  }

  async reveal(char) {
    this.slot.innerHTML = '';
    const element = document.createElement('span');
    element.className = 'animation__slot-character';
    element.textContent = char;
    this.slot.appendChild(element);
    void element.offsetWidth;
    element.classList.add('animation__slot-character--active');
    await this.delay(this.revealDuration);
  }

  showOverlay() {
    this.overlay.classList.add('animation--visible');
    this.overlay.setAttribute('aria-hidden', 'false');
  }

  hideOverlay() {
    this.overlay.classList.remove('animation--visible');
    this.overlay.setAttribute('aria-hidden', 'true');
    this.slot.innerHTML = '';
  }

  delay(duration) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, duration);
    });
  }
}
