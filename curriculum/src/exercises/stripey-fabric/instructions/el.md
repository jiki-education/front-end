---
title: "Ριγέ Ύφασμα"
description: "Ύφανε ένα ριγέ μοτίβο επιλέγοντας σωστά το χρώμα κάθε ρίγας."
en_md5: ba93b39f1883d50139d243a16e3c204f
---

Σχεδιάζεις έναν αλγόριθμο για να δημιουργήσεις ένα ρολό από ριγέ ύφασμα, το οποίο θα πρέπει να μοιάζει κάπως έτσι:

<svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Είκοσι κάθετες ρίγες: μοβ στις δύο άκρες, με πράσινες, μπλε και κίτρινες ρίγες ενδιάμεσα." style="width: 200px; height: 200px; display: block; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;padding:4px;margin-top:-8px">
  <rect x="0" y="0" width="5" height="100" fill="#A020F0" />
  <rect x="5" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="10" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="15" y="0" width="5" height="100" fill="#008000" />
  <rect x="20" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="25" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="30" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="35" y="0" width="5" height="100" fill="#008000" />
  <rect x="40" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="45" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="50" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="55" y="0" width="5" height="100" fill="#008000" />
  <rect x="60" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="65" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="70" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="75" y="0" width="5" height="100" fill="#008000" />
  <rect x="80" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="85" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="90" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="95" y="0" width="5" height="100" fill="#A020F0" />
</svg>

Το μοτίβο είναι μια επαναλαμβανόμενη ακολουθία από `"yellow"`, `"blue"`, `"yellow"`, `"green"`. Η πρώτη και η τελευταία ρίγα είναι `"purple"`.

Ο καμβάς πάνω στον οποίο σχεδιάζεις έχει πλάτος `100` και ύψος `100`. Πρέπει να σχεδιάσεις `20` ρίγες, καθεμία με πλάτος `5`.

### Κανόνες της Άσκησης

Δεν μπορείς να λύσεις αυτή την άσκηση απλά γράφοντας 20 εντολές ορθογωνίου. Ο κώδικάς σου θα πρέπει να κλιμακώνεται για οποιοδήποτε μέγεθος υφάσματος. Στην πραγματικότητα, μπορείς να χρησιμοποιήσεις μόνο μία φορά τη συνάρτηση `rectangle(...)` (ορθογώνιο) στον κώδικά σου!

Αντ' αυτού, πρέπει να κάνεις έναν βρόχο και να χρησιμοποιήσεις τον τελεστή υπολοίπου (_remainder operator_ στα αγγλικά) που είδαμε στο τελευταίο μάθημα βίντεο. Σκέψου προσεκτικά τη σειρά των εντολών. Αυτό είναι το κλειδί για να πετύχεις σε αυτή την άσκηση.

Πάρε τον χρόνο σου και διασκέδασε!
