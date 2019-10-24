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

        private Dictionary<Cubemap, int> _cache = new Dictionary<Cubemap, int>();

        public override void BeforeExport()
        {
            var brdfPath = "Assets/SeinJSUnityToolkit/Shaders/brdfLUT.jpg";
            var e = File.Exists(brdfPath);
            brdfLUT = AssetDatabase.LoadAssetAtPath<Texture2D>(brdfPath);
        }

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null)
        {
            if (!ExporterSettings.Lighting.reflection)
            {
                return;
            }

            var mat = component as UnityEngine.Material;

            if (RenderSettings.ambientMode != UnityEngine.Rendering.AmbientMode.Skybox)
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
                globalExtension = (Sein_imageBasedLightingExtension)extensions["KHR_lights_punctual"];
            }

            var extension = new Sein_imageBasedLightingExtension();

            Cubemap specMap = null;
            //ReflectionProbe
            float specIntensity = RenderSettings.reflectionIntensity;
            if (RenderSettings.defaultReflectionMode == UnityEngine.Rendering.DefaultReflectionMode.Custom)
            {
                specMap = RenderSettings.customReflection;
            }
            else
            {
                //todo: support skybox cubemap
            }

            if (_cache.ContainsKey(specMap))
            {
                extension.iblIndex = _cache[specMap];
                AddExtension(extensions, extension);
                return;
            }

            var light = new Sein_imageBasedLightingExtension.Light();

            var coefficients = new float[9][];
            UnityEngine.Rendering.SphericalHarmonicsL2 shs;
            LightProbes.GetInterpolatedProbe(new UnityEngine.Vector3(), null, out shs);
            float diffuseIntensity = RenderSettings.ambientIntensity;
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

            light.shCoefficients = coefficients;
            light.diffuseIntensity = diffuseIntensity;
            light.brdfLUT = entry.SaveTexture(brdfLUT, false).Id;
            light.specIntensity = specIntensity;
            light.specMapFaces = new int[6];

            string origAssetPath = AssetDatabase.GetAssetPath(specMap);
            string ext = Path.GetExtension(origAssetPath);
            var blurredSpecMap = GetSpecularCubeMap(specMap);
            for (var i = 0; i < 6; i += 1)
            {
                var tex2d = new Texture2D(blurredSpecMap.width, blurredSpecMap.height, TextureFormat.RGBAHalf, false);
                UnityEngine.Color[] colors = null;
                switch (i)
                {
                    case 0:
                        colors = blurredSpecMap.GetPixels(CubemapFace.PositiveX);
                        break;
                    case 1:
                        colors = blurredSpecMap.GetPixels(CubemapFace.NegativeX);
                        break;
                    case 2:
                        colors = blurredSpecMap.GetPixels(CubemapFace.PositiveY);
                        break;
                    case 3:
                        colors = blurredSpecMap.GetPixels(CubemapFace.NegativeY);
                        break;
                    case 4:
                        colors = blurredSpecMap.GetPixels(CubemapFace.PositiveZ);
                        break;
                    case 5:
                        colors = blurredSpecMap.GetPixels(CubemapFace.NegativeZ);
                        break;
                }
                tex2d.SetPixels(colors);
                tex2d.Apply();
                light.specMapFaces[i] = entry.SaveImageHDR(tex2d, ExporterSettings.Lighting.reflectionType, ExporterSettings.Lighting.reflectionSize, origAssetPath.Replace(ext, "-" + i + ext)).Id;
            }
            DeleteTempMap(blurredSpecMap);

            globalExtension.lights.Add(light);

            extension.iblIndex = globalExtension.lights.Count - 1;
            if (mat.HasProperty("envReflection"))
            {
                extension.iblType = mat.GetInt("envReflection");
            }
            else
            {
                extension.iblType = 2;
            }
            AddExtension(extensions, extension);
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            return new Sein_imageBasedLightingExtension();
        }

        // https://forum.unity.com/threads/specular-convolution-when-calculating-mip-maps-for-cubemap-render-texture.617680/
        private Cubemap GetSpecularCubeMap(Cubemap srcCubemap)
        {
            var convolutionMaterial = new UnityEngine.Material(Shader.Find("Hidden/CubeBlur"));
            GL.PushMatrix();
            GL.LoadOrtho();
            RenderTexture dstCubemap = new RenderTexture(srcCubemap.width, srcCubemap.height, 0, RenderTextureFormat.ARGBHalf);
            dstCubemap.dimension = UnityEngine.Rendering.TextureDimension.Cube;
            dstCubemap.volumeDepth = 6;
            dstCubemap.wrapMode = TextureWrapMode.Clamp;
            dstCubemap.filterMode = FilterMode.Trilinear;
            dstCubemap.isPowerOfTwo = true;
            dstCubemap.Create();
            var mip = .2f;
            var dstMip = 0;
            var mipRes = srcCubemap.width;

            convolutionMaterial.SetTexture("_MainTex", srcCubemap);
            convolutionMaterial.SetFloat("_Texel", 1f / mipRes);
            convolutionMaterial.SetFloat("_Level", mip);

            convolutionMaterial.SetPass(0);

            Texture2D tex2d = new Texture2D(srcCubemap.width * 6, srcCubemap.height, TextureFormat.RGBAHalf, false);

            // Positive X
            Graphics.SetRenderTarget(dstCubemap, dstMip, CubemapFace.PositiveX);
            GL.Begin(GL.QUADS);
            GL.TexCoord3(1, 1, 1);
            GL.Vertex3(0, 0, 1);
            GL.TexCoord3(1, -1, 1);
            GL.Vertex3(0, 1, 1);
            GL.TexCoord3(1, -1, -1);
            GL.Vertex3(1, 1, 1);
            GL.TexCoord3(1, 1, -1);
            GL.Vertex3(1, 0, 1);
            GL.End();
            tex2d.ReadPixels(new Rect(0, 0, srcCubemap.width, srcCubemap.height), srcCubemap.width * 0, 0);

            // Negative X
            Graphics.SetRenderTarget(dstCubemap, dstMip, CubemapFace.NegativeX);
            GL.Begin(GL.QUADS);
            GL.TexCoord3(-1, 1, -1);
            GL.Vertex3(0, 0, 1);
            GL.TexCoord3(-1, -1, -1);
            GL.Vertex3(0, 1, 1);
            GL.TexCoord3(-1, -1, 1);
            GL.Vertex3(1, 1, 1);
            GL.TexCoord3(-1, 1, 1);
            GL.Vertex3(1, 0, 1);
            GL.End();
            tex2d.ReadPixels(new Rect(0, 0, srcCubemap.width, srcCubemap.height), srcCubemap.width * 1, 0);

            // Positive Y
            Graphics.SetRenderTarget(dstCubemap, dstMip, CubemapFace.PositiveY);
            GL.Begin(GL.QUADS);
            GL.TexCoord3(-1, 1, -1);
            GL.Vertex3(0, 0, 1);
            GL.TexCoord3(-1, 1, 1);
            GL.Vertex3(0, 1, 1);
            GL.TexCoord3(1, 1, 1);
            GL.Vertex3(1, 1, 1);
            GL.TexCoord3(1, 1, -1);
            GL.Vertex3(1, 0, 1);
            GL.End();
            tex2d.ReadPixels(new Rect(0, 0, srcCubemap.width, srcCubemap.height), srcCubemap.width * 2, 0);

            // Negative Y
            Graphics.SetRenderTarget(dstCubemap, dstMip, CubemapFace.NegativeY);
            GL.Begin(GL.QUADS);
            GL.TexCoord3(-1, -1, 1);
            GL.Vertex3(0, 0, 1);
            GL.TexCoord3(-1, -1, -1);
            GL.Vertex3(0, 1, 1);
            GL.TexCoord3(1, -1, -1);
            GL.Vertex3(1, 1, 1);
            GL.TexCoord3(1, -1, 1);
            GL.Vertex3(1, 0, 1);
            GL.End();
            tex2d.ReadPixels(new Rect(0, 0, srcCubemap.width, srcCubemap.height), srcCubemap.width * 3, 0);

            // Positive Z
            Graphics.SetRenderTarget(dstCubemap, dstMip, CubemapFace.PositiveZ);
            GL.Begin(GL.QUADS);
            GL.TexCoord3(-1, 1, 1);
            GL.Vertex3(0, 0, 1);
            GL.TexCoord3(-1, -1, 1);
            GL.Vertex3(0, 1, 1);
            GL.TexCoord3(1, -1, 1);
            GL.Vertex3(1, 1, 1);
            GL.TexCoord3(1, 1, 1);
            GL.Vertex3(1, 0, 1);
            GL.End();
            tex2d.ReadPixels(new Rect(0, 0, srcCubemap.width, srcCubemap.height), srcCubemap.width * 4, 0);

            // Negative Z
            Graphics.SetRenderTarget(dstCubemap, dstMip, CubemapFace.NegativeZ);
            GL.Begin(GL.QUADS);
            GL.TexCoord3(1, 1, -1);
            GL.Vertex3(0, 0, 1);
            GL.TexCoord3(1, -1, -1);
            GL.Vertex3(0, 1, 1);
            GL.TexCoord3(-1, -1, -1);
            GL.Vertex3(1, 1, 1);
            GL.TexCoord3(-1, 1, -1);
            GL.Vertex3(1, 0, 1);
            GL.End();
            tex2d.ReadPixels(new Rect(0, 0, srcCubemap.width, srcCubemap.height), srcCubemap.width * 5, 0);

            GL.PopMatrix();

            tex2d.Apply();

            for (int x = 0; x < tex2d.width; x++)
            {
                for (int y1 = 0, y2 = tex2d.height - 1; y1 < y2; y1++, y2--)
                {
                    var t1 = tex2d.GetPixel(x, y1);
                    tex2d.SetPixel(x, y1, tex2d.GetPixel(x, y2));
                    tex2d.SetPixel(x, y2, t1);
                }
            }

            UnityEngine.Object.DestroyImmediate(dstCubemap);

            var path = "Assets/temp" + DateTime.Now.ToBinary() + ".exr";
            File.WriteAllBytes(path, tex2d.EncodeToEXR());
            AssetDatabase.Refresh();
            TextureImporter im = AssetImporter.GetAtPath(path) as TextureImporter;
            im.isReadable = true;
            im.textureShape = TextureImporterShape.TextureCube;
            im.SaveAndReimport();

            return AssetDatabase.LoadAssetAtPath<Cubemap>(path);
        }

        private void DeleteTempMap(Cubemap map)
        {
            AssetDatabase.DeleteAsset(AssetDatabase.GetAssetPath(map));
        }
    }
}
