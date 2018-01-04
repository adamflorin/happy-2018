import dat from 'dat-gui'

const displayControls = true

class Settings {
  constructor() {
    // Physics
    this.gravityInertia = 0.4
    this.gravityForceNumerator = 0.01
    this.maxGravityForce = 0.01
    this.initialWindForce = 0.05
    this.windForceDecay = 0.96

    // Object
    this.objectScale = 0.5

    // Color
    this.backgroundColor = '#000000'
    this.shadowColor = '#000000'
    this.lightAColor = '#ffffff'
    this.lightBColor = '#000000'
  }
}

const settings = new Settings()

if (displayControls) {
  const gui = new dat.GUI()
  gui.close()

  const physicsFolder = gui.addFolder('Physics')
  physicsFolder.add(settings, 'gravityInertia', 0.0, 1.0)
  physicsFolder.add(settings, 'gravityForceNumerator', 0.0, 1.0)
  physicsFolder.add(settings, 'maxGravityForce', 0.0, 0.1)
  physicsFolder.add(settings, 'initialWindForce', 0.0, 0.1)
  physicsFolder.add(settings, 'windForceDecay', 0.0, 1.0)
  physicsFolder.open()

  const objectFolder = gui.addFolder('Object')
  objectFolder.add(settings, 'objectScale', 0.0, 5.0)

  const colorFolder = gui.addFolder('Color')
  colorFolder.addColor(settings, 'backgroundColor')
  colorFolder.addColor(settings, 'shadowColor')
  colorFolder.addColor(settings, 'lightAColor')
  colorFolder.addColor(settings, 'lightBColor')
}

export default settings
