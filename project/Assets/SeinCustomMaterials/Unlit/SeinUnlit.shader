Shader "Sein/Unlit"
{
     Properties {
        _Mode("Rendering Mode", float) = 0.
        _Cutoff ("Alpha cutoff", Range(0., 1.)) = .5

        u_color ("Color", Color) = (1., 1., 1., 1.)
        u_texture ("Texture", 2D) = "white" {}
        
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
            
            float4 u_texture_ST;
            sampler2D u_texture;
            float4 u_color;
            float _Cutoff;
            float _Mode;
            

            v2f vert (appdata v)
            {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = TRANSFORM_TEX(v.uv, u_texture);
                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                fixed4 color = tex2D(u_texture, i.uv);
                color *= u_color;
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
