/**
 * @File   : ExportorUtils.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/09/09 0:00:00PM
 */
using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;
using GLTF.Schema;
using System.IO;
using System;
using System.Linq;
using Newtonsoft.Json.Linq;
using System.Text.RegularExpressions;

namespace SeinJS
{
    public class ExporterUtils
    {
        private static GameObject _tempGO = null;

        public static Regex rgxPath = new Regex("[^a-zA-Z0-9-_./]");
        public static string CleanPath(string s)
        {
            return rgxPath.Replace(s, "").ToLower();
        }

        public static Vector4[] BoneWeightToBoneVec4(BoneWeight[] bw)
        {
            Vector4[] bones = new Vector4[bw.Length];
            for (int i = 0; i < bw.Length; ++i)
            {
                bones[i] = new Vector4(bw[i].boneIndex0, bw[i].boneIndex1, bw[i].boneIndex2, bw[i].boneIndex3);
            }

            return bones;
        }

        public static Vector4[] BoneWeightToWeightVec4(BoneWeight[] bw)
        {
            Vector4[] weights = new Vector4[bw.Length];
            for (int i = 0; i < bw.Length; ++i)
            {
                weights[i] = new Vector4(bw[i].weight0, bw[i].weight1, bw[i].weight2, bw[i].weight3);
            }

            return weights;
        }

        public static Accessor PackToBuffer<DataType>(
            byte[] buffer, DataType[] data,
            GLTFComponentType componentType, int offset, int stride
        )
        {
            var accessor = new Accessor();
            accessor.ByteOffset = offset;
            accessor.ComponentType = componentType;

            int count = 0;
            int index = 0;
            float[] max = null;
            float[] min = null;

            foreach (var item in data)
            {
                var bytes = GetDataToBuffer(item, componentType, ref max, ref min, ref accessor.Type);
                int byteOffset = offset + stride * index;

                bytes.CopyTo(buffer, byteOffset);
                count += bytes.Length;
            }

            accessor.Count = count;
            accessor.Max = max.ToList().ConvertAll(x => (double)x);
            accessor.Min = min.ToList().ConvertAll(x => (double)x);

            return accessor;
        }

        public static Accessor PackToBuffer<DataType>(
            MemoryStream stream, DataType[] data,
            GLTFComponentType componentType
        )
        {
            var accessor = new Accessor();
            accessor.ByteOffset = (int)stream.Length;
            accessor.ComponentType = componentType;

            int count = 0;
            float[] max = null;
            float[] min = null;

            foreach (var item in data)
            {
                var bytes = GetDataToBuffer(item, componentType, ref max, ref min, ref accessor.Type);

                stream.Write(bytes, 0, bytes.Length);
                count += bytes.Length;
            }

            accessor.Count = count;
            accessor.Max = max.ToList().ConvertAll(x => (double)x);
            accessor.Min = min.ToList().ConvertAll(x => (double)x);

            return accessor;
        }

        private static byte[] GetDataToBuffer<DataType>(
            DataType value, GLTFComponentType componentType,
            ref float[] max, ref float[] min, ref GLTFAccessorAttributeType type
        )
        {
            /**
             @todo: support int uint short byte ushort...
             */
            if (typeof(DataType) == typeof(float))
            {
                var v = (float)Convert.ChangeType(value, typeof(float));
                var mx = (float)Convert.ChangeType(value, typeof(float));
                var mn = (float)Convert.ChangeType(value, typeof(float));

                type = GLTFAccessorAttributeType.SCALAR;
                mx = mx > v ? mx : v;
                mn = mn < v ? mn : v;

                return BitConverter.GetBytes(v);
            }

            float[] array = null;

            if (typeof(DataType) == typeof(Vector2))
            {
                type = GLTFAccessorAttributeType.VEC2;
                var v = (Vector2)Convert.ChangeType(value, typeof(Vector2));
                array = new float[] { v.x, v.y };
            }
            else if (typeof(DataType) == typeof(Vector3))
            {
                type = GLTFAccessorAttributeType.VEC3;
                var v = (Vector3)Convert.ChangeType(value, typeof(Vector3));
                array = new float[] { v.x, v.y, v.z };
            }
            else if (typeof(DataType) == typeof(Vector4))
            {
                type = GLTFAccessorAttributeType.VEC4;
                var v = (Vector4)Convert.ChangeType(value, typeof(Vector4));
                array = new float[] { v.x, v.y, v.z, v.w };
            }
            else
            {
                throw new Exception("Only support packing float, Vector2, Vector3, Vector4 now !");
            }

            if (max == null)
            {
                max = (float[])array.Clone();
            }

            if (min == null)
            {
                min = (float[])array.Clone();
            }

            for (int i = 0; i < array.Length; i += 1)
            {
                max[i] = max[i] > array[i] ? max[i] : array[i];
                min[i] = min[i] < array[i] ? min[i] : array[i];
            }

            return GetBytes(array, componentType);
        }

        private static byte[] GetBytes(float[] array, GLTFComponentType componentType)
        {
            int size = 0;
            Array dArray = null;

            switch (componentType)
            {
                case GLTFComponentType.Byte:
                case GLTFComponentType.UnsignedByte:
                    size = 1;
                    dArray = Array.ConvertAll(array, item => (byte)item);
                    break;
                case GLTFComponentType.Short:
                    size = 2;
                    dArray = Array.ConvertAll(array, item => (short)item);
                    break;
                case GLTFComponentType.UnsignedShort:
                    size = 2;
                    dArray = Array.ConvertAll(array, item => (ushort)item);
                    break;
                case GLTFComponentType.Float:
                    size = 4;
                    dArray = array;
                    break;
                case GLTFComponentType.UnsignedInt:
                    size = 4;
                    dArray = Array.ConvertAll(array, item => (uint)item);
                    break;
            }

            var bytes = new byte[size * array.Length];
            System.Buffer.BlockCopy(bytes, 0, array, 0, bytes.Length);

            return bytes;
        }

        public static GLTF.Schema.Material ConvertMaterial(UnityEngine.Material material, ExporterEntry entry)
        {
            if (material.shader.name.Contains("Standard") || material.shader.name.Contains("Autodesk Interactive"))
            {
                throw new Exception("Toolkit doesn't support Unity Standard Material anymore, please use converter to convert them to 'Sein/PBR', check here: http://seinjs.com/cn/guide/material-sein");
            }

            if (material.shader.name == "Sein/PBR")
            {
                return ConvertSeinPBRMaterial(material, entry);
            }

            if (material.shader.name.Contains("Sein/"))
            {
                return ConvertSeinCustomMaterial(material, entry);
            }

            //return ConvertKHRWebGLMaterial(material, entry);
            throw new Exception("Only support Sein/PBR or Sein/XXX(CustomMaterial) now !");
        }

        private static GLTF.Schema.Material ConvertSeinPBRMaterial(UnityEngine.Material mat, ExporterEntry entry)
        {
            var material = new GLTF.Schema.Material();

            bool isMetal = mat.GetInt("workflow") == 0;
            bool isUnlit = mat.GetInt("unlit") == 1;
            if (!isMetal)
            {
                // special
                entry.AddExtension("KHR_materials_pbrSpecularGlossiness");
            }
            bool hasTransparency = ProcessTransparency(mat, material);

            if (isUnlit || isMetal)
            {
                if (mat.GetTexture("_baseColorMap") != null)
                {
                    var id = entry.SaveTexture((Texture2D)mat.GetTexture("_baseColorMap"), hasTransparency);
                    material.PbrMetallicRoughness.BaseColorTexture = new TextureInfo { Index = id };
                }

                if (mat.GetTexture("_baseColor") != null)
                {
                    Color c = mat.GetColor("_baseColor");
                    material.PbrMetallicRoughness.BaseColorFactor = new GLTF.Math.Color(c.r, c.g, c.b, c.a);
                }
            }

            if (isUnlit)
            {
                ExtensionManager.Serialize(KHR_materials_unlitExtensionFactory.EXTENSION_NAME, entry, material.Extensions);
            }
            else if (isMetal)
            {
                bool hasPBRMap = mat.GetTexture("_metallicMap") != null;
                if (hasPBRMap)
                {
                    Texture2D metallicTexture = (Texture2D)mat.GetTexture("_metallicMap");
                    Texture2D roughnessTexture = (Texture2D)mat.GetTexture("_roughnessMap");
                    Texture2D occlusion = (Texture2D)mat.GetTexture("_occlusionMap");

                    var metalRoughTextureAo = CreateOcclusionMetallicRoughnessTexture(
                        ref metallicTexture, ref roughnessTexture, ref occlusion,
                        EImageChannel.B, EImageChannel.G, EImageChannel.R, EImageChannel.G
                    );
                    var id = entry.SaveTexture(metalRoughTextureAo, hasTransparency);
                    material.PbrMetallicRoughness.MetallicRoughnessTexture = new TextureInfo { Index = id };

                    if (occlusion != null)
                    {
                        material.OcclusionTexture = new OcclusionTextureInfo
                        {
                            Index = id,
                            Strength = mat.GetFloat("_occlusionStrength")
                        };
                    }
                }

                material.PbrMetallicRoughness.MetallicFactor = hasPBRMap ? 1.0f : mat.GetFloat("_metallic");
                material.PbrMetallicRoughness.RoughnessFactor = mat.GetFloat("_roughness");
            }
            else
            {
                TextureInfo specGlossMap = null;
                TextureInfo diffuseMap = null;
                GLTF.Math.Color diffuseColor = new GLTF.Math.Color();

                if (mat.GetTexture("_baseColorMap") != null)
                {
                    var id = entry.SaveTexture((Texture2D)mat.GetTexture("_baseColorMap"), hasTransparency);
                    diffuseMap = new TextureInfo { Index = id };
                }

                if (mat.GetTexture("_baseColor") != null)
                {
                    Color c = mat.GetColor("_baseColor");
                    diffuseColor = new GLTF.Math.Color(c.r, c.g, c.b, c.a);
                }

                bool hasPBRMap = mat.GetTexture("_specularGlossinessMap") != null;

                if (hasPBRMap)
                {
                    specGlossMap = new TextureInfo { Index = entry.SaveTexture((Texture2D)mat.GetTexture("_specularGlossinessMap"), true) };
                }

                var specularFactor = hasPBRMap ? Color.white : mat.GetColor("_specular");
                var glossinessFactor = hasPBRMap ? 1.0f : mat.GetFloat("_glossiness");

                material.Extensions.Add(
                    "KHR_materials_pbrSpecularGlossiness",
                    new KHR_materials_pbrSpecularGlossinessExtension(
                        diffuseColor, diffuseMap,
                        new GLTF.Math.Vector3(specularFactor.r, specularFactor.g, specularFactor.b),
                        glossinessFactor, specGlossMap
                    )
                );

                Texture2D occlusion = (Texture2D)mat.GetTexture("_occlusionMap");
                if (occlusion != null)
                {
                    material.OcclusionTexture = new OcclusionTextureInfo
                    {
                        Index = entry.SaveTexture((Texture2D)mat.GetTexture("_occlusionMap"), false),
                        Strength = mat.GetFloat("_occlusionStrength")
                    };
                }
            }

            if (mat.GetTexture("_normalMap") != null)
            {
                material.NormalTexture = new NormalTextureInfo
                {
                    Index = entry.SaveTexture((Texture2D)mat.GetTexture("_normalMap"), false),
                };
            }

            if (mat.GetTexture("_emissionMap") != null)
            {
                material.EmissiveTexture = new TextureInfo
                {
                    Index = entry.SaveTexture((Texture2D)mat.GetTexture("_emissionMap"), false),
                };
            }

            var emissive = mat.GetColor("_emission");
            if (!emissive.Equals(new Color(0, 0, 0)))
            {
                material.EmissiveFactor = new GLTF.Math.Color(emissive.r, emissive.g, emissive.b, emissive.a);
            }

            /*
             * @todo: reflection
             */
            if (mat.GetInt("envReflection") != (int)SeinPBRShaderGUI.EnvReflection.Off)
            {
                //createReflection(mat, ref material);
            }

            return material;
        }

        private static GLTF.Schema.Material ConvertSeinCustomMaterial(UnityEngine.Material mat, ExporterEntry entry)
        {
            if (_tempGO == null)
            {
                _tempGO = new GameObject();
            }

            var customMaterial = _tempGO.AddComponent<SeinCustomMaterial>();
            var className = mat.shader.name.Replace("Sein/", "");
            if (!className.Contains("Material"))
            {
                className += "Material";
            }
            customMaterial.className = className;
            customMaterial.renderOrder = mat.renderQueue;
            var floatArray = new List<SeinMaterialUniformFloat>();
            var vector4Array = new List<SeinMaterialUniformFloatVec4>();
            var textureArray = new List<SeinMaterialUniformTexture>();

            for (int i = 0; i < ShaderUtil.GetPropertyCount(mat.shader); i += 1)
            {
                var propType = ShaderUtil.GetPropertyType(mat.shader, i);
                var propName = ShaderUtil.GetPropertyName(mat.shader, i);

                if (propName == "cloneForInst")
                {
                    customMaterial.cloneForInst = mat.GetInt("cloneForInst") != 0;
                    continue;
                }

                if (ShaderUtil.IsShaderPropertyHidden(mat.shader, i))
                {
                    continue;
                }

                if (propName.Substring(0, 1) == "_")
                {
                    propName = propName.Substring(1);
                }

                switch (propType)
                {
                    case ShaderUtil.ShaderPropertyType.Float:
                    case ShaderUtil.ShaderPropertyType.Range:
                        floatArray.Add(new SeinMaterialUniformFloat { name = propName, value = mat.GetFloat(propName) });
                        break;
                    case ShaderUtil.ShaderPropertyType.Color:
                        vector4Array.Add(new SeinMaterialUniformFloatVec4 { name = propName, value = mat.GetColor(propName) });
                        break;
                    case ShaderUtil.ShaderPropertyType.Vector:
                        vector4Array.Add(new SeinMaterialUniformFloatVec4 { name = propName, value = mat.GetVector(propName) });
                        break;
                    case ShaderUtil.ShaderPropertyType.TexEnv:
                        if (mat.GetTexture(propName) != null)
                        {
                            textureArray.Add(new SeinMaterialUniformTexture { name = propName, value = (Texture2D)mat.GetTexture(propName) });
                        }
                        break;
                }

                customMaterial.uniformsFloat = floatArray.ToArray();
                customMaterial.uniformsFloatVec4 = vector4Array.ToArray();
                customMaterial.uniformsTexture = textureArray.ToArray();
            }

            return ConvertMaterial(customMaterial, entry);
        }

        //private static GLTF.Schema.Material ConvertKHRWebGLMaterial(UnityEngine.Material material, ExportorEntry entry)
        //{

        //}

        public static GLTF.Schema.Material ConvertMaterial(SeinCustomMaterial mat, ExporterEntry entry)
        {
            var material = new GLTF.Schema.Material();

            if (mat.uniformsTexture.Length != 0)
            {
                foreach (var uniform in mat.uniformsTexture)
                {
                    uniform.id = entry.SaveTexture(uniform.value, mat.transparent);
                }
            }

            if (mat.uniformsCubeTexture.Length != 0)
            {
                foreach (var uniform in mat.uniformsCubeTexture)
                {
                    // todo: support cubemap
                    //int diffuseTextureIndex = processTexture(uniform.value, hasTransparency ? IMAGETYPE.RGBA : IMAGETYPE.RGBA_OPAQUE);
                    //uniform.index = diffuseTextureIndex;
                    //uniform.texCoord = 0;
                }
            }

            ExtensionManager.Serialize(Sein_customMaterialExtensionFactory.EXTENSION_NAME, entry, material.Extensions, mat);
            return material;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <returns>{ exportPath,  pathInGltfFile }</returns>
        public static string[] GetAssetOutPath(UnityEngine.Object assetObject, string format = null)
        {
            string assetPath = AssetDatabase.GetAssetPath(assetObject);
            string pathInArchive = ExporterUtils.CleanPath(Path.GetDirectoryName(assetPath).Replace("Assets/Resources/", "").Replace("Assets/", ""));
            string exportDir = ExporterSettings.Export.GetExportPath(pathInArchive);

            if (!Directory.Exists(exportDir))
            {
                Directory.CreateDirectory(exportDir);
            }

            string outputFilename = "";
            if (format == null)
            {
                outputFilename = Path.GetFileName(assetPath);
            }
            else
            {
                outputFilename = Path.GetFileNameWithoutExtension(assetPath) + format;
            }

            outputFilename = ExporterUtils.CleanPath(outputFilename);

            string exportPath = exportDir + "/" + outputFilename;
            string pathInGltfFile = pathInArchive + "/" + outputFilename;

            return new string[] { exportPath, pathInGltfFile };
        }

        private static bool ProcessTransparency(UnityEngine.Material mat, GLTF.Schema.Material material)
        {
            if (!mat.HasProperty("_Mode"))
            {
                return false;
            }

            switch ((int)mat.GetFloat("_Mode"))
            {
                // Opaque
                case 0:
                    material.AlphaMode = AlphaMode.OPAQUE;
                    return false;
                // Cutout
                case 1:
                    material.AlphaMode = AlphaMode.MASK;
                    material.AlphaCutoff = mat.GetFloat("_Cutoff");
                    break;
                // Transparent
                case 2:
                case 3:
                    material.AlphaMode = AlphaMode.BLEND;
                    break;
            }

            return true;
        }

        private static Texture2D CreateOcclusionMetallicRoughnessTexture(
            ref Texture2D metallic,
            ref Texture2D roughness,
            ref Texture2D occlusion,
            EImageChannel metallicChannel = EImageChannel.R,
            EImageChannel roughnessChannel = EImageChannel.R,
            EImageChannel occlusionChannel = EImageChannel.R,
            EImageChannel roughnessDist = EImageChannel.G_INVERT
        )
        {
            string texName = metallic.name + "_orm";
            var textureM = metallic;
            var textureR = roughness;
            var textureAO = occlusion;

            string id = "";
            if (metallic)
            {
                id += metallic.GetInstanceID();
            }
            if (roughness)
            {
                id += roughness.GetInstanceID();
            }
            if (occlusion)
            {
                id += occlusion.GetInstanceID();
            }

            if (ExporterEntry.composedTextures[id])
            {
                return ExporterEntry.composedTextures[id];
            }

            int width = textureM.width;
            int height = textureM.height;

            if (textureR != null)
            {
                width = textureR.width > width ? textureR.width : width;
                height = textureR.height > height ? textureR.height : height;
            }

            if (textureAO != null)
            {
                width = textureAO.width > width ? textureAO.width : width;
                height = textureAO.height > height ? textureAO.height : height;
            }

            if (textureM.width != width || textureM.height != height)
            {
                CloneAndResize(ref metallic, out textureM, width, height);
            }

            if (textureR != null && (textureR.width != width || textureR.height != height))
            {
                CloneAndResize(ref roughness, out textureR, width, height);
            }

            if (textureAO != null && (textureAO.width != width || textureAO.height != height))
            {
                CloneAndResize(ref occlusion, out textureAO, width, height);
            }

            // Let's consider that the three textures have the same resolution
            Color[] outputColors = new Color[width * height];
            for (int i = 0; i < outputColors.Length; ++i)
            {
                outputColors[i] = new Color(0.0f, 0.0f, 0.0f);
            }

            SetTextureChannel(ref textureM, ref outputColors, EImageChannel.B, metallicChannel);

            if (textureR != null)
            {
                SetTextureChannel(ref textureR, ref outputColors, roughnessDist, roughnessChannel);
            }

            if (textureAO != null)
            {
                SetTextureChannel(ref textureAO, ref outputColors, EImageChannel.R, occlusionChannel);
            }

            Texture2D newtex = new Texture2D(width, height);
            newtex.name = texName;
            newtex.SetPixels(outputColors);
            newtex.Apply();

            newtex.filterMode = textureM.filterMode;
            newtex.wrapMode = textureM.wrapMode;

            return newtex;
        }

        private static void CloneAndResize(ref Texture2D tex, out Texture2D newtex, int width, int height)
        {
            Texture2D newTex = null;
            DoActionForTexture(ref tex, t =>
                {
                    newTex = new Texture2D(t.width, t.height);
                    newTex.name = t.name;
                    newTex.SetPixels(t.GetPixels());
                    newTex.Apply();
                    TextureScale.Bilinear(newTex, width, height);
                }
            );

            newtex = newTex;
        }

        public static void DoActionForTexture(ref Texture2D tex, Action<Texture2D> action)
        {
            TextureImporter im = AssetImporter.GetAtPath(AssetDatabase.GetAssetPath(tex)) as TextureImporter;

            if (!im)
            {
                return;
            }

            bool readable = im.isReadable;
            TextureImporterCompression format = im.textureCompression;
            TextureImporterType type = im.textureType;
            bool isConvertedBump = im.convertToNormalmap;

            if (!readable)
                im.isReadable = true;
            if (type != TextureImporterType.Default)
                im.textureType = TextureImporterType.Default;

            im.textureCompression = TextureImporterCompression.Uncompressed;
            im.SaveAndReimport();

            action(tex);

            if (!readable)
                im.isReadable = false;
            if (type != TextureImporterType.Default)
                im.textureType = type;
            if (isConvertedBump)
                im.convertToNormalmap = true;

            im.textureCompression = format;
            im.SaveAndReimport();
        }

        private static void SetTextureChannel(ref Texture2D texture, ref Color[] colors, EImageChannel outputChannel, EImageChannel inputChannel = EImageChannel.R)
        {
            int height = texture.height;
            int width = texture.width;
            Color[] inputColors = new Color[texture.width * texture.height];
            DoActionForTexture(ref texture, tex => { inputColors = tex.GetPixels(); });

            if (!texture || inputColors.Length <= 0)
            {
                return;
            }

            if (height * width != colors.Length)
            {
                Debug.LogError("Issue with texture dimensions");
                return;
            }

            for (int i = 0; i < height; ++i)
            {
                for (int j = 0; j < width; ++j)
                {
                    int index = i * width + j;
                    Color c = colors[index];
                    float inputValue;
                    if (outputChannel == EImageChannel.R)
                    {
                        inputValue = inputColors[index].r;
                    }
                    else if (outputChannel == EImageChannel.G)
                    {
                        inputValue = inputColors[index].g;
                    }
                    else if (outputChannel == EImageChannel.B)
                    {
                        inputValue = inputColors[index].b;
                    }
                    else
                    {
                        inputValue = inputColors[index].a;
                    }

                    if (outputChannel == EImageChannel.R)
                    {
                        c.r = inputValue;
                    }
                    else if (outputChannel == EImageChannel.G)
                    {
                        c.g = inputValue;
                    }
                    else if (outputChannel == EImageChannel.B)
                    {
                        c.b = inputValue;
                    }
                    else if (outputChannel == EImageChannel.G_INVERT)
                    {
                        c.g = 1.0f - inputValue;
                    }

                    colors[index] = c;
                }
            }

        }
    }
}
