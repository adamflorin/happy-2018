import dat from 'dat-gui'

const displayControls = true

class Settings {
  constructor() {
    this.backgroundColor = [75, 12, 150]
    this.shadowColor = [25, 0, 25]
    this.lightAColor = [190, 190, 0]
    this.lightBColor = [0, 255, 100]
  }
}

const settings = new Settings()

if (displayControls) {
  const gui = new dat.GUI()
  gui.addColor(settings, 'backgroundColor')
  gui.addColor(settings, 'shadowColor')
  gui.addColor(settings, 'lightAColor')
  gui.addColor(settings, 'lightBColor')
}

export default settings
