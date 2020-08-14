/**
* @File   : SeinBasic.shader
* @Author : dtysky (dtysky@outlook.com)
* @Date   : 12/01/2020, 17:00:00
* @Description:
*/
Shader "Sein/Basic" {
	Properties{
		[HideInInspector] _Mode("Rendering Mode", float) = 0.
		[HideInInspector] _Cutoff("Alpha cutoff", Range(0., 1.)) = .5
		// 0: off, 1: on
		envReflection("Env Reflection", int) = 0
		// 0: None, 1: PHONG, 2: BLINN-PHONE, 3: LAMBERT
		lightType("Light Type", int) = 2

		u_diffuse("Diffuse Color", Color) = (1,1,1,1)
		u_diffuseMap("Diffuse Map (RGB)", 2D) = "white" {}

		u_ambientMap("Ambient Map (RGB)", 2D) = "white" {}

		u_specular("Specular Color", Color) = (0,0,0,1)
		u_specularMap("Specular Map (RGB)", 2D) = "white" {}

		u_reflectivity("Reflectivity", float) = 0
		u_refractRatio("Refract Ratio", float) = 0
		u_refractivity("Refractivity", float) = 0

		[Normal] u_normalMap("Normal Map (RGB)", 2D) = "bump" {}

		u_emission("Emission Factor", Color) = (0,0,0,1)
		u_emissionMap("Emission Map (RGB)", 2D) = "white" {}
		u_shininess("Emission Shininess", float) = 1

		[MaterialToggle] cloneForInst("Clone For Inst", int) = 0

		// Blending state
		[HideInInspector] _SrcBlend("__src", float) = 1.
		[HideInInspector] _DstBlend("__dst", float) = 0.
		[HideInInspector] _ZWrite("__zw", float) = 1.
		[HideInInspector] _Cull("__cull", float) = 2.
		[HideInInspector] _normalScale("_normalScale", float) = 1.
	}

	CGINCLUDE
	#pragma exclude_renderers d3d11
	#pragma shader_feature HAS_NORMAL_MAP
	#pragma vertex vert
	#pragma fragment frag

	#include "UnityCG.cginc"
	#include "Lighting.cginc"
	#include "AutoLight.cginc"
	const float PI = 3.141592653589793;
	const float INVERSE_PI = 0.3183098861837907;

	float4 u_diffuse;
	sampler2D u_diffuseMap;

	sampler2D u_ambientMap;

	float4 u_specular;
	sampler2D u_specularMap;

	sampler2D u_normalMap;

	float4 u_emission;
	sampler2D u_emissionMap;
	float u_shininess;

	float u_reflectivity;
	float u_refractRatio;
	float u_refractivity;

	float _Cull;
	float _Cutoff;
	float _Mode;

	int lightType;
	int envReflection;

	struct lightdata
	{
		float3 N;
		float3 V;
		float3 L;
		float3 diffuseColor;
		float3 specularColor;
		float NdotV;
	};

	struct appdata
	{
		float4 vertex : POSITION;
		float3 normal : NORMAL;
		float2 uv : TEXCOORD0;
		float2 uv1 : TEXCOORD1;
		float4 tangent : TANGENT;
		float4 color : COLOR;
	};

	struct v2f
	{
		float2 uv : TEXCOORD0;
		float2 uv1 : TEXCOORD1;
		float4 pos : SV_POSITION;
		float3 viewNormal: NORMAL;
		float3 viewPos: TEXCOORD2;
		float3 worldPos: TEXCOORD3;
		SHADOW_COORDS(5)
		float3x3 TBN: TEXCOORD6;
	};

	float3 lessThanEqual(float3 v1, float3 v2) {
		float3 v;
		v.r = v1.r <= v2.r ? 1. : 0.;
		v.g = v1.g <= v2.g ? 1. : 0.;
		v.b = v1.b <= v2.b ? 1. : 0.;

		return v;
	}

	float4 sRGBToLinear(float4 value) {
		return float4(
		lerp(
		pow(
		value.rgb * 0.9478672986 + float3(0.0521327014, 0.0521327014, 0.0521327014),
		float3(2.4, 2.4, 2.4)
		),
		value.rgb * 0.0773993808,
		lessThanEqual(value.rgb, float3(0.04045, 0.04045, 0.04045))
		),
		value.w
	);
	}

	float4 sampleTexture(sampler2D tex, float2 uv) {
		float4 color = tex2D(tex, uv);

		#if UNITY_COLORSPACE_GAMMA
			return color;
			if (lightType != 0) {
				return sRGBToLinear(color);
			}
			else {
				return color;
			}
		#endif

		return color;
	}

	float4 sampleEnvMap(sampler2D tex, float3 dir) {
		float4 color = tex2D(tex, float2(atan2(dir.x, dir.z) * INVERSE_PI * 0.5 + 0.5, acos(dir.y) * INVERSE_PI));

		#if UNITY_COLORSPACE_GAMMA
			if (!unlit) {
				return sRGBToLinear(color);
			}
			else {
				return color;
			}
		#endif

		return color;
	}

	float4 sampleEnvMap(samplerCUBE tex, float3 dir) {
		float4 color = texCUBE(tex, dir);

		#if UNITY_COLORSPACE_GAMMA
			if (!unlit) {
				return sRGBToLinear(color);
			}
			else {
				return color;
			}
		#endif

		return color;
	}

	float getLightAttenuation(float3 distanceVec, float range) {
		float distance = length(distanceVec);
		float3 info = float3(1, max(0, 4.5 / range), max(0, 75 / range * range));
		float attenuation = 1.0 / (info.x + info.y * distance + info.z * distance * distance);

		return attenuation;
	}

	float3 getDiffuse(float3 normal, float3 lightDir) {
		return max(dot(normal, lightDir), 0);
	}

	float3 getSpecular(float3 viewDir, float3 lightDir, float3 normal, float shininess) {

		if (lightType == 1) {
			return pow(max(dot(viewDir, reflect(-lightDir, normal)), 0.0), shininess);
		}

		return pow(max(dot(normal, normalize(lightDir + viewDir)), 0.0), shininess);
	}

	lightdata processBasic(v2f i) {
		lightdata ld;

		float3 viewPos = float3(0., 0., 0.);
		#ifdef HAS_NORMAL_MAP                
			float3 normal = UnpackNormal(tex2D(_normalMap, i.uv));
			ld.N = normalize(mul(i.TBN, normal));
		#else
		ld.N = normalize(i.viewNormal);
		#endif
		ld.V = normalize(viewPos - i.viewPos.xyz);

		// render backface
		if (_Cull == 1.) {
			ld.N = -ld.N;
		}

#ifdef DIFFUSE_USE_MAP
		ld.diffuseColor = sampleTexture(u_diffuseMap, i.uv).rgb;
#else
		ld.diffuseColor = u_diffuse.rgb;
#endif

#ifdef SPECULAR_USE_MAP
		ld.specularColor = sampleTexture(u_specularMap, i.uv).rgb;
#else
		ld.specularColor = u_specular.rgb;
#endif

		return ld;
	}

	fixed3 getIBLContribution(lightdata ld) {
		fixed3 color = fixed3(.0, .0, .0);
		float3 worldNormal = mul(UNITY_MATRIX_I_V, ld.N);

#if ENV_SPECULAR_ON
		float3 worldView = mul(UNITY_MATRIX_I_V, ld.V);

		if (u_reflectivity > 0) {
			float3 R = -normalize(reflect(worldView, worldNormal));
			color += DecodeHDR(UNITY_SAMPLE_TEXCUBE_LOD(unity_SpecCube0, R, 0), unity_SpecCube0_HDR) * u_reflectivity;
		}

		if (u_refractivity > 0) {
			float3 R = -normalize(refract(worldView, worldNormal, u_refractRatio));
			color += DecodeHDR(UNITY_SAMPLE_TEXCUBE_LOD(unity_SpecCube0, R, 0), unity_SpecCube0_HDR) * u_refractivity;
		}
#endif

		return color;
	}

	float4 gamma(float4 color) {
		if (lightType == 0) {
			return color;
		}

		#ifdef UNITY_HDR_ON
			color.rgb = float3(1., 1., 1.) - exp(-color.rgb * .7);
		#endif

		#if UNITY_COLORSPACE_GAMMA
			color.rgb = pow(color.rgb, 1.0 / 2.2);
		#endif

		return color;
	}

	float3 convertLightColor(float3 lightColor) {
		#if UNITY_COLORSPACE_GAMMA
			return lightColor;
		#else
			return pow(lightColor, 1.0 / 2.2);
		#endif
	}

	v2f vert(appdata v)
	{
		v2f o;
		o.pos = UnityObjectToClipPos(v.vertex);
		o.uv = v.uv;
		o.viewNormal = mul(UNITY_MATRIX_IT_MV, v.normal);
		o.viewPos = UnityObjectToViewPos(v.vertex);
		o.worldPos = mul(unity_ObjectToWorld, v.vertex);
		o.uv1 = v.uv1 * unity_LightmapST.xy + unity_LightmapST.zw;
		TRANSFER_SHADOW(o)

		#ifdef HAS_NORMAL_MAP
			float3 T = normalize(mul(UNITY_MATRIX_IT_MV, v.tangent.xyz));
			float3 N = normalize(o.viewNormal);
			T = normalize(T - dot(T, N) * N);
			float3 B = cross(N, T) * v.tangent.w;
			o.TBN = float3x3(T, B, N);
		#endif

		return o;
	}
	ENDCG

	SubShader{
		Lighting On
		Blend[_SrcBlend][_DstBlend]
		ZWrite[_ZWrite]
		ZTest[unity_GUIZTestMode]
		Cull[_Cull]

		Pass
		{
			Tags { "LightMode" = "ForwardBase" }

			CGPROGRAM

			#pragma multi_compile LIGHTMAP_OFF LIGHTMAP_ON
			#pragma multi_compile_fwdbase
			#pragma shader_feature ENV_SPECULAR_ON
			#pragma shader_feature DIFFUSE_USE_MAP
			#pragma shader_feature SPECULAR_USE_MAP
			#pragma shader_feature EMISSION_USE_MAP
			#pragma shader_feature AMBIENT_USE_MAP

			float4 processLight(fixed4 baseColor, v2f i) {
				lightdata ld = processBasic(i);
				fixed4 color = fixed4(0, 0, 0, 1);
				fixed shadow = SHADOW_ATTENUATION(i);
				ld.L = normalize(mul(UNITY_MATRIX_V, _WorldSpaceLightPos0.xyz));

				float3 lightColor = convertLightColor(_LightColor0.rgb);
				float diff = getDiffuse(ld.N, ld.L);
				color.rgb += diff * lightColor * shadow * ld.diffuseColor;

				if (lightType == 1 || lightType == 2) {
					float spec = getSpecular(ld.V, ld.L, ld.N, u_shininess);
					color.rgb += spec * lightColor * shadow * ld.specularColor;
				}

#ifdef LIGHTMAP_ON
				color.rgb += baseColor.rgb * DecodeLightmap(UNITY_SAMPLE_TEX2D(unity_Lightmap, i.uv1));
#endif

				color.rgb += getIBLContribution(ld);

#ifdef EMISSION_USE_MAP
				color += sampleTexture(u_emissionMap, i.uv);
#else
				color += u_emission;
#endif

				return color;
			}

			fixed4 frag(v2f i) : SV_Target
			{
#ifdef AMBIENT_USE_MAP
				fixed4 ambientColor = sampleTexture(u_ambientMap, i.uv);
#else
#ifdef DIFFUSE_USE_MAP
				fixed4 ambientColor = sampleTexture(u_diffuseMap, i.uv);
#else
				fixed4 ambientColor = u_diffuse;
#endif
#endif
				fixed4 color = ambientColor;

				if (lightType != 0) {
					color = processLight(ambientColor, i);
				}

				color.a = ambientColor.a;

				if (_Mode == 1. && color.a <= _Cutoff) {
					discard;
				}

				return gamma(color);
			}
			ENDCG
		}

		Pass
		{
			Tags { "LightMode" = "ForwardAdd" }
			Blend One One
			Cull[_Cull]

			CGPROGRAM
			#pragma multi_compile_fwdadd

			float4 processLight(v2f i) {
				lightdata ld = processBasic(i);

				float3 radiance = convertLightColor(_LightColor0.rgb);
				fixed shadow = SHADOW_ATTENUATION(i);
				fixed4 color = float4(0., 0., 0., 1.);

				#ifdef USING_DIRECTIONAL_LIGHT
					float attenuation = 1.0;
					ld.L = normalize(mul(UNITY_MATRIX_V, _WorldSpaceLightPos0.xyz));
				#else // point or spot light
					float3 lightPos = mul(UNITY_MATRIX_V, _WorldSpaceLightPos0).xyz;
					float3 distanceVec = lightPos - i.viewPos;
					// https://github.com/candycat1992/Unity_Shaders_Book/issues/47
					#if defined(POINT)
						ld.L = normalize(distanceVec);
						float3 lightCoord = mul(unity_WorldToLight, float4(i.worldPos, 1)).xyz;
						float range = length(distanceVec) / length(lightCoord);
						float attenuation = getLightAttenuation(distanceVec, range);
					#elif defined (SPOT)
						float4 lightCoord = mul(unity_WorldToLight, float4(i.worldPos, 1));
						float range = length(distanceVec) / length(lightCoord.xyz);
						float attenuation = getLightAttenuation(distanceVec, range);
						float cotanHalfSpotAngle = 2. * lightCoord.z / lightCoord.w;

						float3 lightSpaceUnitDir = float3(0., 0., -1.);
						float3 worldLightUnitDir = normalize(mul(lightSpaceUnitDir, (float3x3)unity_WorldToLight));
						ld.L = mul(UNITY_MATRIX_V, worldLightUnitDir);

						float outerCutoff = atan(1. / cotanHalfSpotAngle);
						if (outerCutoff < 0) {
							outerCutoff += PI;
						}
						float cutoff = max(outerCutoff - 0.0872, 0.);
						float theta = dot(normalize(distanceVec), ld.L);
						float epsilon = cos(cutoff) - cos(outerCutoff);
						float intensity = clamp((theta - cos(outerCutoff)) / epsilon, 0.0, 1.0);
						attenuation *= intensity;
					#else
						float attenuation = 1.0;
					#endif
				#endif

				float diff = getDiffuse(ld.N, ld.L);
				color.rgb += diff * radiance * shadow * ld.diffuseColor;

				if (lightType == 1 || lightType == 2) {
					float spec = getSpecular(ld.V, ld.L, ld.N, u_shininess);
					color.rgb += spec * radiance * shadow * ld.specularColor;
				}

				return color;
			}

			fixed4 frag(v2f i) : SV_Target
			{
				fixed4 color = fixed4(0, 0, 0, 0);

				if (lightType != 0) {
					color = processLight(i);
				}

				if (_Mode == 1. && color.a <= _Cutoff) {
					discard;
				}

				return gamma(color);
			}
			ENDCG
		}
	}

	FallBack "Diffuse"
	CustomEditor "SeinBasicShaderGUI"
}
