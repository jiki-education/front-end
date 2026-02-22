function sieve(target) {
  if (target < 2) {
    return [];
  }

  let isPrime = [];
  for (let i = 0; i <= target; i++) {
    isPrime.push(i >= 2);
  }

  for (let i = 2; i * i <= target; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= target; j = j + i) {
        isPrime[j] = false;
      }
    }
  }

  let primes = [];
  for (let i = 2; i <= target; i++) {
    if (isPrime[i]) {
      primes.push(i);
    }
  }

  return primes;
}
