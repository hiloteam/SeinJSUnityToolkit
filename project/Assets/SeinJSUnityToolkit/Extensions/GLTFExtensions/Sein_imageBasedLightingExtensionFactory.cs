/**
 * @File   : Sein_imageBasedLightingExtensionFactory.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/12 0:00:00PM
 */
using System;
using Newtonsoft.Json.Linq;
using GLTF.Math;
using Newtonsoft.Json;
using GLTF.Extensions;
using System.Collections.Generic;
using GLTF.Schema;
using UnityEngine;
using System.IO;
using UnityEditor;

namespace SeinJS
{
    public class Sein_imageBasedLightingExtensionFactory : SeinExtensionFactory
    {
        public override string GetExtensionName() { return "Sein_imageBasedLighting"; }
        public override List<EExtensionType> GetExtensionTypes() { return new List<EExtensionType> { EExtensionType.Global, EExtensionType.Material }; }
        private static Texture2D brdfLUT;

        private Dictionary<ExporterEntry, Dictionary<int, int>> _cache = new Dictionary<ExporterEntry, Dictionary<int, int>>();
        private Dictionary<ExporterEntry, int> _onlyLightingId = new Dictionary<ExporterEntry, int>();

        public override void BeforeExport()
        {
            _cache.Clear();
            _onlyLightingId.Clear();
            var brdfPath = "Assets/SeinJSUnityToolkit/Shaders/brdfLUT.jpg";
            brdfLUT = AssetDatabase.LoadAssetAtPath<Texture2D>(brdfPath);
        }

        public override void FinishExport()
        {
            _cache.Clear();
            _onlyLightingId.Clear();
        }

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null, object options = null)
        {
            var mat = component as UnityEngine.Material;
            var hasReflection = ExporterSettings.Lighting.reflection && mat.GetInt("envReflection") != (int)SeinPBRShaderGUI.EnvReflection.Off;
            var hasLighting = RenderSettings.ambientMode == UnityEngine.Rendering.AmbientMode.Skybox || RenderSettings.ambientMode == UnityEngine.Rendering.AmbientMode.Trilight;

            if (!hasReflection && !hasLighting)
            {
                return;
            }

            if (entry.root.Extensions == null)
            {
                entry.root.Extensions = new Dictionary<string, Extension>();
            }

            Sein_imageBasedLightingExtension globalExtension;
            if (!entry.root.Extensions.ContainsKey(ExtensionName))
            {
                globalExtension = new Sein_imageBasedLightingExtension();
                globalExtension.isGlobal = true;
                AddExtension(entry.root.Extensions, globalExtension);
            }
            else
            {
                globalExtension = (Sein_imageBasedLightingExtension)entry.root.Extensions[ExtensionName];
            }

            var extension = new Sein_imageBasedLightingExtension();

            if (hasLighting && !hasReflection && _onlyLightingId.ContainsKey(entry))
            {
                extension.iblIndex = _onlyLightingId[entry];
                extension.iblType = 1;
                AddExtension(extensions, extension);
                return;
            }

            var light = new Sein_imageBasedLightingExtension.Light { specMap = -1 };

            var coefficients = new float[9][];
            UnityEngine.Rendering.SphericalHarmonicsL2 shs;
            LightProbes.GetInterpolatedProbe(new UnityEngine.Vector3(), null, out shs);
            float diffuseIntensity = 1;
            if (shs != null)
            {
                for (var c = 0; c < 9; c += 1)
                {
                    coefficients[c] = new float[3];
                    for (var b = 0; b < 3; b += 1)
                    {
                        coefficients[c][b] = shs[b, c];
                    }
                }
            }
            else
            {
                Debug.LogWarning("There is no baked light probe.");
            }

            SHToRightHand(coefficients);

            light.shCoefficients = coefficients;
            light.diffuseIntensity = diffuseIntensity;

            if (hasLighting && !hasReflection)
            {
                if (!_onlyLightingId.ContainsKey(entry))
                {
                    globalExtension.lights.Add(light);
                    _onlyLightingId.Add(entry, globalExtension.lights.Count - 1);
                }
                extension.iblIndex = _onlyLightingId[entry];
                extension.iblType = 1;
                AddExtension(extensions, extension);
                return;
            }

            var isCustomCubMap = RenderSettings.defaultReflectionMode == UnityEngine.Rendering.DefaultReflectionMode.Custom;
            //ReflectionProbe
            float specIntensity = RenderSettings.reflectionIntensity;
            int textureId = -1;
            int cacheId = 0;

            light.specType = "Cube";
            if (isCustomCubMap)
            {
                var Id = entry.SaveCubeTexture(RenderSettings.customReflection, maxSize: ExporterSettings.Lighting.reflectionSize);
                cacheId = Id.GetHashCode();
                textureId = Id.Id;
            }
            else
            {
                var skybox = RenderSettings.skybox;

                if (skybox == null)
                {
                    Debug.LogWarning("Use skybox as relfection source, but skybox is not defined, ignore... Check 'http://seinjs.com/cn/tutorial/artist/reflection'");
                    return;
                }

                if (skybox.shader.name == "Skybox/Cubemap")
                {
                    var cubemap = skybox.GetTexture("_Tex") as Cubemap;
                    var Id = entry.SaveCubeTexture(cubemap, maxSize: ExporterSettings.Lighting.reflectionSize);
                    cacheId = Id.GetHashCode();
                    textureId = Id.Id;
                }
                else if (skybox.shader.name == "Skybox/6 Sided")
                {
                    var texes = new Texture2D[] {
                        skybox.GetTexture("_RightTex") as Texture2D,
                        skybox.GetTexture("_LeftTex") as Texture2D,
                        skybox.GetTexture("_UpTex") as Texture2D,
                        skybox.GetTexture("_DownTex") as Texture2D,
                        skybox.GetTexture("_FrontTex") as Texture2D,
                        skybox.GetTexture("_BackTex") as Texture2D
                    };
                    var Id = entry.SaveCubeTexture(texes, maxSize: ExporterSettings.Lighting.reflectionSize);
                    cacheId = Id.GetHashCode();
                    textureId = Id.Id;
                }
                else if (skybox.shader.name == "Skybox/Panoramic")
                {
                    var map = skybox.GetTexture("_MainTex") as Texture2D;
                    var fp = AssetDatabase.GetAssetPath(map);
                    fp = fp.Replace(Path.GetExtension(fp), "-mipmaps" + Path.GetExtension(fp));
                    var Id = entry.SaveTexture(GLTFTextureUtils.generateMipmaps(map), false, maxSize: ExporterSettings.Lighting.reflectionSize, flipY: false, path: fp);
                    textureId = Id.Id;
                    cacheId = Id.GetHashCode();
                    light.specType = "2D";
                    light.specIncludeMipmaps = true;
                }
                else
                {
                    Utils.ThrowExcption("Only support 'Skybox/Cubemap', 'Skybox/6 Side', 'Skybox/Panormic'");
                }
            }

            if (_cache.ContainsKey(entry) && _cache[entry].ContainsKey(cacheId))
            {
                extension.iblIndex = _cache[entry][cacheId];
                AddExtension(extensions, extension);
                return;
            }
            light.specIntensity = specIntensity;
            light.specMap = textureId;
            light.brdfLUT = entry.SaveTexture(brdfLUT, false).Id;

            globalExtension.lights.Add(light);

            if (!_cache.ContainsKey(entry))
            {
                _cache[entry] = new Dictionary<int, int>();
            }

            _cache[entry].Add(cacheId, globalExtension.lights.Count - 1);
            extension.iblIndex = _cache[entry][cacheId];
            extension.iblType = 2;
            AddExtension(extensions, extension);
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            return new Sein_imageBasedLightingExtension();
        }

        /*
         * https://zhuanlan.zhihu.com/p/51267461
         * 
         * sh[9]r, g, b]
         *
         * l00
         *
         * l1-1 l10 l11
         *
         * l2-2 l2-1 l20 l21 l22
         */
        private void SHToRightHand(float[][] shs)
        {
            // l0
            shs[0] = shs[0];

            for (int i = 0; i < 3; i += 1)
            {
                // l1
                shs[2][i] *= -1;

                // l2
                shs[5][i] *= -1;
                shs[7][i] *= -1;
            }
        }

        //https://forum.unity.com/threads/specular-convolution-when-calculating-mip-maps-for-cubemap-render-texture.617680/
        //private Cubemap GetSpecularCubeMap(Cubemap srcCubemap)
        //{
        //    var convolutionMaterial = new UnityEngine.Material(Shader.Find("Hidden/CubeBlur"));
        //    GL.PushMatrix();
        //    GL.LoadOrtho();
        //    var dstCubemap = new RenderTexture(srcCubemap.width, srcCubemap.height, 0, RenderTextureFormat.ARGBHalf);
        //    dstCubemap.dimension = UnityEngine.Rendering.TextureDimension.Cube;
        //    dstCubemap.volumeDepth = 6;
        //    dstCubemap.wrapMode = TextureWrapMode.Clamp;
        //    dstCubemap.filterMode = FilterMode.Trilinear;
        //    dstCubemap.isPowerOfTwo = true;
        //    dstCubemap.Create();
        //    // not support texture lod now
        //    var mip = 0;
        //    var dstMip = 0;
        //    var mipRes = srcCubemap.width;

        //    convolutionMaterial.SetTexture("_MainTex", srcCubemap);
        //    convolutionMaterial.SetFloat("_Texel", 1f / mipRes);
        //    convolutionMaterial.SetFloat("_Level", mip);

        //    convolutionMaterial.SetPass(0);

        //    // Positive X
        //    Graphics.SetRenderTarget(dstCubemap, dstMip, CubemapFace.PositiveX);
        //    GL.Begin(GL.QUADS);
        //    GL.TexCoord3(1, 1, 1);
        //    GL.Vertex3(0, 0, 1);
        //    GL.TexCoord3(1, -1, 1);
        //    GL.Vertex3(0, 1, 1);
        //    GL.TexCoord3(1, -1, -1);
        //    GL.Vertex3(1, 1, 1);
        //    GL.TexCoord3(1, 1, -1);
        //    GL.Vertex3(1, 0, 1);
        //    GL.End();

        //    // Negative X
        //    Graphics.SetRenderTarget(dstCubemap, dstMip, CubemapFace.NegativeX);
        //    GL.Begin(GL.QUADS);
        //    GL.TexCoord3(-1, 1, -1);
        //    GL.Vertex3(0, 0, 1);
        //    GL.TexCoord3(-1, -1, -1);
        //    GL.Vertex3(0, 1, 1);
        //    GL.TexCoord3(-1, -1, 1);
        //    GL.Vertex3(1, 1, 1);
        //    GL.TexCoord3(-1, 1, 1);
        //    GL.Vertex3(1, 0, 1);
        //    GL.End();

        //    // Positive Y
        //    Graphics.SetRenderTarget(dstCubemap, dstMip, CubemapFace.PositiveY);
        //    GL.Begin(GL.QUADS);
        //    GL.TexCoord3(-1, 1, -1);
        //    GL.Vertex3(0, 0, 1);
        //    GL.TexCoord3(-1, 1, 1);
        //    GL.Vertex3(0, 1, 1);
        //    GL.TexCoord3(1, 1, 1);
        //    GL.Vertex3(1, 1, 1);
        //    GL.TexCoord3(1, 1, -1);
        //    GL.Vertex3(1, 0, 1);
        //    GL.End();

        //    // Negative Y
        //    Graphics.SetRenderTarget(dstCubemap, dstMip, CubemapFace.NegativeY);
        //    GL.Begin(GL.QUADS);
        //    GL.TexCoord3(-1, -1, 1);
        //    GL.Vertex3(0, 0, 1);
        //    GL.TexCoord3(-1, -1, -1);
        //    GL.Vertex3(0, 1, 1);
        //    GL.TexCoord3(1, -1, -1);
        //    GL.Vertex3(1, 1, 1);
        //    GL.TexCoord3(1, -1, 1);
        //    GL.Vertex3(1, 0, 1);
        //    GL.End();

        //    // Positive Z
        //    Graphics.SetRenderTarget(dstCubemap, dstMip, CubemapFace.PositiveZ);
        //    GL.Begin(GL.QUADS);
        //    GL.TexCoord3(1, 1, -1);
        //    GL.Vertex3(0, 0, 1);
        //    GL.TexCoord3(1, -1, -1);
        //    GL.Vertex3(0, 1, 1);
        //    GL.TexCoord3(-1, -1, -1);
        //    GL.Vertex3(1, 1, 1);
        //    GL.TexCoord3(-1, 1, -1);
        //    GL.Vertex3(1, 0, 1);
        //    GL.End();

        //    // Negative Z
        //    Graphics.SetRenderTarget(dstCubemap, dstMip, CubemapFace.NegativeZ);
        //    GL.Begin(GL.QUADS);
        //    GL.TexCoord3(-1, 1, 1);
        //    GL.Vertex3(0, 0, 1);
        //    GL.TexCoord3(-1, -1, 1);
        //    GL.Vertex3(0, 1, 1);
        //    GL.TexCoord3(1, -1, 1);
        //    GL.Vertex3(1, 1, 1);
        //    GL.TexCoord3(1, 1, 1);
        //    GL.Vertex3(1, 0, 1);
        //    GL.End();

        //    GL.PopMatrix();

        //    Graphics.SetRenderTarget(null);

        //    return dstCubemap;
        //}

        private void DeleteTempMap(Cubemap map)
        {
            AssetDatabase.DeleteAsset(AssetDatabase.GetAssetPath(map));
        }
    }
}
