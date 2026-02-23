let outfit = getOutfit()

if (outfit === "ballgown" || outfit === "tuxedo") {
  offerChampagne()
  letIn()
} else if (outfit === "suit" || outfit === "dress") {
  letIn()
} else {
  turnAway()
}
