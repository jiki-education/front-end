function isSock(item) {
  return item.endsWith(" sock") && (item.startsWith("left ") || item.startsWith("right "))
}

function withoutSide(sock) {
  return sock.replace("left ", "").replace("right ", "")
}

function partnerOf(sock) {
  if (sock.startsWith("left ")) {
    return "right " + withoutSide(sock)
  }
  return "left " + withoutSide(sock)
}

function matchingSocks(clean, dirty) {
  const socks = clean.concat(dirty)
  const pairs = []

  for (const sock of socks) {
    if (!isSock(sock)) { continue }
    if (!socks.includes(partnerOf(sock))) { continue }

    const name = withoutSide(sock) + "s"
    if (!pairs.includes(name)) { pairs.push(name) }
  }

  return pairs
}
