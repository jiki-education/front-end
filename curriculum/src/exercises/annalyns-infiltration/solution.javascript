// Fast attack: only if the knight is asleep
if (!knightIsAwake()) {
  fastAttack()
}

// Spy: only if at least one of them is awake
if (knightIsAwake() || archerIsAwake() || prisonerIsAwake()) {
  spy()
}

// Signal: prisoner awake AND archer asleep
if (prisonerIsAwake() && !archerIsAwake()) {
  signalPrisoner()
}

// Free: with the dog behaving (archer asleep), OR sneaky (prisoner awake, both kidnappers asleep)
if ((dogIsBehaving() && !archerIsAwake()) || (!dogIsBehaving() && prisonerIsAwake() && !knightIsAwake() && !archerIsAwake())) {
  freePrisoner()
}
