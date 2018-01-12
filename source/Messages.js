import StartAudioContext from 'startaudiocontext'
import audio from './Audio'

const greetingDuration = 5000

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
  }

  begin() {
    this._startAudioContext()
  }

  greet() {
    this._displayMessage('greeting')
    setTimeout(() => this.promptTap(), greetingDuration)
  }

  promptTap() {
    this._stepTo('tap-high')
  }

  tapped() {
    if (this._currentStepId === 'tap-far-side') {
      this._stepTo('tap-far-side-1')
    } else if (this._currentStepId === 'tap-far-side-1') {
      this._stepTo('tap-far-side-2')
    } else if (this._currentStepId === 'tap-far-side-2') {
      this._stepTo('tap-far-side-3')
    } else if (this._currentStepId === 'tap-far-side-3') {
      this._stepTo('tap-far-side-4')
    } else if (this._currentStepId === 'tap-far-side-4') {
      this._stepTo('tap-far-side-5')
      setTimeout(() => {
        this._stepTo('look-at-em')
        setTimeout(() => {
          this.wrapUp()
        }, 3000)
      }, 500)
    }
  }

  tappedLow() {
    if (['tap-high', 'tap-high-again', 'tap-high-again-2'].includes(this._currentStepId)) {
      this._stepTo('higher')
    } else if (['tap-low', 'lower'].includes(this._currentStepId)) {
      this._stepTo('tap-low-again')
    } else if (this._currentStepId === 'tap-low-again') {
      this._stepTo('tap-low-again-2')
    } else if (this._currentStepId === 'tap-low-again-2') {
      this._stepTo('tap-high')
    }
  }

  tappedHigh() {
    if (['tap-low', 'tap-low-again', 'tap-low-again-2'].includes(this._currentStepId)) {
      this._stepTo('lower')
    } else if (['tap-high', 'higher'].includes(this._currentStepId)) {
      this._stepTo('tap-high-again')
    } else if (this._currentStepId === 'tap-high-again') {
      this._stepTo('tap-high-again-2')
      setTimeout(() => {
        this.explainRhythms()
      }, 1000)
    }
  }

  explainRhythms() {
    this._stepTo('rhythms')
    setTimeout(() => {
      this._stepTo('ok')
      setTimeout(() => {
        this._stepTo('tap-far-side')
      }, 1000)
    }, 2000)
  }

  wrapUp() {
    this._stepTo('thats-it')
    setTimeout(() => {
      this._stepTo('have-fun')
      setTimeout(() => {
        this._stepTo('oh')
        setTimeout(() => {
          this._stepTo('greeting')
        }, 1000)
      }, 1000)
    }, 2000)
  }

  _stepTo(id) {
    this._currentStepId = id
    this._displayMessage(id)
  }

  _displayMessage(id) {
    this._messageEls.forEach(el => el.className = '')
    this._getMessageEl(id).className = 'on'
  }

  _startAudioContext() {
    const unmuteEl = this._getMessageEl('play-sound')
    const greetingEl = this._getMessageEl('greeting')

    unmuteEl.classList.add('on')
    StartAudioContext(audio.getContext(), unmuteEl, () => {
      this.greet()
      unmuteEl.remove()
    })
  }

  _getMessageEl(id) {
    return document.querySelector(`#messages #${id}`)
  }
}

export default new Narrative
