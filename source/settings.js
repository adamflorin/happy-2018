import dat from 'dat-gui'

class Settings {
  constructor() {
    // World
    this.rotationPeriod = 90.0

    // Physics
    this.gravityInertia = 0.4
    this.gravityForceNumerator = 0.01
    this.maxGravityForce = 0.012
    this.strikeForce = 0.055
    this.windForce = 0.055
    this.windForceDecay = 0.96
    this.maxDistance = 1.5

    // Object
    this.objectScale = 0.5

    // Color
    this.backgroundColor = '#000000'
    this.baseColorA = '#000000'
    this.baseColorB = '#ffffff'
    this.baseColorC = '#ebb024'
    this.baseColorD = '#1133ff'
    this.baseColorE = '#cc1122'
    this.lightAColor = '#ffffff'
    this.lightBColor = '#000000'
  }
}

const settings = new Settings()

function displayControls() {
  const gui = new dat.GUI()
  gui.close()

  const worldFolder = gui.addFolder('World')
  worldFolder.add(settings, 'rotationPeriod', 0.01, 300.0)

  const physicsFolder = gui.addFolder('Physics')
  physicsFolder.add(settings, 'gravityInertia', 0.0, 1.0)
  physicsFolder.add(settings, 'gravityForceNumerator', 0.0, 1.0)
  physicsFolder.add(settings, 'maxGravityForce', 0.0, 0.1)
  physicsFolder.add(settings, 'strikeForce', 0.0, 0.1)
  physicsFolder.add(settings, 'windForce', 0.0, 0.5)
  physicsFolder.add(settings, 'windForceDecay', 0.0, 1.0)
  physicsFolder.add(settings, 'maxDistance', 0.0, 5.0)

  const objectFolder = gui.addFolder('Object')
  objectFolder.add(settings, 'objectScale', 0.0, 5.0)

  const colorFolder = gui.addFolder('Color')
  colorFolder.addColor(settings, 'backgroundColor')
  colorFolder.addColor(settings, 'baseColorA')
  colorFolder.addColor(settings, 'baseColorB')
  colorFolder.addColor(settings, 'baseColorC')
  colorFolder.addColor(settings, 'baseColorD')
  colorFolder.addColor(settings, 'baseColorE')
  colorFolder.addColor(settings, 'lightAColor')
  colorFolder.addColor(settings, 'lightBColor')
}

module.exports = {
  settings,
  displayControls
}
