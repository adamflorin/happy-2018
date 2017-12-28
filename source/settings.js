import dat from 'dat-gui'

const displayControls = true

class Settings {
  constructor() {
    // Physics
    this.gravityInertia = 0.9
    this.gravityForceNumerator = 0.01
    this.maxGravityForce = 0.015
    this.initialWindForce = 0.025
    this.windForceDecay = 0.98

    // Color
    this.backgroundColor = '#f58888'
    this.shadowColor = '#f07070'
    this.lightAColor = '#75000a'
    this.lightBColor = '#75000a'
  }
}

const settings = new Settings()

if (displayControls) {
  const gui = new dat.GUI()

  const physicsFolder = gui.addFolder('Physics')
  physicsFolder.add(settings, 'gravityInertia', 0.0, 1.0)
  physicsFolder.add(settings, 'gravityForceNumerator', 0.0, 1.0)
  physicsFolder.add(settings, 'maxGravityForce', 0.0, 0.1)
  physicsFolder.add(settings, 'initialWindForce', 0.0, 0.1)
  physicsFolder.add(settings, 'windForceDecay', 0.0, 1.0)
  physicsFolder.open()

  const colorFolder = gui.addFolder('Color')
  colorFolder.addColor(settings, 'backgroundColor')
  colorFolder.addColor(settings, 'shadowColor')
  colorFolder.addColor(settings, 'lightAColor')
  colorFolder.addColor(settings, 'lightBColor')
}

export default settings
