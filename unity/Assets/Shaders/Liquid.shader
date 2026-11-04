// mix.io — glass water. A UI shader (works under both Built-in and URP because Canvas
// rendering bypasses the pipeline). Draws the water body with a soft gas-like swirl,
// a surface line, and a meniscus; _Tint is the mixed color, _Fill the water level.
Shader "MixIO/Liquid"
{
    Properties
    {
        [PerRendererData] _MainTex ("Texture", 2D) = "white" {}
        _Tint ("Tint", Color) = (0.9,0.9,0.9,1)
        _Fill ("Fill", Range(0,1)) = 0.82
        _Stir ("Stir energy", Range(0,1)) = 0
        _Unmixed ("Unmixed", Range(0,1)) = 0
        _Color ("Color", Color) = (1,1,1,1)
        _StencilComp ("Stencil Comparison", Float) = 8
        _Stencil ("Stencil ID", Float) = 0
        _StencilOp ("Stencil Operation", Float) = 0
        _StencilWriteMask ("Stencil Write Mask", Float) = 255
        _StencilReadMask ("Stencil Read Mask", Float) = 255
        _ColorMask ("Color Mask", Float) = 15
    }
    SubShader
    {
        Tags { "Queue"="Transparent" "IgnoreProjector"="True" "RenderType"="Transparent" "PreviewType"="Plane" "CanUseSpriteAtlas"="True" }
        Stencil { Ref [_Stencil] Comp [_StencilComp] Pass [_StencilOp] ReadMask [_StencilReadMask] WriteMask [_StencilWriteMask] }
        Cull Off Lighting Off ZWrite Off ZTest [unity_GUIZTestMode] Blend SrcAlpha OneMinusSrcAlpha ColorMask [_ColorMask]
        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "UnityCG.cginc"
            struct appdata { float4 vertex : POSITION; float2 uv : TEXCOORD0; float4 color : COLOR; };
            struct v2f { float4 pos : SV_POSITION; float2 uv : TEXCOORD0; float4 color : COLOR; };
            fixed4 _Tint; float _Fill; float _Stir; float _Unmixed;
            v2f vert (appdata v) { v2f o; o.pos = UnityObjectToClipPos(v.vertex); o.uv = v.uv; o.color = v.color; return o; }
            float h(float2 p) { return frac(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }
            float n2(float2 p) { float2 i = floor(p), f = frac(p); f = f*f*(3-2*f); return lerp(lerp(h(i), h(i+float2(1,0)), f.x), lerp(h(i+float2(0,1)), h(i+float2(1,1)), f.x), f.y); }
            float fbm(float2 p) { float a = .5, r = 0; for (int k = 0; k < 3; k++) { r += a * n2(p); p = p * 2.03 + 7.1; a *= .5; } return r; }
            fixed4 frag (v2f i) : SV_Target
            {
                float2 uv = i.uv; float t = _Time.y;
                // glass silhouette: rounded cylinder
                float x = uv.x * 2 - 1; float ax = abs(x);
                float circ = sqrt(max(1 - x*x, 0));
                float top = _Fill - 0.025 * (1 - circ) + 0.006 * sin(uv.x * 22 + t * 2.4) * (0.3 + _Stir);
                float inWater = smoothstep(top + 0.004, top - 0.004, uv.y) * (1 - smoothstep(0.985, 1.0, ax));
                // body color: tint, darker toward the edges, with a soft swirl while stirring / unmixed
                float2 q = float2(fbm(uv * 3.1 + t * 0.07), fbm(uv * 3.1 - t * 0.05 + 4.2));
                float sw = fbm(uv * 4.5 + q * 1.6 + t * 0.12 * (0.4 + _Stir));
                float3 c = _Tint.rgb;
                c = lerp(c, c * 0.78, smoothstep(0.55, 1.0, ax));
                c = lerp(c, lerp(c * 0.86, min(c * 1.18 + 0.06, 1), sw), 0.35 * (_Unmixed + 0.35 * _Stir));
                // light: a soft vertical highlight and a bright thin surface line
                float hl = exp(-pow((x + 0.55) / 0.22, 2)) * 0.10;
                float surf = exp(-pow((uv.y - top) / 0.006, 2)) * 0.6;
                c += hl + surf;
                float alpha = inWater * _Tint.a;
                // near-clear water stays mostly transparent (same rule as the web game)
                float dn = saturate((1 - min(c.r, min(c.g, c.b))) * 4.0);
                alpha *= max(lerp(0.10, 1.0, dn), surf * 0.9 + 0.14 * smoothstep(0.86, 1.0, ax));
                return fixed4(c, alpha) * i.color;
            }
            ENDCG
        }
    }
}
