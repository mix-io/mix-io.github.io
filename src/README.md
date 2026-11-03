# mix.io source

The game ships as one file (`index.html` on the site). These folders are the readable source; `build.py` stitches them back together byte-for-byte.

```
src/
  index.html            the page skeleton: lists every piece in order
  build.py              python3 src/build.py  ->  ../tint.html
  markup/               head tags + the app's HTML
  styles/               base, main and overlay CSS
  scripts/
    touch-guard.js      blocks pinch-zoom outside the globe
    boot.js             first-paint boot
    game/               01 core … 11 you tab (colors, account, welcome,
                        navigation, glass + water, ranks, countries,
                        gameplay, DNA orb, you tab)
    atlas/              globe data + the 3D aero Earth
    collection/         cards, packs, passport (shadow DOM module)
  data/                 big embedded data: art, flags, outlines,
                        heightmap, extra colors and places
```

A line that is exactly `@@ path @@` means "insert that file here".
Edit the files, run `./deploy.sh "message"` — it builds, then publishes.
