let player1Choice = getPlayer1Choice()
let player2Choice = getPlayer2Choice()

let result = "player_2"

if (player1Choice === player2Choice) {
  result = "tie"
} else if (player1Choice === "rock" && player2Choice === "scissors") {
  result = "player_1"
} else if (player1Choice === "scissors" && player2Choice === "paper") {
  result = "player_1"
} else if (player1Choice === "paper" && player2Choice === "rock") {
  result = "player_1"
}

announceResult(result)
