// mix.io — core color engine. A line-for-line port of the web game's math, so a mix
// scores identically on both. Absorbance model: each drop adds DROP * dye absorbance
// to the glass; water drops dilute everything by WF.
using System;
using UnityEngine;

namespace MixIO
{
    public static class ColorEngine
    {
        public const float DROP = 0.32f;
        public static readonly float WF = Mathf.Pow(0.5f, 1f / 3f);
        public const float LIGHT = 0.9f;
        public const int WATER = 13;

        public struct Dye { public string name; public Color rgb; public Vector3 a; public bool water; }
        public static Dye[] Dyes;

        public static void Init(string[] names, string[] hexes)
        {
            Dyes = new Dye[names.Length];
            for (int i = 0; i < names.Length; i++)
            {
                var c = HexToRgb(hexes[i]);
                bool w = names[i] == "Water";
                Dyes[i] = new Dye
                {
                    name = names[i], rgb = c, water = w,
                    a = w ? Vector3.zero : new Vector3(-Mathf.Log(Mathf.Max(c.r, .03f)), -Mathf.Log(Mathf.Max(c.g, .03f)), -Mathf.Log(Mathf.Max(c.b, .03f)))
                };
            }
        }

        public static Color HexToRgb(string h)
        {
            h = h.TrimStart('#');
            return new Color(Convert.ToInt32(h.Substring(0, 2), 16) / 255f, Convert.ToInt32(h.Substring(2, 2), 16) / 255f, Convert.ToInt32(h.Substring(4, 2), 16) / 255f);
        }
        public static string RgbToHex(Color c) => "#" + ((int)Mathf.Round(Mathf.Clamp01(c.r) * 255)).ToString("X2") + ((int)Mathf.Round(Mathf.Clamp01(c.g) * 255)).ToString("X2") + ((int)Mathf.Round(Mathf.Clamp01(c.b) * 255)).ToString("X2");

        // What the eye sees for a given absorbance (soft knee so heavy mixes don't go black).
        public static Color DisplayColor(Vector3 A)
        {
            float ax = Mathf.Max(0, A.x), ay = Mathf.Max(0, A.y), az = Mathf.Max(0, A.z);
            float m = Mathf.Max(ax, Mathf.Max(ay, az)), K = 1.7f, S = 0.75f;
            float gm = m < K ? m : K + S * Mathf.Log(1 + (m - K) / S);
            float k = m > 1e-4f ? gm / m : 1f;
            return new Color(LIGHT * Mathf.Exp(-ax * k), LIGHT * Mathf.Exp(-ay * k), LIGHT * Mathf.Exp(-az * k));
        }

        // recipe: (dyeIndex, drops)[]; dil: number of 3-water-drop dilutions
        public static Vector3 RecipeA((int i, int n)[] recipe, int dil)
        {
            var A = Vector3.zero;
            foreach (var (i, n) in recipe) A += n * DROP * Dyes[i].a;
            return A * Mathf.Pow(0.5f, dil);
        }

        // Live glass state helpers (mirror addDrop / water logic in the web game)
        public static Vector3 AddDye(Vector3 meanA, int dye, int waterCount) => meanA + Dyes[dye].a * DROP * Mathf.Pow(WF, waterCount);
        public static Vector3 AddWater(Vector3 meanA) => meanA * WF;

        public static Vector3 ToLab(Color c)
        {
            float lin(float v) { v = Mathf.Clamp01(v); return v <= 0.04045f ? v / 12.92f : Mathf.Pow((v + 0.055f) / 1.055f, 2.4f); }
            float r = lin(c.r), g = lin(c.g), b = lin(c.b);
            float X = (r * 0.4124f + g * 0.3576f + b * 0.1805f) / 0.95047f;
            float Y = (r * 0.2126f + g * 0.7152f + b * 0.0722f);
            float Z = (r * 0.0193f + g * 0.1192f + b * 0.9505f) / 1.08883f;
            float f(float t) => t > 0.008856f ? Mathf.Pow(t, 1f / 3f) : 7.787f * t + 16f / 116f;
            float fx = f(X), fy = f(Y), fz = f(Z);
            return new Vector3(116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz));
        }

        // CIEDE2000
        public static float DE00(Vector3 l1, Vector3 l2)
        {
            float L1 = l1.x, a1 = l1.y, b1 = l1.z, L2 = l2.x, a2 = l2.y, b2 = l2.z;
            float rad = Mathf.PI / 180f, deg = 180f / Mathf.PI, p7 = Mathf.Pow(25, 7);
            float C1 = Hyp(a1, b1), C2 = Hyp(a2, b2), Cb = (C1 + C2) / 2;
            float G = 0.5f * (1 - Mathf.Sqrt(Mathf.Pow(Cb, 7) / (Mathf.Pow(Cb, 7) + p7)));
            float a1p = (1 + G) * a1, a2p = (1 + G) * a2;
            float C1p = Hyp(a1p, b1), C2p = Hyp(a2p, b2);
            float hue(float b, float a) { if (b == 0 && a == 0) return 0; float x = Mathf.Atan2(b, a) * deg; return x < 0 ? x + 360 : x; }
            float h1p = hue(b1, a1p), h2p = hue(b2, a2p);
            float dLp = L2 - L1, dCp = C2p - C1p, dhp = 0;
            if (C1p * C2p != 0) { dhp = h2p - h1p; if (dhp > 180) dhp -= 360; else if (dhp < -180) dhp += 360; }
            float dHp = 2 * Mathf.Sqrt(C1p * C2p) * Mathf.Sin(dhp * rad / 2);
            float Lbp = (L1 + L2) / 2, Cbp = (C1p + C2p) / 2, hbp = h1p + h2p;
            if (C1p * C2p != 0)
            {
                if (Mathf.Abs(h1p - h2p) > 180) hbp = (h1p + h2p < 360) ? (h1p + h2p + 360) / 2 : (h1p + h2p - 360) / 2;
                else hbp = (h1p + h2p) / 2;
            }
            float T = 1 - 0.17f * Mathf.Cos((hbp - 30) * rad) + 0.24f * Mathf.Cos(2 * hbp * rad) + 0.32f * Mathf.Cos((3 * hbp + 6) * rad) - 0.2f * Mathf.Cos((4 * hbp - 63) * rad);
            float dTheta = 30 * Mathf.Exp(-Mathf.Pow((hbp - 275) / 25, 2));
            float Rc = 2 * Mathf.Sqrt(Mathf.Pow(Cbp, 7) / (Mathf.Pow(Cbp, 7) + p7));
            float Sl = 1 + 0.015f * Mathf.Pow(Lbp - 50, 2) / Mathf.Sqrt(20 + Mathf.Pow(Lbp - 50, 2));
            float Sc = 1 + 0.045f * Cbp, Sh = 1 + 0.015f * Cbp * T;
            float Rt = -Mathf.Sin(2 * dTheta * rad) * Rc;
            return Mathf.Sqrt(Mathf.Pow(dLp / Sl, 2) + Mathf.Pow(dCp / Sc, 2) + Mathf.Pow(dHp / Sh, 2) + Rt * (dCp / Sc) * (dHp / Sh));
        }
        static float Hyp(float a, float b) => Mathf.Sqrt(a * a + b * b);

        // Match % exactly as the web game scores it (before hint penalties)
        public static float MatchPercent(Color target, Color yours)
        {
            float dE = DE00(ToLab(target), ToLab(yours));
            float raw = 100f * Mathf.Exp(-Mathf.Pow(dE / 18f, 1.3f));
            return raw >= 99.95f ? 100f : Mathf.Min(99.9f, Mathf.Round(raw * 10f) / 10f);
        }
    }
}
