let outfit = getOutfit()
let age = getAge()

if (age >= 18 && (outfit === "ballgown" || outfit === "tuxedo")) {
  offerChampagne()
}
if (outfit === "dress" || outfit === "suit" || outfit === "ballgown" || outfit === "tuxedo") {
  offerCanapes()
  letIn()
} else if (age < 18 && onGuestList()) {
  letIn()
} else {
  turnAway()
}
