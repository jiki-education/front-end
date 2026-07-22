// Colors
let skyColor = "skyblue"
let grassColor = "green"
let houseColor = "brown"
let roofColor = "brick"
let windowColor = "white"
let doorColor = "dark brown"
let knobColor = "yellow"

// Canvas
let canvasWidth = 100

// House frame
let houseWidth = 60
let houseHeight = 40

// Center and position the frame
let centerX = canvasWidth / 2
let houseLeft = centerX - houseWidth / 2

// Grass
let grassHeight = 15
let grassTop = 100 - grassHeight

// The house sits 5 below the top of the grass, and grows upward from there
let houseBottom = grassTop + 5
let houseTop = houseBottom - houseHeight

// Roof
let roofOverhang = houseWidth / 10
let roofHeight = houseHeight / 2
let roofLeft = houseLeft - roofOverhang
let roofRight = houseLeft + houseWidth + roofOverhang
let roofPeakX = centerX
let roofPeakY = houseTop - roofHeight
let roofBaseY = houseTop

// Windows
let windowWidth = houseWidth / 5
let windowHeight = houseHeight / 3
let windowInset = houseWidth / 7
let windowTop = houseTop + houseHeight / 8
let window1Left = houseLeft + windowInset
let window2Left = houseLeft + houseWidth - windowInset - windowWidth

// Door
let doorWidth = houseWidth / 5
let doorHeight = houseHeight / 2
let doorLeft = centerX - doorWidth / 2
let doorTop = houseBottom - doorHeight

// Door knob
let knobRadius = doorWidth / 10
let knobOffset = doorWidth / 10
let knobX = doorLeft + doorWidth - knobRadius - knobOffset
let knobY = doorTop + doorHeight / 2

// The sky
rectangle(0, 0, 100, 100, skyColor)

// The grass
rectangle(0, grassTop, 100, grassHeight, grassColor)

// The frame of the house
rectangle(houseLeft, houseTop, houseWidth, houseHeight, houseColor)

// The roof
triangle(roofLeft, roofBaseY, roofPeakX, roofPeakY, roofRight, roofBaseY, roofColor)

// The left window
rectangle(window1Left, windowTop, windowWidth, windowHeight, windowColor)

// The right window
rectangle(window2Left, windowTop, windowWidth, windowHeight, windowColor)

// The door
rectangle(doorLeft, doorTop, doorWidth, doorHeight, doorColor)

// The door knob
circle(knobX, knobY, knobRadius, knobColor)
