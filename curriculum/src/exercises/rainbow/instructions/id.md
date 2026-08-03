---
title: "Pelangi"
description: "Lukis pelangi dari 100 batang vertikal yang berwarna-warni."
en_md5: 18cf1d57b1f3683a4484b507528f9acb
---

Tugasmu adalah membuat pola pelangi yang indah dari 100 batang vertikal. Hasilnya akan terlihat seperti ini:

<img src="/static/images/exercise-assets/rainbow/example.webp" alt="Pelangi" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

Pelangi ini terdiri dari `100` batang, masing-masing membentang dari atas ke bawah dengan lebar `1`. Batang pertama harus memiliki `x` (posisi horizontal) sebesar `0`, dan batang terakhir memiliki `x` sebesar `99`.

Untuk mengatur warnanya, gunakan fungsi `hsl(...)` (singkatan dari _hue_, _saturation_, _lightness_). Fungsi ini mengembalikan (bahasa Inggris: _returns_) sebuah string warna yang kemudian bisa kamu gunakan sebagai input terakhir pada `rectangle(...)` (persegi panjang). Sebaiknya atur nilai saturasi dan kecerahan (bahasa Inggris: _lightness_) di sekitar `50`. Batang pertama harus memiliki **_hue_ (rona warna)** sebesar `0`. Nilai hue harus bertambah untuk setiap batang dan berakhir di sekitar 300.
