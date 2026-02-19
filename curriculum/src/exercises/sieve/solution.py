def sieve(target):
    if target < 2:
        return []

    is_prime = [False, False]
    for i in range(2, target + 1):
        is_prime.append(True)

    i = 2
    while i * i <= target:
        if is_prime[i]:
            j = i * i
            while j <= target:
                is_prime[j] = False
                j = j + i
        i = i + 1

    primes = []
    for i in range(2, target + 1):
        if is_prime[i]:
            primes.append(i)

    return primes
