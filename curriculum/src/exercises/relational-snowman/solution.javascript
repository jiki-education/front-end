// These are fixed
let snowmanX = 50
let size = 4

// Derive radii from size
let headRadius = size * 2
let bodyRadius = size * 3
let baseRadius = size * 4

// Derive the y positions so the circles touch, starting from the ground
let baseY = 100 - size - baseRadius
let bodyY = baseY - baseRadius - bodyRadius
let headY = bodyY - bodyRadius - headRadius

// Head (top, smallest)
circle(snowmanX, headY, headRadius, "white")

// Body (middle)
circle(snowmanX, bodyY, bodyRadius, "white")

// Base (bottom, biggest)
circle(snowmanX, baseY, baseRadius, "white")
