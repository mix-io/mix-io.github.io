// mix.io — builds the whole app from code at startup (no scene setup needed).
// Open the project in Unity 6, press Play. Phase 1 = home + play + result.
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

namespace MixIO
{
    public class Bootstrap : MonoBehaviour
    {
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        static void Boot()
        {
            if (FindFirstObjectByType<Bootstrap>() != null) return;
            var go = new GameObject("mix.io"); DontDestroyOnLoad(go); go.AddComponent<Bootstrap>();
        }

        // ---- state
        Game game; Canvas canvas; RectTransform root;
        GameObject home, play, result; Text eyeText, foundText, lvlText, nameText, pctLive, resPct, resWord, resName, resRecipe, resChroma;
        Image targetSwatch, liquid, glassRim, orb; Material liquidMat;
        int sel = 0; readonly List<Image> beads = new List<Image>(); RectTransform strip;
        Vector2 lastStir; float stirSpeed; bool stirring;
        static readonly Color Paper = new Color(0, 0, 0, 1), Ink = Color.white, Muted = new Color(0.55f, 0.59f, 0.64f);
        Font font;

        void Awake()
        {
            Application.targetFrameRate = 60;
            GameData.Load(); SaveSystem.Load();
            game = new Game();
            font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            BuildCanvas(); BuildHome(); BuildPlay(); BuildResult();
            ShowHome();
        }

        // ---- canvas + helpers
        void BuildCanvas()
        {
            if (Camera.main == null) { var cam = new GameObject("Camera").AddComponent<Camera>(); cam.clearFlags = CameraClearFlags.SolidColor; cam.backgroundColor = Paper; cam.tag = "MainCamera"; }
            if (FindFirstObjectByType<EventSystem>() == null) { var es = new GameObject("EventSystem"); es.AddComponent<EventSystem>(); es.AddComponent<StandaloneInputModule>(); }
            var cgo = new GameObject("Canvas"); cgo.transform.SetParent(transform);
            canvas = cgo.AddComponent<Canvas>(); canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            var sc = cgo.AddComponent<CanvasScaler>(); sc.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize; sc.referenceResolution = new Vector2(390, 844); sc.matchWidthOrHeight = 0.5f;
            cgo.AddComponent<GraphicRaycaster>();
            root = cgo.GetComponent<RectTransform>();
            var bg = Img(root, "bg", Paper); Stretch(bg.rectTransform);
        }
        Image Img(Transform p, string n, Color c) { var g = new GameObject(n); g.transform.SetParent(p, false); var i = g.AddComponent<Image>(); i.color = c; i.raycastTarget = false; return i; }
        Text Txt(Transform p, string n, string s, int size, Color c, TextAnchor a = TextAnchor.MiddleCenter, FontStyle st = FontStyle.Normal)
        {
            var g = new GameObject(n); g.transform.SetParent(p, false); var t = g.AddComponent<Text>(); t.font = font; t.text = s; t.fontSize = size; t.color = c; t.alignment = a; t.fontStyle = st; t.raycastTarget = false; t.horizontalOverflow = HorizontalWrapMode.Overflow; t.verticalOverflow = VerticalWrapMode.Overflow; return t;
        }
        static void Stretch(RectTransform r) { r.anchorMin = Vector2.zero; r.anchorMax = Vector2.one; r.offsetMin = r.offsetMax = Vector2.zero; }
        static void Place(RectTransform r, float ax, float ay, float x, float y, float w, float h) { r.anchorMin = r.anchorMax = new Vector2(ax, ay); r.pivot = new Vector2(0.5f, 0.5f); r.anchoredPosition = new Vector2(x, y); r.sizeDelta = new Vector2(w, h); }
        Button Pill(Transform p, string n, string label, float y, float w, float h, System.Action onClick)
        {
            var i = Img(p, n, new Color(1, 1, 1, 0.1f)); i.raycastTarget = true; Place(i.rectTransform, 0.5f, 0.5f, 0, y, w, h);
            var b = i.gameObject.AddComponent<Button>(); b.onClick.AddListener(() => onClick());
            var cb = b.colors; cb.highlightedColor = Color.white; cb.pressedColor = new Color(0.8f, 0.85f, 0.95f); b.colors = cb;
            var t = Txt(i.transform, "label", label, 17, Ink, TextAnchor.MiddleCenter, FontStyle.Bold); Stretch(t.rectTransform);
            return b;
        }
        Sprite circle;
        Sprite Circle()
        {
            if (circle) return circle; int N = 128; var tex = new Texture2D(N, N, TextureFormat.RGBA32, false);
            for (int y = 0; y < N; y++) for (int x = 0; x < N; x++) { float dx = (x + .5f) / N - .5f, dy = (y + .5f) / N - .5f; float d = Mathf.Sqrt(dx * dx + dy * dy); tex.SetPixel(x, y, new Color(1, 1, 1, Mathf.Clamp01((0.5f - d) * N))); }
            tex.Apply(); circle = Sprite.Create(tex, new Rect(0, 0, N, N), new Vector2(.5f, .5f)); return circle;
        }

        // ---- home
        void BuildHome()
        {
            home = new GameObject("home"); home.transform.SetParent(root, false); Stretch(home.AddComponent<RectTransform>());
            var wm = Txt(home.transform, "wordmark", "mix.io", 44, Ink, TextAnchor.MiddleCenter, FontStyle.Bold); Place(wm.rectTransform, 0.5f, 1, 0, -110, 300, 60);
            orb = Img(home.transform, "orb", new Color(0.55f, 0.45f, 1f)); orb.sprite = Circle(); Place(orb.rectTransform, 0.5f, 0.62f, 0, 0, 240, 240);
            eyeText = Txt(orb.transform, "eye", "0.0", 46, Ink, TextAnchor.MiddleCenter, FontStyle.Bold); Place(eyeText.rectTransform, 0.5f, 0.5f, 0, 8, 240, 60);
            var el = Txt(orb.transform, "eyeLbl", "e y e", 11, new Color(1, 1, 1, .7f)); Place(el.rectTransform, 0.5f, 0.5f, 0, -28, 240, 20);
            foundText = Txt(home.transform, "found", "", 13, Muted); Place(foundText.rectTransform, 0.5f, 0.37f, 0, 0, 320, 24);
            Pill(home.transform, "play", "play", 0, 300, 58, StartPlay).GetComponent<RectTransform>().anchoredPosition = new Vector2(0, -230);
        }
        void ShowHome()
        {
            home.SetActive(true); play.SetActive(false); result.SetActive(false);
            var S = SaveSystem.Data; eyeText.text = Fmt(S.eye);
            foundText.text = S.palette.FindAll(p => p.p >= 50).Count.ToString("N0") + " / " + GameData.Colors.Count.ToString("N0") + " colors found";
            orb.color = S.idn != null ? IdColor(S.idn) : new Color(0.55f, 0.45f, 1f);
        }
        static string Fmt(float v) => v >= 100 ? "100" : (Mathf.Round(v * 10) / 10).ToString("0.0");
        static Color IdColor(Identity id) { int h = 7; foreach (var c in (id.name ?? "") + id.m + id.d + id.fav) h = unchecked(31 * h + c); return Color.HSVToRGB(Mathf.Abs(h) % 360 / 360f, 0.75f, 0.9f); }

        // ---- play
        void BuildPlay()
        {
            play = new GameObject("play"); play.transform.SetParent(root, false); Stretch(play.AddComponent<RectTransform>());
            var wm = Txt(play.transform, "wm", "mix.io", 18, Ink, TextAnchor.MiddleLeft, FontStyle.Bold); Place(wm.rectTransform, 0, 1, 90, -36, 140, 30);
            targetSwatch = Img(play.transform, "target", Color.gray); targetSwatch.sprite = Circle(); Place(targetSwatch.rectTransform, 0, 1, 52, -92, 56, 56);
            lvlText = Txt(play.transform, "lvl", "", 12, Muted, TextAnchor.MiddleLeft); Place(lvlText.rectTransform, 0, 1, 190, -80, 220, 20);
            nameText = Txt(play.transform, "name", "", 22, Ink, TextAnchor.MiddleLeft, FontStyle.Bold); Place(nameText.rectTransform, 0, 1, 190, -104, 220, 30);
            // glass
            glassRim = Img(play.transform, "glassRim", new Color(1, 1, 1, 0.12f)); Place(glassRim.rectTransform, 0.5f, 0.56f, 0, 0, 200, 300);
            liquid = Img(play.transform, "liquid", Color.white); Place(liquid.rectTransform, 0.5f, 0.56f, 0, 0, 196, 296);
            var sh = Shader.Find("MixIO/Liquid"); if (sh) { liquidMat = new Material(sh); liquid.material = liquidMat; } else Debug.LogWarning("[mix.io] Liquid shader not found; using flat color");
            liquid.raycastTarget = true; var et = liquid.gameObject.AddComponent<EventTrigger>();
            AddEvt(et, EventTriggerType.PointerDown, e => OnGlassDown((PointerEventData)e)); AddEvt(et, EventTriggerType.Drag, e => OnGlassDrag((PointerEventData)e)); AddEvt(et, EventTriggerType.PointerUp, e => OnGlassUp((PointerEventData)e));
            pctLive = Txt(play.transform, "pct", "", 13, Muted); Place(pctLive.rectTransform, 0.5f, 0.56f, 0, -175, 200, 20);
            // dye strip
            var sg = new GameObject("strip"); sg.transform.SetParent(play.transform, false); strip = sg.AddComponent<RectTransform>(); Place(strip, 0.5f, 0, 0, 150, 390, 80);
            for (int i = 0; i < ColorEngine.Dyes.Length; i++)
            {
                int idx = i; var d = ColorEngine.Dyes[i];
                var b = Img(strip, d.name, d.rgb); b.sprite = Circle(); b.raycastTarget = true; Place(b.rectTransform, 0.5f, 0.5f, 0, 0, 34, 34);
                var btn = b.gameObject.AddComponent<Button>(); btn.transition = Selectable.Transition.None; btn.onClick.AddListener(() => { sel = idx; LayoutStrip(); });
                beads.Add(b);
            }
            Pill(play.transform, "lock", "lock it in", 0, 300, 54, LockIn).GetComponent<RectTransform>().anchoredPosition = new Vector2(0, -340);
            var sm = Pill(play.transform, "empty", "empty", 0, 120, 40, () => { game.Empty(); RefreshPlay(); }); Place(sm.GetComponent<RectTransform>(), 0.5f, 0, -100, 62, 120, 40);
            var hm = Pill(play.transform, "home", "home", 0, 120, 40, ShowHome); Place(hm.GetComponent<RectTransform>(), 0.5f, 0, 100, 62, 120, 40);
        }
        static void AddEvt(EventTrigger et, EventTriggerType t, UnityEngine.Events.UnityAction<BaseEventData> a) { var e = new EventTrigger.Entry { eventID = t }; e.callback.AddListener(a); et.triggers.Add(e); }
        void StartPlay() { game.NewLevel(); home.SetActive(false); result.SetActive(false); play.SetActive(true); RefreshPlay(); LayoutStrip(); }
        void RefreshPlay()
        {
            var S = SaveSystem.Data; targetSwatch.color = game.target.rgb;
            lvlText.text = "no. " + (S.level).ToString("000") + " · " + new[] { "", "easy", "medium", "hard", "extra hard" }[Mathf.Clamp(game.target.tier, 1, 4)];
            nameText.text = game.target.name;
            pctLive.text = game.drops > 0 ? game.LivePercent.ToString("0.0") + "%" : "";
        }
        void LayoutStrip()
        {
            // calm dock: selected bead big in the centre, neighbours shrink away (wraps around)
            int N = beads.Count; float SP = 50;
            for (int i = 0; i < N; i++)
            {
                int k = ((i - sel) % N + N) % N; if (k > N / 2) k -= N;
                float x = SP * (0.66f * k + 0.62f * (float)System.Math.Tanh(k * 0.85f));
                float sc = 0.5f + 0.82f * Mathf.Exp(-k * k / 1.35f);
                var r = beads[i].rectTransform; r.anchoredPosition = new Vector2(x, 26 * (1.32f - sc) - 2); r.localScale = Vector3.one * sc;
                beads[i].color = new Color(ColorEngine.Dyes[i].rgb.r, ColorEngine.Dyes[i].rgb.g, ColorEngine.Dyes[i].rgb.b, Mathf.Abs(x) > 185 ? 0 : 1 - 0.6f * Mathf.Pow(Mathf.Min(1, Mathf.Abs(x) / 190f), 2));
                r.SetSiblingIndex(k == 0 ? N - 1 : 0);
            }
        }
        float downTime; Vector2 downPos; bool moved;
        void OnGlassDown(PointerEventData e) { downTime = Time.time; downPos = e.position; moved = false; lastStir = e.position; stirring = true; }
        void OnGlassDrag(PointerEventData e)
        {
            if ((e.position - downPos).magnitude > 9) moved = true;
            stirSpeed = Mathf.Lerp(stirSpeed, (e.position - lastStir).magnitude / Mathf.Max(Time.deltaTime, 0.001f) / 900f, 0.4f); lastStir = e.position;
        }
        void OnGlassUp(PointerEventData e)
        {
            stirring = false;
            if (!moved && Time.time - downTime < 0.45f) { game.AddDrop(sel); Haptic(); RefreshPlay(); }
        }
        void Update()
        {
            if (!play.activeSelf) return;
            if (stirring && stirSpeed > 0.02f) game.Stir(stirSpeed, Time.deltaTime); else stirSpeed = Mathf.Lerp(stirSpeed, 0, Time.deltaTime * 6);
            game.Tick(Time.deltaTime);
            var c = game.GlassColor;
            if (liquidMat) { liquidMat.SetColor("_Tint", new Color(c.r, c.g, c.b, 1)); liquidMat.SetFloat("_Stir", game.stirEnergy); liquidMat.SetFloat("_Unmixed", game.unmixed); }
            else liquid.color = new Color(c.r, c.g, c.b, game.drops == 0 ? 0.15f : 0.95f);
            if (game.drops > 0) pctLive.text = game.LivePercent.ToString("0.0") + "%";
        }
        void Haptic() { if (SaveSystem.Data.haptics) Handheld.Vibrate(); }

        // ---- result
        void BuildResult()
        {
            result = new GameObject("result"); result.transform.SetParent(root, false); Stretch(result.AddComponent<RectTransform>());
            resPct = Txt(result.transform, "pct", "", 64, Ink, TextAnchor.MiddleCenter, FontStyle.Bold); Place(resPct.rectTransform, 0.5f, 0.68f, 0, 0, 300, 80);
            resWord = Txt(result.transform, "word", "", 18, Muted); Place(resWord.rectTransform, 0.5f, 0.68f, 0, -56, 300, 30);
            resName = Txt(result.transform, "name", "", 24, Ink, TextAnchor.MiddleCenter, FontStyle.Bold); Place(resName.rectTransform, 0.5f, 0.5f, 0, 10, 340, 36);
            resRecipe = Txt(result.transform, "recipe", "", 14, Muted); Place(resRecipe.rectTransform, 0.5f, 0.5f, 0, -22, 340, 24);
            resChroma = Txt(result.transform, "chroma", "", 14, new Color(0.7f, 0.95f, 0.85f)); Place(resChroma.rectTransform, 0.5f, 0.5f, 0, -60, 340, 44);
            Pill(result.transform, "next", "next color", 0, 300, 58, () => { StartPlay(); }).GetComponent<RectTransform>().anchoredPosition = new Vector2(0, -250);
            var hm = Pill(result.transform, "home", "home", 0, 120, 40, ShowHome); Place(hm.GetComponent<RectTransform>(), 0.5f, 0, 0, 62, 120, 40);
        }
        void LockIn()
        {
            if (game.drops == 0) return;
            game.LockIn();
            play.SetActive(false); result.SetActive(true);
            resPct.text = game.lastPct.ToString("0.0") + "%"; resWord.text = Game.Verdict(game.lastPct);
            resName.text = game.target.name; resRecipe.text = "how to make it: " + game.Recipe();
            resChroma.text = game.lastChroma > 0 ? "+" + game.lastChroma + " chroma  ·  " + game.lastBreakdown : "under 50% · no chroma this time";
            StartCoroutine(CountUp());
        }
        IEnumerator CountUp() { float t = 0; while (t < 1) { t += Time.deltaTime / 0.9f; float e = 1 - Mathf.Pow(1 - Mathf.Clamp01(t), 3); resPct.text = (game.lastPct * e).ToString("0.0") + "%"; yield return null; } resPct.text = game.lastPct.ToString("0.0") + "%"; }
    }
}
