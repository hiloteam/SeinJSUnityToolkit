/**
 * @File   : SeinPBR.shader
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 14/2/2020, 11:00:00
 * @Description:
 */
using System;
using System.IO;
using UnityEngine;

namespace UnityEditor
{
    internal class SeinBasicShaderGUI : ShaderGUI
    {
        public enum BlendMode
        {
            Opaque = 0,
            Cutout = 1,
            Fade = 2,
            Transparent = 3
        }

        public enum LightMode
        {
            NONE = 0,
            PHONG = 1,
            BLINNPHONG = 2,
            LAMBERT = 3
        }

        public enum EnvReflection
        {
            Off = 0,
            On = 1
        }

        private static class Styles
        {
            public static GUIContent normalText = EditorGUIUtility.TrTextContent("Normal", "Normal Texture");
            public static GUIContent diffuseText = EditorGUIUtility.TrTextContent("Diffuse(RGB)", "Diffuse Texture Or Color");
            public static GUIContent ambientText = EditorGUIUtility.TrTextContent("Amibent(RGB)", "Amibent Texture Or Color");
            public static GUIContent specularText = EditorGUIUtility.TrTextContent("Specular(RGB)", "Specular Texture Or Color");
            public static GUIContent emissionText = EditorGUIUtility.TrTextContent("Emission(RGB)", "Emission Texture Or Color");
            public static GUIContent shininessText = EditorGUIUtility.TrTextContent("Shininess", "Shininess");
            public static GUIContent alphaCutoffText = EditorGUIUtility.TrTextContent("Alpha Cutoff", "Threshold for alpha cutoff");
            public static GUIContent cloneForInstText = EditorGUIUtility.TrTextContent("Clone For Inst", "Clone when instantiation");
            public static GUIContent lightTypeText = EditorGUIUtility.TrTextContent("Light Type", "Light Mode");
            public static GUIContent envText = EditorGUIUtility.TrTextContent("Env reflection", "Select env reflection mode");
            public static GUIContent reflectivityText = EditorGUIUtility.TrTextContent("Reflectivity", "Reflectivity");
            public static GUIContent refractivityText = EditorGUIUtility.TrTextContent("Refractivity", "Refractivity");
            public static GUIContent refractRatioText = EditorGUIUtility.TrTextContent("Refract Ratio", "Refract Ratio");

            public static string renderingMode = "Rendering Mode";
            public static string advancedText = "Advanced Options";
            public static readonly string[] blendNames = Enum.GetNames(typeof(BlendMode));
            public static readonly string[] lightTypeNames = Enum.GetNames(typeof(LightMode));
            public static readonly string[] envReflectionNames = Enum.GetNames(typeof(EnvReflection));
        }

        MaterialProperty lightType;
        MaterialProperty envReflection;
        MaterialProperty cloneForInst;
        MaterialProperty blendMode;
        MaterialProperty alphaCutoff;

        MaterialProperty u_diffuse;
        MaterialProperty u_diffuseMap;

        MaterialProperty u_ambientMap;

        MaterialProperty u_specular;
        MaterialProperty u_specularMap;

        MaterialProperty u_refractRatio;
        MaterialProperty u_refractivity;
        MaterialProperty u_reflectivity;

        MaterialProperty u_normalMap;

        MaterialProperty u_emission;
        MaterialProperty u_emissionMap;
        MaterialProperty u_shininess;

        MaterialEditor m_MaterialEditor;

        public void FindProperties(MaterialProperty[] props)
        {
            blendMode = FindProperty("_Mode", props);
            alphaCutoff = FindProperty("_Cutoff", props);
            lightType = FindProperty("lightType", props);
            envReflection = FindProperty("envReflection", props);
            cloneForInst = FindProperty("cloneForInst", props);

            u_diffuse = FindProperty("u_diffuse", props);
            u_diffuseMap = FindProperty("u_diffuseMap", props);
            u_ambientMap = FindProperty("u_ambientMap", props);
            u_specular = FindProperty("u_specular", props);
            u_specularMap = FindProperty("u_specularMap", props);
            u_reflectivity = FindProperty("u_reflectivity", props);
            u_refractRatio = FindProperty("u_refractRatio", props);
            u_refractivity = FindProperty("u_refractivity", props);
            u_normalMap = FindProperty("u_normalMap", props);
            u_emission = FindProperty("u_emission", props);
            u_emissionMap = FindProperty("u_emissionMap", props);
            u_shininess = FindProperty("u_shininess", props);
        }

        public override void OnGUI(MaterialEditor materialEditor, MaterialProperty[] props)
        {
            FindProperties(props); // MaterialProperties can be animated so we do not cache them but fetch them every event to ensure animated values are updated correctly

            m_MaterialEditor = materialEditor;
            Material material = materialEditor.target as Material;

            ShaderPropertiesGUI(material);
        }

        public void ShaderPropertiesGUI(Material material)
        {
            // Use default labelWidth
            EditorGUIUtility.labelWidth = 0f;

            // Detect any changes to the material
            EditorGUI.BeginChangeCheck();
            {
                BlendModePopup();
                LightModePopup();
                ReflectionPopup();
                m_MaterialEditor.ShaderProperty(cloneForInst, Styles.cloneForInstText);

                EditorGUILayout.Space();

                DoBaseArea(material);
                m_MaterialEditor.TexturePropertySingleLine(Styles.diffuseText, u_diffuseMap, u_diffuse);
                m_MaterialEditor.TexturePropertySingleLine(Styles.specularText, u_specularMap, u_specular);
                m_MaterialEditor.TexturePropertySingleLine(Styles.ambientText, u_ambientMap);
                m_MaterialEditor.TexturePropertySingleLine(Styles.normalText, u_normalMap);
                m_MaterialEditor.TexturePropertySingleLine(Styles.emissionText, u_emissionMap, u_emission);
                m_MaterialEditor.ShaderProperty(u_shininess, Styles.shininessText);
                m_MaterialEditor.ShaderProperty(u_reflectivity, Styles.reflectivityText);
                m_MaterialEditor.ShaderProperty(u_refractivity, Styles.refractivityText);
                m_MaterialEditor.ShaderProperty(u_refractRatio, Styles.refractRatioText);
            }

            if (EditorGUI.EndChangeCheck())
            {
                foreach (var obj in blendMode.targets)
                {
                    MaterialChanged((Material)obj);
                }

                if (u_normalMap.textureValue != null)
                {
                    material.EnableKeyword("HAS_NORMAL_MAP");
                }
                else
                {
                    material.DisableKeyword("HAS_NORMAL_MAP");
                }
            }

            // NB renderqueue editor is not shown on purpose: we want to override it based on blend mode
            GUILayout.Label(Styles.advancedText, EditorStyles.boldLabel);
            m_MaterialEditor.EnableInstancingField();
            m_MaterialEditor.DoubleSidedGIField();
        }

        void DoBaseArea(Material material)
        {
            if (((BlendMode)material.GetFloat("_Mode") == BlendMode.Cutout))
            {
                m_MaterialEditor.ShaderProperty(alphaCutoff, Styles.alphaCutoffText.text, MaterialEditor.kMiniTextureFieldLabelIndentLevel + 1);
            }
        }
        
        void LightModePopup()
        {
            EditorGUI.showMixedValue = lightType.hasMixedValue;
            var flow = (LightMode)lightType.floatValue;

            EditorGUI.BeginChangeCheck();
            flow = (LightMode)EditorGUILayout.Popup(Styles.lightTypeText, (int)flow, Styles.lightTypeNames);
            if (EditorGUI.EndChangeCheck())
            {
                m_MaterialEditor.RegisterPropertyChangeUndo("LightMode");
                lightType.floatValue = (float)flow;
            }

            EditorGUI.showMixedValue = false;
        }

        void BlendModePopup()
        {
            EditorGUI.showMixedValue = blendMode.hasMixedValue;
            var mode = (BlendMode)blendMode.floatValue;

            EditorGUI.BeginChangeCheck();
            mode = (BlendMode)EditorGUILayout.Popup(Styles.renderingMode, (int)mode, Styles.blendNames);
            if (EditorGUI.EndChangeCheck())
            {
                m_MaterialEditor.RegisterPropertyChangeUndo("Rendering Mode");
                blendMode.floatValue = (float)mode;
            }

            EditorGUI.showMixedValue = false;
        }

        void ReflectionPopup()
        {
            EditorGUI.showMixedValue = envReflection.hasMixedValue;
            var mode = (EnvReflection)envReflection.floatValue;

            EditorGUI.BeginChangeCheck();
            mode = (EnvReflection)EditorGUILayout.Popup(Styles.envText, (int)mode, Styles.envReflectionNames);
            if (EditorGUI.EndChangeCheck())
            {
                m_MaterialEditor.RegisterPropertyChangeUndo("Env Reflection");
                envReflection.floatValue = (float)mode;
            }

            EditorGUI.showMixedValue = false;
        }

        public static void SetupMaterialWithBlendMode(Material material, BlendMode blendMode)
        {
            switch (blendMode)
            {
                case BlendMode.Opaque:
                    material.SetOverrideTag("RenderType", "Opaque");
                    material.SetInt("_SrcBlend", (int)UnityEngine.Rendering.BlendMode.One);
                    material.SetInt("_DstBlend", (int)UnityEngine.Rendering.BlendMode.Zero);
                    material.SetInt("_ZWrite", 1);
                    material.DisableKeyword("_ALPHATEST_ON");
                    material.DisableKeyword("_ALPHABLEND_ON");
                    material.DisableKeyword("_ALPHAPREMULTIPLY_ON");
                    material.renderQueue = (int)UnityEngine.Rendering.RenderQueue.Geometry;
                    break;
                case BlendMode.Cutout:
                    material.SetOverrideTag("RenderType", "TransparentCutout");
                    material.SetInt("_SrcBlend", (int)UnityEngine.Rendering.BlendMode.One);
                    material.SetInt("_DstBlend", (int)UnityEngine.Rendering.BlendMode.Zero);
                    material.SetInt("_ZWrite", 1);
                    material.EnableKeyword("_ALPHATEST_ON");
                    material.DisableKeyword("_ALPHABLEND_ON");
                    material.DisableKeyword("_ALPHAPREMULTIPLY_ON");
                    material.renderQueue = (int)UnityEngine.Rendering.RenderQueue.AlphaTest;
                    break;
                case BlendMode.Fade:
                case BlendMode.Transparent:
                    material.SetOverrideTag("RenderType", "Transparent");
                    material.SetInt("_SrcBlend", (int)UnityEngine.Rendering.BlendMode.SrcAlpha);
                    material.SetInt("_DstBlend", (int)UnityEngine.Rendering.BlendMode.OneMinusSrcAlpha);
                    material.SetInt("_ZWrite", 0);
                    material.DisableKeyword("_ALPHATEST_ON");
                    material.DisableKeyword("_ALPHABLEND_ON");
                    material.EnableKeyword("_ALPHAPREMULTIPLY_ON");
                    material.renderQueue = (int)UnityEngine.Rendering.RenderQueue.Transparent;
                    break;
            }
        }

        public static void SetupMaterialWithEnvMode(Material material, EnvReflection mode)
        {
            switch (mode)
            {
                case EnvReflection.On:
                    material.EnableKeyword("ENV_SPECULAR_ON");
                    break;
                case EnvReflection.Off:
                    material.DisableKeyword("ENV_SPECULAR_ON");
                    break;
            }
        }

        static void MaterialChanged(Material material)
        {
            SetupMaterialWithBlendMode(material, (BlendMode)material.GetFloat("_Mode"));
            SetupMaterialWithEnvMode(material, (EnvReflection)material.GetFloat("envReflection"));

            if (material.GetTexture("u_diffuseMap") != null)
            {
                material.EnableKeyword("DIFFUSE_USE_MAP");
            }
            else
            {
                material.DisableKeyword("DIFFUSE_USE_MAP");
            }

            if (material.GetTexture("u_specularMap") != null)
            {
                material.EnableKeyword("SPECULAR_USE_MAP");
            }
            else
            {
                material.DisableKeyword("SPECULAR_USE_MAP");
            }

            if (material.GetTexture("u_ambientMap") != null)
            {
                material.EnableKeyword("AMBIENT_USE_MAP");
            }
            else
            {
                material.DisableKeyword("AMBIENT_USE_MAP");
            }

            if (material.GetTexture("u_emissionMap") != null)
            {
                material.EnableKeyword("EMISSION_USE_MAP");
            }
            else
            {
                material.DisableKeyword("EMISSION_USE_MAP");
            }
        }
    }
}
