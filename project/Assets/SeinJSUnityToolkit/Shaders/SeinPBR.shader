/**
 * @File   : SeinPBR.shader
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 20/6/2019, 3:41:53 PM
 * @Description:
 */
Shader "Sein/PBR" {
    Properties {
        [HideInInspector] _Mode("Rendering Mode", float) = 0.
        [HideInInspector] _Cutoff ("Alpha cutoff", Range(0., 1.)) = .5
        [HideInInspector] [MaterialToggle] unlit ("Is unlit", int) = 0
        [HideInInspector] [MaterialToggle] workflow ("Workflow", int) = 0
        // 0: off, 1: on
        [HideInInspector] envReflection("Env Reflection", int) = 0
    
        _baseColor ("Base Color", Color) = (1,1,1,1)
        _baseColorMap ("Base Color Map (RGB)", 2D) = "white" {}
        
        _metallic ("Metallic Factor", Range(0,1)) = 0.5
        _metallicMap("Metallic Map (B)", 2D) = "white" {}
        
        _roughness("Roughness Factor", Range(0,1)) = 0.0
        _roughnessMap("Roughness Map (G)", 2D) = "white" {}
        
        _specularGlossinessMap("Specular(RGB) Glossiness(A) map", 2D) = "white" {}
        _specular ("Specular Factor", Color) = (.5, .5, .5, 1)
        _glossiness("Glossiness Factor", Range(0,1)) = 1
        
        [Normal] _normalMap("Normal Map (RGB)", 2D) = "bump" {}
        
        _occlusionStrength("Occlusion Strength", Range(0,1)) = 1.0
        _occlusionMap("Occlusion Map (R)", 2D) = "white" {}
        
        _emission("Emission Factor", Color) = (0,0,0,0)
        _emissionMap("Emission Map (RGB)", 2D) = "white" {}
        
        [MaterialToggle] cloneForInst ("Clone For Inst", int) = 0
        
        // Blending state
        [HideInInspector] _SrcBlend ("__src", float) = 1.
        [HideInInspector] _DstBlend ("__dst", float) = 0.
        [HideInInspector] _ZWrite ("__zw", float) = 1.
        [HideInInspector] _Cull ("__cull", float) = 2.
        [HideInInspector] _normalScale ("_normalScale", float) = 1.
        [HideInInspector] _emissionUV ("_emissionUV", int) = 0
        [HideInInspector] _glossMapScale ("_glossMapScale", float) = 0.      
        [HideInInspector] _brdfLUT ("_brdfLUT", 2D) = "black" { }
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
        
        int unlit;
        int workflow;
        
        float4 _baseColor;
        sampler2D _baseColorMap;
        
        float _metallic;
        sampler2D _metallicMap;
        
        float _roughness;
        sampler2D _roughnessMap;
        
        float3 _specular;
        float _glossiness;
        sampler2D _specularGlossinessMap;
        
        float _occlusionStrength;
        sampler2D _occlusionMap;
        
        sampler2D _normalMap;
        
        float4 _emission;
        sampler2D _emissionMap;
        
        float _Cull;

        float _Cutoff;
        float _Mode;
        
        int envReflection;
        sampler2D _brdfLUT;
        
        struct pbrdata
        {
            float3 N;
            float3 V;
            float3 L;
            float3 reflectance0;
            float3 reflectance90;
            float alphaRoughness;
            float3 diffuseColor;
            float3 specularColor;
            float3 ao;
            float roughness;
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
            float4 color: Color;
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
                if (!unlit) {
                    return sRGBToLinear(color);
                } else {
                    return color;
                }
            #endif

            return color;
        }
        
        float4 sampleEnvMap(sampler2D tex, float3 dir){
            float4 color = tex2D(tex, float2(atan2(dir.x, dir.z) * INVERSE_PI * 0.5 + 0.5, acos(dir.y) * INVERSE_PI));
            
            #if UNITY_COLORSPACE_GAMMA
                if (!unlit) {
                    return sRGBToLinear(color);
                } else {
                    return color;
                }
            #endif

            return color;
        }

        float4 sampleEnvMap(samplerCUBE tex, float3 dir){
            float4 color = texCUBE(tex, dir);
            
            #if UNITY_COLORSPACE_GAMMA
                if (!unlit) {
                    return sRGBToLinear(color);
                } else {
                    return color;
                }
            #endif

            return color;
        }
        
        // Physic light
        float getLightAttenuation(float3 distanceVec, float range){
            float distance = length(distanceVec);
            float attenuation = 1.0;
            
            attenuation = max(1.0 / (distance * distance), 0.001);
            if (range > 0.0) {
                attenuation *= max(min(1.0 - pow( distance / range, 4.0 ), 1.0), 0.0);
            }
            
            return attenuation;
        }
        
        float3 diffuse(float3 diffuseColor) {
            return diffuseColor * 0.3183098861837907;
        }

        float3 specularReflection(float3 reflectance0, float3 reflectance90, float VdotH) {
            return reflectance0 + (reflectance90 - reflectance0) * pow(clamp(1.0 - VdotH, 0.0, 1.0), 5.0);
        }
        
        float geometricOcclusion(float NdotL, float NdotV, float alphaRoughness) {
            float r = alphaRoughness * alphaRoughness;

            float attenuationL = 2.0 * NdotL / (NdotL + sqrt(r + (1.0 - r) * (NdotL * NdotL)));
            float attenuationV = 2.0 * NdotV / (NdotV + sqrt(r + (1.0 - r) * (NdotV * NdotV)));
            return attenuationL * attenuationV;
        }
        
        float microfacetDistribution(float alphaRoughness, float NdotH) {
            float roughnessSq = alphaRoughness * alphaRoughness;
            float f = (NdotH * roughnessSq - NdotH) * NdotH + 1.0;
            return roughnessSq * 0.3183098861837907 / (f * f);
        }
        
        float3 calculateLo(pbrdata pbr) {
            float3 H = normalize(pbr.L + pbr.V);
            float NdotL = clamp(dot(pbr.N, pbr.L), 0.001, 1.0);
            float NdotH = clamp(dot(pbr.N, H), 0.0, 1.0);
            float LdotH = clamp(dot(pbr.L, H), 0.0, 1.0);
            float VdotH = clamp(dot(pbr.V, H), 0.0, 1.0);
            // Calculate the shading terms for the microfacet specular shading model
            float3 F = specularReflection(pbr.reflectance0, pbr.reflectance90, VdotH);
            float G = geometricOcclusion(NdotL, pbr.NdotV, pbr.alphaRoughness);
            float D = microfacetDistribution(pbr.alphaRoughness, NdotH);

            float3 diffuseContrib;

            #ifdef LIGHTMAP_ON
                diffuseContrib = float3(0., 0., 0.);
            #else
                diffuseContrib = (1.0 - F) * diffuse(pbr.diffuseColor);
            #endif
            float3 specContrib = F * G * D / (4.0 * NdotL * pbr.NdotV);
            // Obtain final intensity as reflectance (BRDF) scaled by the energy of the light (cosine law)
            return NdotL * (diffuseContrib + specContrib);
        }
        
        pbrdata processPBR(fixed4 baseColor, v2f i) {
            pbrdata pbr;
        
            float3 viewPos = float3(0., 0., 0.);
            #ifdef HAS_NORMAL_MAP                
                float3 normal = UnpackNormal(tex2D(_normalMap, i.uv));
                pbr.N = normalize(mul(i.TBN, normal));
            #else
                pbr.N = normalize(i.viewNormal);
            #endif
            pbr.V = normalize(viewPos - i.viewPos.xyz);
            
            // render backface
            if (_Cull == 1.) {
                pbr.N = -pbr.N;
            }
            
            
            float3 specularColor;
            float roughness;
            // metallic roughness
            if (workflow == 0)
            {
                float metallic = tex2D(_metallicMap, i.uv).b * _metallic;
                roughness  = tex2D(_roughnessMap, i.uv).g * _roughness;
                
                roughness = clamp(roughness, 0.04, 1.0);
                metallic = clamp(metallic, 0.0, 1.0);
                
                float3 f0 = float3(0.04, 0.04, 0.04);
                pbr.diffuseColor = baseColor.rgb * (float3(1.0, 1.0, 1.0) - f0);
                pbr.diffuseColor *= (1.0 - metallic);
                specularColor = lerp(f0, baseColor.rgb, metallic);
            }
            // specular glossiness
            else
            {
                float3 specular = _specular.rgb;
                float glossiness = _glossiness;

                float4 specularGlossiness = sampleTexture(_specularGlossinessMap, i.uv);
                specular = specularGlossiness.rgb * specular;
                glossiness = specularGlossiness.a * glossiness;

                roughness = 1.0 - glossiness;
                float metallic = 0.0;
                pbr.diffuseColor = baseColor.rgb * (1.0 - max(max(specular.r, specular.g), specular.b));
                specularColor = specular;
            }
            
            pbr.roughness = roughness;
            pbr.specularColor = specularColor;
            
            float reflectance = max(max(specularColor.r, specularColor.g), specularColor.b);
            float reflectance90 = clamp(reflectance * 25.0, 0.0, 1.0);
            pbr.reflectance0 = specularColor.rgb;
            pbr.reflectance90 = float3(1.0, 1.0, 1.0) * reflectance90;

            pbr.NdotV = clamp(abs(dot(pbr.N, pbr.V)), 0.001, 1.0);
            pbr.alphaRoughness = roughness * roughness;

            return pbr;
        }
        
        float4 gamma(float4 color) {
            if (unlit) {
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
        
        v2f vert (appdata v)
        {
            v2f o;
            o.pos = UnityObjectToClipPos(v.vertex);
            o.uv = v.uv;
            o.viewNormal = mul(UNITY_MATRIX_IT_MV, v.normal);
            o.viewPos = UnityObjectToViewPos(v.vertex);
            o.worldPos = mul(unity_ObjectToWorld, v.vertex);
            o.uv1 = v.uv1 * unity_LightmapST.xy + unity_LightmapST.zw;
            o.color = v.color;
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
    
     SubShader {
        Lighting On
        Blend [_SrcBlend] [_DstBlend]
        ZWrite [_ZWrite]
        ZTest [unity_GUIZTestMode]
        Cull [_Cull]
            
        Pass
        {
            Tags { "LightMode"="ForwardBase" }
        
            CGPROGRAM
            
            #pragma multi_compile LIGHTMAP_OFF LIGHTMAP_ON
            #pragma multi_compile_fwdbase
            #pragma shader_feature ENV_SPECULAR_ON
            #pragma shader_feature EMISSION_MAP_MODE
            
            fixed3 getIBLContribution(pbrdata pbr) {
                fixed3 color = fixed3(.0, .0, .0);
                float3 worldNormal = mul(UNITY_MATRIX_I_V, pbr.N);
                float3 diffuseLight = SHEvalLinearL0L1(float4(worldNormal, 1));
                color.rgb += diffuseLight * pbr.diffuseColor * pbr.ao;
                
                #if ENV_SPECULAR_ON
                    float3 worldView = mul(UNITY_MATRIX_I_V, pbr.V);
                    float3 R = -normalize(reflect(worldView, worldNormal));
                    float3 brdf = tex2D(_brdfLUT, float2(pbr.NdotV, 1.0 - pbr.roughness)).rgb;
                    // UNITY_SPECCUBE_LOD_STEPS is 6, but in webgl it's always 11(log2(1024))
                    float lod = pbr.roughness * 11;
                    lod = clamp(lod, 0.0, 11);
                    float3 specularLight = DecodeHDR(UNITY_SAMPLE_TEXCUBE_LOD(unity_SpecCube0, R, lod), unity_SpecCube0_HDR);
                    color.rgb += specularLight * (pbr.specularColor * brdf.x + brdf.y);
                #endif
                
                return color;
            }
            
            float4 processLight(fixed4 baseColor, v2f i) {
                pbrdata pbr = processPBR(baseColor, i);
                                    
                float ao = tex2D(_occlusionMap, i.uv).r;
                ao = lerp(1.0, ao, _occlusionStrength);
                pbr.ao = ao;

                pbr.L = normalize(mul(UNITY_MATRIX_V, _WorldSpaceLightPos0.xyz));
                float3 radiance = convertLightColor(_LightColor0.rgb);
                
                fixed4 color;
                color.rgb = float3(0, 0, 0);
                color.rgb += radiance * calculateLo(pbr);

                #ifdef LIGHTMAP_ON
                    color.rgb += baseColor.rgb * DecodeLightmap(UNITY_SAMPLE_TEX2D(unity_Lightmap, i.uv1));
                #endif

                color.rgb += getIBLContribution(pbr);

                #ifdef EMISSION_MAP_MODE
                    color.rgb += sampleTexture(_emissionMap, i.uv).rgb;
                #else
                    color.rgb += _emission.rgb;
                #endif
                
                return color;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                fixed4 baseColor = sampleTexture(_baseColorMap, i.uv);
                baseColor *= _baseColor;
                baseColor *= i.color;
                fixed4 color = baseColor;
                
                if (!unlit) {
                    color = processLight(baseColor, i);
                }
                
                color.a = baseColor.a;
                
                if (_Mode == 1. && color.a <= _Cutoff) {
                    discard;
                }
                
                fixed shadow = SHADOW_ATTENUATION(i);
                color *= shadow;
                return gamma(color);
            }
            ENDCG
        }
        
        Pass
        {
            Tags { "LightMode"="ForwardAdd" }
            Blend One One
            Cull [_Cull]
        
            CGPROGRAM
            #pragma multi_compile_fwdadd

            float4 processLight(fixed4 baseColor, v2f i) {
                pbrdata pbr = processPBR(baseColor, i);
                
                float3 radiance = convertLightColor(_LightColor0.rgb);
                fixed4 color = float4(0., 0., 0., 1.);
                
                #ifdef USING_DIRECTIONAL_LIGHT
                    float attenuation = 1.0;
                    pbr.L = normalize(mul(UNITY_MATRIX_V, _WorldSpaceLightPos0.xyz));
                #else // point or spot light
                    float3 lightPos = mul(UNITY_MATRIX_V, _WorldSpaceLightPos0).xyz;
                    float3 distanceVec = lightPos - i.viewPos;
                    // https://github.com/candycat1992/Unity_Shaders_Book/issues/47
                    #if defined(POINT)
                        pbr.L = normalize(distanceVec);
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
                        pbr.L = mul(UNITY_MATRIX_V, worldLightUnitDir);
                        
                        float outerCutoff = atan(1. / cotanHalfSpotAngle);
                        if (outerCutoff < 0) {
                            outerCutoff += PI;
                        }
                        float cutoff = max(outerCutoff - 0.0872, 0.);
                        float theta = dot(normalize(distanceVec), pbr.L);
                        float epsilon = cos(cutoff) - cos(outerCutoff); 
                        float intensity = clamp((theta - cos(outerCutoff)) / epsilon, 0.0, 1.0);
                        attenuation *= intensity;
                    #else
                        float attenuation = 1.0;
                    #endif
                #endif
                
                color.rgb = radiance * attenuation * calculateLo(pbr);
                return color;
            }

            fixed4 frag (v2f i) : SV_Target
            {
               fixed4 baseColor = sampleTexture(_baseColorMap, i.uv);
                baseColor *= _baseColor;
                baseColor *= i.color;
                fixed4 color;
                
                if (!unlit) {
                    color = processLight(baseColor, i);
                }
                
                color.a = baseColor.a;
                
                if (_Mode == 1. && color.a <= _Cutoff) {
                    discard;
                }

                return gamma(color);
            }
            ENDCG
        }
    }
    
    FallBack "Diffuse"
    CustomEditor "SeinPBRShaderGUI"
 }
 