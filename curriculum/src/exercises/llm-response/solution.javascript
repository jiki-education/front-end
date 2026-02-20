function contains(haystack, needle) {
  for (const thread of haystack) {
    if (needle === thread) {
      return true;
    }
  }
  return false;
}

function extractNumber(string) {
  let numbers = "0123456789";
  let res = "";
  for (const letter of string) {
    if (!contains(numbers, letter)) {
      break;
    }
    res = res + letter;
  }
  return Number(res);
}

function selectAnswer(answers) {
  let bestAnswer = {};
  let bestCertainty = 0;
  let answerCertainty = 0;

  for (const answer of answers) {
    answerCertainty = Number(answer["certainty"]);
    if (answerCertainty > bestCertainty) {
      bestAnswer = answer;
      bestCertainty = answerCertainty;
    }
  }
  return bestAnswer;
}

function askLlm(question) {
  let data = fetch("https://myllm.com/api/v2/qanda", { "question": question });
  let answers = data["response"]["answers"];
  let timeMs = data["meta"]["time"];
  let timeS = "" + extractNumber(timeMs) / 1000;

  let answer = selectAnswer(answers);
  let certaintyPc = "" + Number(answer["certainty"]) * 100;

  let extra = certaintyPc + "% certainty in " + timeS + "s";
  return "The answer to '" + question + "' is '" + answer["text"] + "' (" + extra + ").";
}
