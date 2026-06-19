let age = getAge()

if (age < 13) {
  giveChildWristband()
} else if (age < 18) {
  giveTeenWristband()
} else if (age < 65) {
  giveAdultWristband()
} else {
  giveSeniorWristband()
}
