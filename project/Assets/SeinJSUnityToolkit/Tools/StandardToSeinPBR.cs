/**
 * @File   : StandardToSeinPBR.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/09/09 0:00:00PM
 */
using UnityEngine;
using UnityEditor;
using System.Collections.Generic;
using System.IO;
using System;

namespace SeinJS
{
    public class StandardToSeinPBR : MonoBehaviour
    {
        [MenuItem("Assets/Materials to SeinPBR", priority = 0)]
        private static void AssetsToSeinPBR()
        {
            var objects = Selection.objects;
            AssetsToSeinPBR(objects);

            AssetDatabase.Refresh();
        }

        private static void AssetsToSeinPBR(UnityEngine.Object[] objects)
        {
            var needBak = CheckNeedBackup();
            foreach (var obj in objects)
            {
                var type = obj.GetType();
                if (type == typeof(Material))
                {
                    ToSeinPBR(obj as Material, needBak);
                }
                else if (type == typeof(GameObject))
                {
                    HashSet<Material> materials = new HashSet<Material>();
                    List<Renderer> children = new List<Renderer>();
                    children.AddRange((obj as GameObject).GetComponentsInChildren<Renderer>());
                    children.AddRange((obj as GameObject).GetComponentsInChildren<SkinnedMeshRenderer>());

                    foreach (var mr in children)
                    {
                        var sms = mr.sharedMaterials;
                        foreach (var m in sms)
                        {
                            materials.Add(m);
                        }
                    }

                    foreach (var m in materials)
                    {
                        ToSeinPBR(m, needBak);
                    }
                }
                else
                {
                    //string selectionPath = AssetDatabase.GetAssetPath(obj); // relative path
                    //if (Directory.Exists(selectionPath))
                    //{

                    //}
                }
            }
        }

        [MenuItem("CONTEXT/Material/To SeinPBR", priority = 0)]
        private static void InspectorToSeinPBR(MenuCommand command)
        {
            var material = command.context as Material;
            ToSeinPBR(material);

            AssetDatabase.Refresh();
        }

        [MenuItem("GameObject/Sein/Materials to SeinPBR", priority = 11)]
        private static void GOToSeinPBR()
        {
            HashSet<Material> materials = new HashSet<Material>();
            var transforms = Selection.GetTransforms(SelectionMode.Deep);
            foreach (var tr in transforms)
            {
                Renderer mr = GetRenderer(tr);
                if (mr == null)
                {
                    continue;
                }

                var sms = mr.sharedMaterials;
                foreach (var m in sms)
                {
                    materials.Add(m);
                }
            }

            var needBak = CheckNeedBackup();
            foreach (var m in materials)
            {
                ToSeinPBR(m, needBak);
            }

            AssetDatabase.Refresh();
        }

        private static Renderer GetRenderer(Transform tr)
        {
            Renderer mr = tr.GetComponent<MeshRenderer>();
            if (mr == null)
            {
                mr = tr.GetComponent<SkinnedMeshRenderer>();
            }
            return mr;
        }

        [MenuItem("SeinJS/Materials to SeinPBR", priority = 4)]
        private static void AllToSeinPBR()
        {
            Material[] materials = (Material[])Resources.FindObjectsOfTypeAll(typeof(Material));
            var needBak = CheckNeedBackup();

            foreach (var m in materials)
            {
                ToSeinPBR(m, needBak);
            }

            AssetDatabase.Refresh();
        }

        private static bool CheckNeedBackup()
        {
            return EditorUtility.DisplayDialog(
                "Backup?",
                "Need to backup orginal materials?",
                "Yes",
                "No"
            );
        }

        private static void ToSeinPBR(Material material, bool backup = true)
        {
            var name = material.shader.name;

            if (!(name == "Standard" || name == "Autodesk Interactive" || name == "Standard (Specular setup)"))
            {
                return;
            }

            Debug.Log("Converting: " + material.name);

            if (backup)
            {
                BackupMaterial(material);
            }
            ConvertMaterial(material);
        }

        private static void BackupMaterial(Material material)
        {
            var origPath = AssetDatabase.GetAssetPath(material);
            var fname = Path.GetFileNameWithoutExtension(origPath);
            var dir = Path.GetDirectoryName(origPath) + "/bak";

            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }

            SaveMaterial(new Material(material), dir + "/" + fname + "_bak");
        }

        private static void ConvertMaterial(Material mat)
        {
            var material = new Material(Shader.Find("Sein/PBR"));

            bool isMetal = mat.shader.name == "Standard" || mat.shader.name == "Autodesk Interactive";
            if (!isMetal)
            {
                material.SetInt("workflow", (int)SeinPBRShaderGUI.Workflow.Specular);
            }
            else
            {
                material.SetInt("workflow", (int)SeinPBRShaderGUI.Workflow.Metal);
            }

            var mode = GetBlendMode(mat);
            material.SetInt("_Mode", (int)mode);
            if (mode == SeinPBRShaderGUI.BlendMode.Cutout)
            {
                material.SetFloat("_Cutoff", mat.GetFloat("_Cutoff"));
            }

            // Is smoothness defined by diffuse texture or PBR texture' alpha?
            if (mat.HasProperty("_SmoothnessTextureChannel") && Math.Abs(mat.GetFloat("_SmoothnessTextureChannel")) > 0.01)
                Debug.Log("Smoothness uses diffuse's alpha channel. Unsupported for now");

            bool hasPBRMap = (!isMetal && mat.GetTexture("_SpecGlossMap") != null) || (isMetal && mat.GetTexture("_MetallicGlossMap") != null);

            //Parse diffuse channel texture and color
            if (mat.HasProperty("_MainTex") && mat.GetTexture("_MainTex") != null)
            {
                var texture = (Texture2D)mat.GetTexture("_MainTex");
                ChangeSRGB(ref texture, true);
                material.SetTexture("_baseColorMap", texture);
            }

            if (mat.HasProperty("_Color"))
            {
                material.SetColor("_baseColor", mat.GetColor("_Color"));
            }

            //Parse PBR textures
            if (isMetal)
            {
                if (hasPBRMap) // No metallic factor if texture
                {

                    Texture2D metallicTexture = (Texture2D)mat.GetTexture("_MetallicGlossMap");
                    ChangeSRGB(ref metallicTexture, false);
                    Texture2D roughnessTexture = null;
                    if (mat.shader.name == "Autodesk Interactive")
                    {
                        roughnessTexture = (Texture2D)mat.GetTexture("_SpecGlossMap");
                    }
                    else
                    {
                        var channel = mat.GetInt("_SmoothnessTextureChannel");
                        if (channel == 0)
                        {
                            roughnessTexture = SplitRoughnessTexture(metallicTexture);
                        }
                        else
                        {
                            roughnessTexture = SplitRoughnessTexture((Texture2D)mat.GetTexture("_baseColorMap"));
                        }
                    }
                    ChangeSRGB(ref roughnessTexture, false);

                    material.SetTexture("_metallicMap", metallicTexture);
                    material.SetTexture("_roughnessMap", roughnessTexture);
                }

                material.SetFloat("_metallic", hasPBRMap ? 1.0f : mat.GetFloat("_Metallic"));
                material.SetFloat("_roughness", mat.shader.name == "Autodesk Interactive" ? 1.0f : mat.GetFloat("_GlossMapScale"));
            }
            else
            {
                if (hasPBRMap) // No metallic factor if texture
                {
                    var texture = (Texture2D)mat.GetTexture("_SpecGlossMap");
                    ChangeSRGB(ref texture, false);
                    material.SetTexture("__specularGlossinessMap", texture);
                }

                material.SetColor("__specular", hasPBRMap ? Color.white : mat.GetColor("_SpecColor"));
                material.SetFloat("_glossiness", hasPBRMap ? 1.0f : mat.GetFloat("_Glossiness"));
            }

            //BumpMap
            if (mat.HasProperty("_BumpMap") && mat.GetTexture("_BumpMap") != null)
            {
                Texture2D bumpTexture = mat.GetTexture("_BumpMap") as Texture2D;
                // Check if it's a normal or a bump map
                TextureImporter im = AssetImporter.GetAtPath(AssetDatabase.GetAssetPath(bumpTexture)) as TextureImporter;
                bool isBumpMap = im.convertToNormalmap;

                if (isBumpMap)
                {
                    Debug.LogWarning("Unsupported texture " + bumpTexture + " (normal maps generated from grayscale are not supported)");
                }
                else
                {
                    ChangeSRGB(ref bumpTexture, false);
                    material.SetTexture("_normalMap", bumpTexture);
                    material.SetFloat("_normalScale", mat.GetFloat("_BumpScale"));
                }
            }

            //Emissive
            if (mat.HasProperty("_EmissionMap") && mat.GetTexture("_EmissionMap") != null)
            {
                Texture2D emissiveTexture = mat.GetTexture("_EmissionMap") as Texture2D;
                ChangeSRGB(ref emissiveTexture, true);
                material.SetTexture("_emissionMap", emissiveTexture);
            }
            material.SetColor("_emission", mat.GetColor("_EmissionColor"));

            if (mat.HasProperty("_OcclusionMap") && mat.GetTexture("_OcclusionMap") != null)
            {
                var occlusionTexture = mat.GetTexture("_OcclusionMap") as Texture2D;
                ChangeSRGB(ref occlusionTexture, false);

                material.SetTexture("_occlusionMap", occlusionTexture);
                material.SetFloat("_occlusionStrength", mat.GetFloat("_OcclusionStrength"));
            }

            mat.shader = Shader.Find("Sein/PBR");
            mat.CopyPropertiesFromMaterial(material);
        }

        private static void ChangeSRGB(ref Texture2D tex, bool isSRGB)
        {
            TextureImporter im = AssetImporter.GetAtPath(AssetDatabase.GetAssetPath(tex)) as TextureImporter;
            if (im.sRGBTexture == isSRGB)
            {
                return;
            }

            im.sRGBTexture = isSRGB;
            im.SaveAndReimport();
        }

        private static SeinPBRShaderGUI.BlendMode GetBlendMode(Material mat)
        {
            if (!mat.HasProperty("_Mode"))
            {
                return SeinPBRShaderGUI.BlendMode.Opaque;
            }

            switch ((int)mat.GetFloat("_Mode"))
            {
                // Opaque
                case 0:
                    return SeinPBRShaderGUI.BlendMode.Opaque;
                // Cutout
                case 1:
                    return SeinPBRShaderGUI.BlendMode.Cutout;
                // Transparent
                case 2:
                case 3:
                    return SeinPBRShaderGUI.BlendMode.Transparent;
            }

            return SeinPBRShaderGUI.BlendMode.Opaque;
        }

        private static Texture2D SplitRoughnessTexture(Texture2D texture)
        {

            int width = texture.width;
            int height = texture.height;
            string assetPath = AssetDatabase.GetAssetPath(texture);
            TextureImporter im = AssetImporter.GetAtPath(assetPath) as TextureImporter;
            im.isReadable = true;
            im.SaveAndReimport();
            var iColor = texture.GetPixels();
            im.isReadable = false;
            im.SaveAndReimport();

            // Let's consider that the three textures have the same resolution
            Color[] colors = new Color[width * height];
            for (int i = 0; i < colors.Length; i += 1)
            {
                float a = 1 - iColor[i].a;

                colors[i] = new Color(a, a, a);
            }

            var res = new Texture2D(width, height);
            res.SetPixels(colors);

            string basename = Path.GetFileNameWithoutExtension(assetPath) + "_rg";
            string fullPath = Path.GetFullPath(Path.GetDirectoryName(assetPath)) + "/" + basename + ".png";

            string newAssetPath = GLTFTextureUtils.writeTextureOnDisk(res, fullPath, true);
            string projectPath = GLTFUtils.getPathProjectFromAbsolute(newAssetPath);
            Texture2D tex = (Texture2D)AssetDatabase.LoadAssetAtPath(projectPath, typeof(Texture2D));

            return tex;
        }

        private static void SaveMaterial(Material material, string path)
        {
            if (File.Exists(path))
            {
                File.Delete(path);
                File.Delete(path + ".meta");
                AssetDatabase.Refresh();
            }

            AssetDatabase.CreateAsset(material, path + ".mat");
        }
    }
}
