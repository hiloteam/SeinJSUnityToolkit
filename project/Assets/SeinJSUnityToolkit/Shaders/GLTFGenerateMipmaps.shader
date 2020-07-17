Shader "GLTF/GenerateMipmaps" 
{
	Properties{
		[HDR] _HDRTexture("Texture", 2D) = "white" {}
    }

    SubShader {
         Pass {
             CGPROGRAM

             #pragma vertex vert
             #pragma fragment frag
             #include "UnityCG.cginc"

             struct vertInput {
             float4 pos : POSITION;
             float2 texcoord : TEXCOORD0;
             };

             struct vertOutput {
             float4 pos : SV_POSITION;
             float2 texcoord : TEXCOORD0;
             };

             sampler2D _HDRTexture;

             vertOutput vert(vertInput input) {
                 vertOutput o;
                 o.pos = UnityObjectToClipPos(input.pos);
                 o.texcoord.x = input.texcoord.x;
				 o.texcoord.y = input.texcoord.y;

                 return o;
             }

             float4 frag(vertOutput output) : COLOR {
                float2 uv = output.texcoord;
                float logv = log2(uv.y);
                float lod = floor(abs(logv));

                float scale = pow(2, lod);
                uv.x *= scale;
                uv.y -= 0.5/scale;
                uv.y *= scale*2;

                if (uv.x > 1) {
                    return float4(1, 1, 1, 0);
                }

                float4 color = float4(DecodeLightmap(tex2Dlod(_HDRTexture, float4(uv.x, uv.y, 0, lod))), 1);
                float d = 1;
                float m = max(color.r, max(color.g, color.b));

                if (m > 1) {
                    d = 1 / m;
                }

                color.r = color.r * d;
                color.g = color.g * d;
                color.b = color.b * d;
                color.a = d;

                return color;
             }

            ENDCG
        }
    }
}
