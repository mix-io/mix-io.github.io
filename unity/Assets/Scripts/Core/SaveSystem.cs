// mix.io — save file. Mirrors the web game's save shape so a player's progress can be
// carried across (same field names: level, eye, chroma, palette, played, seed, op, idn).
using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

namespace MixIO
{
    [Serializable] public class PaletteEntry { public string n; public string h; public float p; public long d; }
    [Serializable] public class Identity { public string name; public int m; public int d; public string fav; }

    [Serializable]
    public class SaveData
    {
        public int level = 1;
        public float eye = 0;
        public int chroma = 0;
        public int cStreak = 0;
        public List<PaletteEntry> palette = new List<PaletteEntry>();
        public List<int> played = new List<int>();
        public uint seed = 0;
        public int op = 0;
        public Identity idn = null;
        public bool haptics = true;
        public bool sound = true;
        public int perfects = 0;
        public int totDrops = 0;
    }

    public static class SaveSystem
    {
        public static SaveData Data = new SaveData();
        static string Path => System.IO.Path.Combine(Application.persistentDataPath, "mixio-save.json");

        public static void Load()
        {
            try { if (File.Exists(Path)) Data = JsonUtility.FromJson<SaveData>(File.ReadAllText(Path)) ?? new SaveData(); }
            catch (Exception e) { Debug.LogWarning("[mix.io] save load failed: " + e.Message); Data = new SaveData(); }
        }
        public static void Persist()
        {
            try { File.WriteAllText(Path, JsonUtility.ToJson(Data)); }
            catch (Exception e) { Debug.LogWarning("[mix.io] save failed: " + e.Message); }
        }

        // Import a save exported from the web game (the JSON stored under localStorage "mixio.save").
        public static bool ImportWebJson(string json)
        {
            try
            {
                var o = MiniJson.Parse(json) as Dictionary<string, object>; if (o == null) return false;
                var d = new SaveData();
                if (o.TryGetValue("level", out var lv)) d.level = Convert.ToInt32(lv);
                if (o.TryGetValue("eye", out var ey) && ey != null) d.eye = Convert.ToSingle(ey);
                if (o.TryGetValue("chroma", out var ch) && ch != null) d.chroma = Convert.ToInt32(ch);
                if (o.TryGetValue("seed", out var sd) && sd != null) d.seed = Convert.ToUInt32(sd);
                if (o.TryGetValue("op", out var op) && op != null) d.op = Convert.ToInt32(op);
                if (o.TryGetValue("played", out var pl) && pl is List<object> plist) foreach (var x in plist) d.played.Add(Convert.ToInt32(x));
                if (o.TryGetValue("palette", out var pa) && pa is List<object> pal)
                    foreach (Dictionary<string, object> p in pal) d.palette.Add(new PaletteEntry { n = p["n"] as string, h = p.ContainsKey("h") ? p["h"] as string : "#000000", p = p.ContainsKey("p") ? Convert.ToSingle(p["p"]) : 0, d = p.ContainsKey("d") ? Convert.ToInt64(p["d"]) : 0 });
                if (o.TryGetValue("idn", out var id) && id is Dictionary<string, object> idn)
                    d.idn = new Identity { name = idn["name"] as string, m = Convert.ToInt32(idn["m"]), d = Convert.ToInt32(idn["d"]), fav = idn["fav"] as string };
                Data = d; Persist(); return true;
            }
            catch (Exception e) { Debug.LogWarning("[mix.io] import failed: " + e.Message); return false; }
        }
    }
}
