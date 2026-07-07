let snowmanCenterX = 50
let headCenterY = 20
let headRadius = 10
let bodyCenterY = 40
let bodyRadius = 15
let baseCenterY = 70
let baseRadius = 20

// Base (bottom, biggest)
circle(snowmanCenterX, baseCenterY, baseRadius, "white")

// Body (middle)
circle(snowmanCenterX, bodyCenterY, bodyRadius, "white")

// Head (top, smallest)
circle(snowmanCenterX, headCenterY, headRadius, "white")
