using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
using System.IO;

namespace SeinJS
{
    public class GLTFTextureUtils
    {
        private static string _flipTexture = "GLTF/FlipTexture";
        private static string _hdr2RGBD = "GLTF/HDR2RGBD";
        private static string _splitCube = "GLTF/SplitCube";
        private static string _packOcclusionMetalRough = "GLTF/PackOcclusionMetalRough";
        private static string _convertBump = "GLTF/BumpToNormal";
        private static string _generateMipmaps = "GLTF/GenerateMipmaps";
        public static bool _useOriginalImages = true;

        public static void setUseOriginalImage(bool useOriginal)
        {
            _useOriginalImages = useOriginal;
        }

        public static void setSRGB(bool useSRGB)
        {
            GL.sRGBWrite = useSRGB;
        }

        public static string writeTextureOnDisk(Texture2D texture, string outputPath, bool updateExtension = false)
        {
            string finalOutputPath = outputPath;
            byte[] finalImageData = Path.GetExtension(finalOutputPath) == ".jpg" ? texture.EncodeToJPG() : texture.EncodeToPNG();

            File.WriteAllBytes(finalOutputPath, finalImageData);
            AssetDatabase.Refresh();

            return finalOutputPath;
        }

        // Export
        public static Texture2D bumpToNormal(Texture2D texture)
        {
            Material convertBump = new Material(Shader.Find(_convertBump));
            convertBump.SetTexture("_BumpMap", texture);
            return processTextureMaterial(texture, convertBump);
        }

        public static bool isNormalMapFromGrayScale(ref Texture2D texture)
        {
            TextureImporter im = AssetImporter.GetAtPath(AssetDatabase.GetAssetPath(texture)) as TextureImporter;
            if (im == null)
                return false;

            return im.convertToNormalmap;
        }

        public static Texture2D packOcclusionMetalRough(Texture2D metallic, Texture2D roughness, Texture2D occlusion, string name   )
        {
            if (metallic == null && roughness == null && occlusion == null)
            {
                return null;
            }

            bool srgb = GL.sRGBWrite;
            GL.sRGBWrite = false;

            Material packMaterial = new Material(Shader.Find(_packOcclusionMetalRough));
            packMaterial.SetTexture("_MetallicMap", metallic);
            Texture2D tex = metallic;

            if (roughness != null)
            {
               tex = tex.width > roughness.width ? tex : roughness;
                packMaterial.SetTexture("_RoughnessMap", roughness);
            }

            if (occlusion != null) {
                tex = tex.width > occlusion.width ? tex : occlusion;
                packMaterial.SetTexture("_OcclusionMap", occlusion);
            }

            Texture2D result = processTextureMaterial(tex, packMaterial, false, name);
            GL.sRGBWrite = srgb;
            return result;
        }

        // CORE
        private static Texture2D processTextureMaterial(Texture2D texture, Material blitMaterial, bool isRGB = false, string name = null)
        {
            var exportTexture = new Texture2D(texture.width, texture.height, (isRGB ? TextureFormat.RGB24 : TextureFormat.ARGB32), false);
            exportTexture.name = name == null ? texture.name : name;

            var renderTexture = RenderTexture.GetTemporary(texture.width, texture.height, 32, RenderTextureFormat.ARGB32);
            Graphics.Blit(exportTexture, renderTexture, blitMaterial);
            RenderTexture.active = renderTexture;

            exportTexture.ReadPixels(new Rect(0, 0, renderTexture.width, renderTexture.height), 0, 0);
            exportTexture.Apply();

            RenderTexture.ReleaseTemporary(renderTexture);

            return exportTexture;
        }

        // Normal map should be exported with srgb true
        public static Texture2D handleNormalMap(Texture2D input)
        {
            TextureImporter im = AssetImporter.GetAtPath(AssetDatabase.GetAssetPath(input)) as TextureImporter;
            if (AssetDatabase.GetAssetPath(input).Length == 0 || im == null || im.convertToNormalmap)
            {
                Debug.Log("Convert bump to normal " + input.name);
                return bumpToNormal(input);
            }
            else
            {
                return getTexture(input);
            }
        }

        private static Texture2D getTexture(Texture2D texture)
        {
            Texture2D temp = new Texture2D(4, 4);
            temp.name = texture.name;
            if (_useOriginalImages)
            {
                if (AssetDatabase.GetAssetPath(texture).Length > 0)
                {
                    temp.LoadImage(File.ReadAllBytes(AssetDatabase.GetAssetPath(texture)));
                    temp.name = texture.name;
                }
                else
                {
                    temp = texture;
                    Debug.Log("Texture asset is not serialized. Cannot use uncompressed version for " + texture.name);
                }
            }
            else
            {
                temp = texture;
            }

            return temp;
        }

        public static Texture2D flipTexture(Texture2D texture)
        {
            Material flipMaterial = new Material(Shader.Find(_flipTexture));
            Texture2D temp = texture;

            flipMaterial.SetTexture("_TextureToFlip", temp);
            return processTextureMaterial(temp, flipMaterial, useJPGTexture(texture));
        }

        public static Texture2D HDR2RGBD(Texture2D texture, bool flipY = true)
        {
            Material material = new Material(Shader.Find(_hdr2RGBD));

            material.SetTexture("_HDRTexture", texture);
            material.SetInt("_FlipY", flipY ? 1 : 0);
            return processTextureMaterial(texture, material, useJPGTexture(texture));
        }

        public static Texture2D generateMipmaps(Texture2D texture)
        {
            Material material = new Material(Shader.Find(_generateMipmaps));
            material.SetTexture("_HDRTexture", texture);

            var exportTexture = new Texture2D(texture.width, texture.width, TextureFormat.RGBAFloat, false);
            exportTexture.name = texture.name;

            var renderTexture = RenderTexture.GetTemporary(texture.width, texture.width, 32, RenderTextureFormat.ARGBFloat);
            Graphics.Blit(exportTexture, renderTexture, material);
            RenderTexture.active = renderTexture;

            exportTexture.ReadPixels(new Rect(0, 0, renderTexture.width, renderTexture.height), 0, 0);
            exportTexture.Apply();

            RenderTexture.ReleaseTemporary(renderTexture);

            return exportTexture;
        }

        public static bool useJPGTexture(Texture2D texture)
        {
            switch (texture.format)
            {
                case TextureFormat.RGB24:
                case TextureFormat.DXT1:
                    return true;
                default:
                    return false;
            }
        }
    }
}
