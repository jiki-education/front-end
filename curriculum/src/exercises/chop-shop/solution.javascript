function nameToTime(name) {
  const cuts = [
    ["Mohawk", 20],
    ["Slicked-Back Pixie", 15],
    ["Bob", 25],
    ["Shave and Polish", 15],
    ["Afro Trim", 45],
    ["Up-do", 30]
  ];
  for (const cut of cuts) {
    if (cut[0] === name) {
      return cut[1];
    }
  }
}

function canFitIn(queue, nextCut, time) {
  for (const cut of queue) {
    time = time - nameToTime(cut);
  }

  return time >= nameToTime(nextCut);
}
