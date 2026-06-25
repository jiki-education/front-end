let yukiChoice = getYukiChoice()
let andoChoice = getAndoChoice()

let result = "Ando"

if (yukiChoice === andoChoice) {
  result = "tie"
} else if (yukiChoice === "rock" && andoChoice === "scissors") {
  result = "Yuki"
} else if (yukiChoice === "scissors" && andoChoice === "paper") {
  result = "Yuki"
} else if (yukiChoice === "paper" && andoChoice === "rock") {
  result = "Yuki"
}

announceResult(result)
