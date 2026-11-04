// mix.io — which color comes next. Every player gets their own seeded shuffle of all
// colors (same generator as the web game), walked one by one. Levels 2–10 skip hard
// colors (the gentle opening ramp). Level 1 is always the fixed first color.
using System.Collections.Generic;
using UnityEngine;

namespace MixIO
{
    public static class LevelPicker
    {
        static int[] perm; static uint permSeed;

        static float Rnd(ref uint a)
        {
            a = unchecked(a + 0x6D2B79F5u);
            uint t = a; t = unchecked((t ^ (t >> 15)) * (t | 1u)); t ^= unchecked(t + ((t ^ (t >> 7)) * (t | 61u)));
            return (t ^ (t >> 14)) / 4294967296f;
        }

        static int[] Perm(uint seed, int n)
        {
            if (perm != null && permSeed == seed) return perm;
            var P = new int[n]; for (int i = 0; i < n; i++) P[i] = i;
            uint a = seed;
            for (int i = n - 1; i > 0; i--) { int j = (int)(Rnd(ref a) * (i + 1)); (P[i], P[j]) = (P[j], P[i]); }
            perm = P; permSeed = seed; return P;
        }

        public static int Next(int level)
        {
            var S = SaveSystem.Data; int N = GameData.Colors.Count;
            if (S.seed == 0) { S.seed = (uint)Random.Range(1, int.MaxValue); S.op = 0; }
            var played = new HashSet<int>(S.played);
            var P = Perm(S.seed, N);
            if (level <= 10)
            {
                for (int k = S.op; k < N; k++)
                {
                    int i = P[k];
                    if (played.Contains(i) || GameData.Tier(GameData.Colors[i]) >= 3) continue;
                    S.played.Add(i); if (k == S.op) S.op = k + 1; return i;
                }
            }
            for (int lap = 0; lap < 2; lap++)
            {
                P = Perm(S.seed, N);
                while (S.op < N) { int i = P[S.op++]; if (!played.Contains(i)) { S.played.Add(i); return i; } }
                S.played.Clear(); played.Clear(); S.seed = unchecked(S.seed * 1103515245u + 12345u); if (S.seed == 0) S.seed = 7; S.op = 0;
            }
            return Random.Range(0, N);
        }
    }
}
