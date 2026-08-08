---
title: "Regnbåge"
description: "Måla en regnbåge av 100 färgglada vertikala staplar."
en_md5: 18cf1d57b1f3683a4484b507528f9acb
---

Din uppgift är att skapa ett vackert regnbågsmönster som består av 100 vertikala staplar. Det ska se ut så här:

<img src="/static/images/exercise-assets/rainbow/example.webp" alt="Regnbåge" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

Regnbågen består av `100` staplar som var och en går från toppen till botten och har bredden `1`. Den första stapeln ska ha ett `x` (x-koordinaten) på `0`, och den sista stapeln ska ha ett `x` på `99`.

För att ställa in färgen använder du funktionen `hsl(...)` (färgton, mättnad, ljushet). Den returnerar (_return_ på engelska) en färgsträng som du sedan kan använda som sista indata till `rectangle(...)` (rektangel). Att sätta värdena för mättnad (_saturation_ på engelska) och ljushet (_lightness_ på engelska) till ungefär `50` är förmodligen bäst. Den första stapeln ska ha en **färgton (_hue_ på engelska)** på `0`. Färgtonen ska öka för varje stapel och sluta någonstans i närheten av 300.
