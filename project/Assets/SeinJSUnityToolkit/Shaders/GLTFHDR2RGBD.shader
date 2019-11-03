
/**
 * @File   : GLTFHDR2RGBD.shader
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/22/2019, 1:30:53 PM
 * @Description:
 */
Shader "GLTF/HDR2RGBD" {
    Properties{
		[HDR] _HDRTexture("Texture", 2D) = "white" {}
		_FlipY("FlipY", int) = 1
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

             UNITY_DECLARE_TEX2D(_HDRTexture);
			 int _FlipY;

             vertOutput vert(vertInput input) {
                 vertOutput o;
                 o.pos = UnityObjectToClipPos(input.pos);
                 o.texcoord.x = input.texcoord.x;
				 if (_FlipY == 1) {
					 o.texcoord.y = 1.0 - input.texcoord.y;
				 }
				 else {
					 o.texcoord.y = input.texcoord.y;
				 }

                 return o;
             }

             float4 frag(vertOutput output) : COLOR {
                float4 color = float4(DecodeLightmap(UNITY_SAMPLE_TEX2D(_HDRTexture, output.texcoord)), 1);
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
