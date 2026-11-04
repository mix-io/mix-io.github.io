// mix.io — loads the exported game data (colors, dyes, atlas, cards) from Resources/Data.
// The JSON files are exported straight from the web game, so content stays in sync.
using System;
using System.Collections.Generic;
using UnityEngine;

namespace MixIO
{
    [Serializable] public class ColorDef { public string n; public int[][] r; public int d; public int t; }
    [Serializable] public class PinDef { public string n; public float lat; public float lng; public string place; public int origin; public string fact; public string cc; }
    [Serializable] public class PlaceDef { public string place; public float lat; public float lng; public string cc; public string fact; }
    [Serializable] public class CardDef { public int no; public string r; public string n; public string hex; public string place; public string fact; public bool full; }

    public class TargetColor
    {
        public string name; public (int i, int n)[] recipe; public int dil; public int tier; public int idx;
        public Vector3 A; public Color rgb; public int drops;
    }

    public static class GameData
    {
        public static List<ColorDef> Colors = new List<ColorDef>();
        public static List<PinDef> Pins = new List<PinDef>();
        public static List<PlaceDef> MorePlaces = new List<PlaceDef>();
        public static Dictionary<string, string> Countries = new Dictionary<string, string>();
        public static List<CardDef> Cards = new List<CardDef>();
        static bool loaded;

        public static void Load()
        {
            if (loaded) return; loaded = true;
            var colors = MiniJson.Parse(Resources.Load<TextAsset>("Data/colors").text) as Dictionary<string, object>;
            var dyes = (List<object>)colors["dyes"];
            var names = new string[dyes.Count]; var hexes = new string[dyes.Count];
            for (int i = 0; i < dyes.Count; i++) { var d = (List<object>)dyes[i]; names[i] = (string)d[0]; hexes[i] = (string)d[1]; }
            ColorEngine.Init(names, hexes);
            foreach (Dictionary<string, object> c in (List<object>)colors["colors"])
            {
                var rl = (List<object>)c["r"]; var rec = new int[rl.Count][];
                for (int k = 0; k < rl.Count; k++) { var p = (List<object>)rl[k]; rec[k] = new[] { Convert.ToInt32(p[0]), Convert.ToInt32(p[1]) }; }
                Colors.Add(new ColorDef { n = (string)c["n"], r = rec, d = Convert.ToInt32(c["d"]), t = Convert.ToInt32(c["t"]) });
            }
            var atlas = MiniJson.Parse(Resources.Load<TextAsset>("Data/atlas").text) as Dictionary<string, object>;
            foreach (Dictionary<string, object> p in (List<object>)atlas["pins"])
                Pins.Add(new PinDef { n = (string)p["n"], lat = Convert.ToSingle(p["lat"]), lng = Convert.ToSingle(p["lng"]), place = (string)p["place"], origin = Convert.ToInt32(p["origin"]), fact = p["fact"] as string, cc = p["cc"] as string });
            foreach (Dictionary<string, object> p in (List<object>)atlas["morePlaces"])
                MorePlaces.Add(new PlaceDef { place = (string)p["place"], lat = Convert.ToSingle(p["lat"]), lng = Convert.ToSingle(p["lng"]), cc = p["cc"] as string, fact = p["fact"] as string });
            foreach (var kv in (Dictionary<string, object>)atlas["countries"]) Countries[kv.Key] = (string)kv.Value;
            var cards = MiniJson.Parse(Resources.Load<TextAsset>("Data/cards").text) as Dictionary<string, object>;
            foreach (Dictionary<string, object> c in (List<object>)cards["cards"])
                Cards.Add(new CardDef { no = Convert.ToInt32(c["no"]), r = (string)c["r"], n = (string)c["n"], hex = (string)c["hex"], place = c.ContainsKey("place") ? c["place"] as string : "", fact = c.ContainsKey("fact") ? c["fact"] as string : "", full = c.ContainsKey("full") && Convert.ToBoolean(c["full"]) });
        }

        public static TargetColor Target(int idx)
        {
            var c = Colors[idx];
            var rec = new (int, int)[c.r.Length]; int drops = 0;
            for (int k = 0; k < c.r.Length; k++) { rec[k] = (c.r[k][0], c.r[k][1]); drops += c.r[k][1]; }
            var A = ColorEngine.RecipeA(rec, c.d);
            return new TargetColor { name = c.n, recipe = rec, dil = c.d, tier = Tier(c), idx = idx, A = A, rgb = ColorEngine.DisplayColor(A), drops = drops };
        }

        // Difficulty tier from the solved recipe (same quantiles as the web game)
        static float[] tierCuts;
        public static int Tier(ColorDef c)
        {
            if (tierCuts == null)
            {
                var sc = new List<float>(); foreach (var x in Colors) sc.Add(Score(x)); sc.Sort();
                tierCuts = new[] { sc[(int)(sc.Count * .22f)], sc[(int)(sc.Count * .52f)], sc[(int)(sc.Count * .82f)] };
            }
            float v = Score(c);
            return v < tierCuts[0] ? 1 : v < tierCuts[1] ? 2 : v < tierCuts[2] ? 3 : 4;
        }
        static float Score(ColorDef c) { int n = 0; foreach (var r in c.r) n += r[1]; return c.r.Length * 3 + n * .6f + c.d * 2.5f + c.t * 2 + (IdHash(c.n) % 100) / 400f; }
        static int IdHash(string s) { int h = 7; foreach (var ch in s) h = unchecked(31 * h + ch); return Mathf.Abs(h); }
    }
}
