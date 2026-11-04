// mix.io — the play loop: target, drops, water, stir, lock in, score, eye, chroma.
// No scene dependencies: Bootstrap.cs builds the UI and drives this.
using System;
using System.Collections.Generic;
using UnityEngine;

namespace MixIO
{
    public class Game
    {
        public TargetColor target;
        public Vector3 meanA = Vector3.zero;   // absorbance in the glass
        public int drops = 0, waterCount = 0;
        public float unmixed = 0;              // 0 = fully blended
        public float stirEnergy = 0;
        public List<int> log = new List<int>();
        public bool locked = false;
        public float lastPct = 0; public bool lastFound = false; public int lastChroma = 0; public string lastBreakdown = "";

        public Color GlassColor => ColorEngine.DisplayColor(meanA);
        public float LivePercent => drops == 0 ? 0 : ColorEngine.MatchPercent(target.rgb, GlassColor);

        public void NewLevel()
        {
            var S = SaveSystem.Data;
            int idx = S.level <= 1 ? FirstColor() : LevelPicker.Next(S.level);
            target = GameData.Target(idx);
            Reset();
            SaveSystem.Persist();
        }
        static int FirstColor() { for (int i = 0; i < GameData.Colors.Count; i++) if (GameData.Colors[i].n == "hot pink") return i; return 0; }

        public void Reset() { meanA = Vector3.zero; drops = 0; waterCount = 0; unmixed = 0; stirEnergy = 0; log.Clear(); locked = false; }

        public void AddDrop(int dye)
        {
            if (locked) return;
            log.Add(dye); SaveSystem.Data.totDrops++;
            if (dye == ColorEngine.WATER) { meanA = ColorEngine.AddWater(meanA); waterCount++; return; }
            var amt = ColorEngine.Dyes[dye].a * ColorEngine.DROP * Mathf.Pow(ColorEngine.WF, waterCount);
            float oldTot = meanA.x + meanA.y + meanA.z;
            meanA += amt;
            float newTot = meanA.x + meanA.y + meanA.z;
            unmixed = newTot > 0 ? (unmixed * oldTot + (amt.x + amt.y + amt.z)) / newTot : 0;
            drops++;
        }

        public void Stir(float speed, float dt)
        {
            stirEnergy = Mathf.Clamp01(stirEnergy + speed * dt * 0.8f);
            unmixed = Mathf.Max(0, unmixed - dt * (0.6f + speed * 1.4f));
        }
        public void Tick(float dt) { stirEnergy = Mathf.Max(0, stirEnergy - dt * 1.2f); }

        public void Empty() { Reset(); }

        // Lock it in: score, eye, palette, chroma (same rules as the web game).
        public void LockIn()
        {
            if (locked || drops == 0) return; locked = true;
            var S = SaveSystem.Data;
            float pct = ColorEngine.MatchPercent(target.rgb, GlassColor);
            lastPct = pct; lastFound = pct >= 50;
            // eye: 50%+ always gains, under 50 loses; scaled by quality and difficulty
            float q = (pct - 50f) / 50f, diff = 0.6f + 0.2f * target.tier;
            float dEye = pct >= 50 ? (0.12f + 0.55f * q * q) * diff : -(0.05f + 0.25f * (-q)) * 0.6f;
            if (pct >= 97) S.perfects++;
            S.eye = Mathf.Clamp(S.eye + dEye, 0, 100);
            // palette: keep best % per color
            var e = S.palette.Find(p => p.n == target.name);
            if (e == null) S.palette.Add(new PaletteEntry { n = target.name, h = ColorEngine.RgbToHex(target.rgb), p = pct, d = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() });
            else if (pct > e.p) e.p = pct;
            // chroma
            int cg = 0; var parts = new List<string>();
            if (pct >= 50)
            {
                int tb = target.tier, ab = pct >= 97 ? 4 : pct >= 85 ? 2 : pct >= 70 ? 1 : 0;
                cg = 1 + tb + ab; parts.Add("match +1"); parts.Add("difficulty +" + tb); if (ab > 0) parts.Add("accuracy +" + ab);
                if (pct >= 90 && drops <= target.drops + 2) { cg += 1; parts.Add("clean mix +1"); }
                S.cStreak++; int sb = S.cStreak >= 10 ? 5 : S.cStreak >= 5 ? 3 : S.cStreak >= 3 ? 2 : S.cStreak >= 2 ? 1 : 0;
                if (sb > 0) { cg += sb; parts.Add("streak ×" + S.cStreak + " +" + sb); }
            }
            else S.cStreak = 0;
            S.chroma += cg; lastChroma = cg; lastBreakdown = string.Join(" · ", parts);
            S.level++;
            SaveSystem.Persist();
        }

        public static string Verdict(float pct) => pct >= 100 ? "perfect" : pct >= 95 ? "spot on" : pct >= 85 ? "great job" : pct >= 70 ? "well done" : pct >= 50 ? "decent" : "not quite";
        public string Recipe()
        {
            var s = new List<string>(); foreach (var (i, n) in target.recipe) s.Add(n + " " + ColorEngine.Dyes[i].name.ToLower());
            if (target.dil > 0) s.Add("+ " + target.dil * 3 + " water");
            return string.Join(" · ", s);
        }
    }
}
