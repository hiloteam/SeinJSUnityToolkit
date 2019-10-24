Shader "Sein/Unlit"
{
     Properties {
        _Mode("Rendering Mode", float) = 0.
        _Cutoff ("Alpha cutoff", Range(0., 1.)) = .5

        _Color ("Color", Color) = (1., 1., 1., 1.)
        _MainTex ("Texture", 2D) = "white" {}
        
        [MaterialToggle] cloneForInst ("Clone For Inst", int) = 0
        
        // Blending state
        [HideInInspector] _SrcBlend ("__src", float) = 1.
        [HideInInspector] _DstBlend ("__dst", float) = 0.
        [HideInInspector] _ZWrite ("__zw", float) = 1.
    }
   
    SubShader {
        //Tags { "RenderType"="Opaque" }
        Lighting Off
        Blend [_SrcBlend] [_DstBlend]
        ZWrite [_ZWrite]
        ZTest [unity_GUIZTestMode]
            
        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            
            #include "UnityCG.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
            };

            struct v2f
            {
                float2 uv : TEXCOORD0;
                float4 vertex : SV_POSITION;
            };
            
            float4 _MainTex_ST;
            sampler2D _MainTex;
            float4 _Color;
            float _Cutoff;
            float _Mode;
            

            v2f vert (appdata v)
            {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = TRANSFORM_TEX(v.uv, _MainTex);
                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                fixed4 color = tex2D(_MainTex, i.uv);
                color *= _Color;
                if (_Mode == 1. && color.a <= _Cutoff) {
                    discard;
                }
                return color;
            }
            ENDCG
        }
    }
    
    CustomEditor "SeinUnlitShaderGUI"
}
