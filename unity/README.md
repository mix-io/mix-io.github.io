# mix.io · Unity

A ground-up Unity port of mix.io. Everything from the web game carries over as data
(`Assets/Resources/Data`: 2,000 colors, 14 dyes, atlas pins, places, country outlines,
the 51-card set) and the color math is a line-for-line port, so a mix scores the same.

## Open it
1. Install Unity Hub and **Unity 6** (Personal, free). Mobile 2D template is fine.
2. Hub → Add → this folder → Open. Let it pick/upgrade the editor version.
3. Press **Play**. The app builds itself from code (`Assets/Scripts/UI/Bootstrap.cs`);
   no scene setup needed. For a phone preview use Game view at 390×844.
4. iPhone: File → Build Profiles → iOS → Build, open the Xcode project, run on device.

## What's in phase 1
- Home: wordmark, eye orb, colors found, play.
- Play: target, glass with the liquid shader, tap to drop, drag to stir, dock-style dye strip, live %.
- Result: %, verdict, recipe, chroma breakdown (match, difficulty, accuracy, clean mix, streak).
- Save: JSON in persistentDataPath, same field names as the web save. `SaveSystem.ImportWebJson`
  imports a web save.

## Phases next
2. DNA orb (raymarched jelly shader), welcome + DNA setup, haptics map.
3. Atlas globe (low-poly Earth, pins, country shading, day/night) from `atlas.json` + `outlines.json`.
4. Collection: packs, cards (holo / kintsugi / secret), passport.
5. Supabase accounts + world leaderboard.

## Rules
`UI-RULES.md` from the web repo applies: symmetry, liquid feel, calm motion, 60fps.
