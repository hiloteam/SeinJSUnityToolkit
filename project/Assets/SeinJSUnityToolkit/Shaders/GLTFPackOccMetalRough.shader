
Shader "GLTF/PackOcclusionMetalRough" {
	Properties{
		_MetallicMap("Texture", 2D) = "white" {}
        _RoughnessMap("Texture", 2D) = "white" {}
		_OcclusionMap("Texture", 2D) = "white" {}
		_FlipY("Flip texture Y", Int) = 0
	}

	SubShader {
		 Pass {
			 CGPROGRAM

			 #pragma vertex vert
			 #pragma fragment frag
			 #include "UnityCG.cginc"
             #include "GLTFColorSpace.cginc"

			 struct vertInput {
			 float4 pos : POSITION;
			 float2 texcoord : TEXCOORD0;
			 };

			 struct vertOutput {
			 float4 pos : SV_POSITION;
			 float2 texcoord : TEXCOORD0;
			 };

			 sampler2D _MetallicMap;
			 sampler2D _RoughnessMap;
             sampler2D _OcclusionMap;
			 int _FlipY;


			 vertOutput vert(vertInput input) {
				 vertOutput o;
				 o.pos = UnityObjectToClipPos(input.pos);
				 o.texcoord.x = input.texcoord.x;
				 if(_FlipY == 1)
					o.texcoord.y = 1.0 - input.texcoord.y;
				 else
					 o.texcoord.y = input.texcoord.y;

				 return o;
			 }

			 half4 frag(vertOutput output) : COLOR {
			 	half4 final = half4(0.0, 0.0, 0.0 ,1.0);

                float4 metal = tex2D(_MetallicMap, output.texcoord);
                float4 rough = tex2D(_RoughnessMap, output.texcoord);
			 	float4 occ = tex2D(_OcclusionMap, output.texcoord);
     
                #if UNITY_COLORSPACE_GAMMA
                    final.r = occ.r;
                    final.g = rough.g;
                    final.b = metal.b;
                #else
                    final.r = srgbToLinear1(occ.r);
                    final.g = srgbToLinear1(rough.g);
                    final.b = srgbToLinear1(metal.b);
                #endif

			 	final.a = 1.0f;

			 	return final;
			 }

			ENDCG
		}
	}
}
