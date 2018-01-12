import StartAudioContext from 'startaudiocontext'
import audio from './Audio'

const defaultFontSize = 144
const transitionDelay = 250 // match `#messages > div.on` in style.css
const timeScale = 1.2

class Narrative {
  constructor() {
    this._stepIds = [
      'greeting',
      'tap-low',
      'lower',
      'tap-low-again',
      'tap-low-again-2',
      'tap-high',
      'tap-high-again',
      'tap-high-again-2',
      'nice'
    ]

    this._currentStepId = 'greeting'

    this._messageEls = document.querySelectorAll('#messages div')

    const fontSize = Math.min(window.innerWidth / 5.0, defaultFontSize)
    this._messageEls.forEach(messageEl => {
      if (messageEl.id === 'loading') {
        return
      }
      messageEl.style.fontSize = `${fontSize}px`
    })
  }

  begin() {
    this._startAudioContext()
  }

  greet() {
    this._displayMessage('greeting')
    this._delayStepTo('pre-prompt', 5000)
      .then(() => this._delayStepTo('prompt-i-1', 1000))
  }

  tapped() {
    if (this._currentStepId === 'prompt-i-1') {
      this._stepTo('prompt-i-1-response')
      this._delayStepTo('prompt-i-2', 1000)
    } else if (this._currentStepId === 'prompt-i-2') {
      this._stepTo('prompt-i-3')
    } else if (this._currentStepId === 'prompt-i-3') {
      this._stepTo('prompt-i-3-response')
      this.explain()
    } else if (this._currentStepId === 'prompt-ii') {
      this._stepTo('prompt-ii-1')
    } else if (this._currentStepId === 'prompt-ii-1') {
      this._stepTo('prompt-ii-2')
    } else if (this._currentStepId === 'prompt-ii-2') {
      this._stepTo('prompt-ii-3')
    } else if (this._currentStepId === 'prompt-ii-3') {
      this._stepTo('prompt-ii-4')
    } else if (this._currentStepId === 'prompt-ii-4') {
      this._stepTo('prompt-ii-5')
      this._delayStepTo('review-1', 500)
        .then(() => this._delayStepTo('review-2', 4000))
        .then(() => this._delayStepTo('review-3', 2000))
        .then(() => this._delayStepTo('review-4', 2000))
        .then(() => this._delayStepTo('greeting', 1000))
    }
  }

  explain() {
    this._delayStepTo('explanation-0', 2000)
      .then(() => this._delayStepTo('explanation-1', 2000))
      .then(() => this._delayStepTo('explanation-2', 2000))
      .then(() => this._delayStepTo('explanation-3', 2000))
      .then(() => this._delayStepTo('explanation-4', 2000))
      .then(() => this._delayStepTo('pre-prompt-ii', 2000))
      .then(() => this._delayStepTo('prompt-ii', 500))
  }

  explainStorm() {
    this._delayStepTo('storm-1', 0)
      .then(() => this._delayStepTo('storm-2', 2000))
      .then(() => this._delayStepTo('storm-3', 2000))
      .then(() => this._delayStepTo('storm-4', 2000))
      .then(() => this._delayStepTo('post-storm', 2000))
      .then(() => this._delayStepTo('greeting', 500))
  }

  _stepTo(id) {
    this._currentStepId = id
    this._displayMessage(id)
  }

  _displayMessage(id) {
    this._hideMessages()
    this._getMessageEl(id).className = 'on'
  }

  _delayStepTo(messageId, duration) {
    return new Promise((resolve, reject) => {
      setTimeout(
        () => {
          this._stepTo(messageId)
          resolve()
        },
        duration * timeScale + transitionDelay
      )
    })
  }

  _hideMessages() {
    this._messageEls.forEach(el => el.className = '')
  }

  _getMessageEl(id) {
    return document.querySelector(`#messages #${id}`)
  }

  _startAudioContext() {
    const unmuteEl = document.querySelector('a#play-sound')
    unmuteEl.classList.add('on')
    this._hideMessages()
    StartAudioContext(audio.getContext(), unmuteEl, () => {
      this.greet()
      unmuteEl.remove()
    })
  }
}

export default new Narrative
