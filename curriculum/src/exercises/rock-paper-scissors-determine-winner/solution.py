player_1_choice = get_player_1_choice()
player_2_choice = get_player_2_choice()

result = "player_2"

if player_1_choice == player_2_choice:
    result = "tie"
elif player_1_choice == "rock" and player_2_choice == "scissors":
    result = "player_1"
elif player_1_choice == "scissors" and player_2_choice == "paper":
    result = "player_1"
elif player_1_choice == "paper" and player_2_choice == "rock":
    result = "player_1"

announce_result(result)
