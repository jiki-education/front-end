yuki_choice = get_yuki_choice()
ando_choice = get_ando_choice()

result = "Ando"

if yuki_choice == ando_choice:
    result = "tie"
elif yuki_choice == "rock" and ando_choice == "scissors":
    result = "Yuki"
elif yuki_choice == "scissors" and ando_choice == "paper":
    result = "Yuki"
elif yuki_choice == "paper" and ando_choice == "rock":
    result = "Yuki"

announce_result(result)
