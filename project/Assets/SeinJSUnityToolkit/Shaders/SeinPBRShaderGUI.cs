/**
 * @File   : SeinPBR.shader
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 20/6/2019, 3:41:53 PM
 * @Description:
 */
using System;
using System.IO;
using UnityEngine;

namespace UnityEditor
{
    internal class SeinPBRShaderGUI : ShaderGUI
    {
        private static Texture2D brdfLUT;

        public enum BlendMode
        {
            Opaque = 0,
            Cutout = 1,
            Fade = 2,
            Transparent = 3
        }

        public enum Workflow
        {
            Metal = 0,
            Specular = 1
        }

        public enum EnvReflection
        {
            Off = 0,
            On = 1
        }

        private static class Styles
        {
            public static GUIContent baseText = EditorGUIUtility.TrTextContent("Base(RGBA)", "Base Texture and Color");
            public static GUIContent metallicText = EditorGUIUtility.TrTextContent("Metallic(B)", "Metallic Texture and Factor");
            public static GUIContent roughnessText = EditorGUIUtility.TrTextContent("Roughness(G)", "Roughness Texture and Factor");
            public static GUIContent specularGlossinessText = EditorGUIUtility.TrTextContent("Specular(RGB) & Glossiness(A)", "SpecularGlossiness Texture and Color");
            public static GUIContent glossinessText = EditorGUIUtility.TrTextContent("Glossiness", "Glossiness Factor");
            public static GUIContent normalText = EditorGUIUtility.TrTextContent("Normal", "Normal Texture");
            public static GUIContent occlusionText = EditorGUIUtility.TrTextContent("Occlusion(R)", "Occlusion Texture and Strength");
            public static GUIContent emissionText = EditorGUIUtility.TrTextContent("Emission(RGB)", "Emission Texture and Color");
            public static GUIContent alphaCutoffText = EditorGUIUtility.TrTextContent("Alpha Cutoff", "Threshold for alpha cutoff");
            public static GUIContent cloneForInstText = EditorGUIUtility.TrTextContent("Clone For Inst", "Clone when instantiation");
            public static GUIContent unlitText = EditorGUIUtility.TrTextContent("Unlit mode", "If Unlit mode");
            public static GUIContent envText = EditorGUIUtility.TrTextContent("Env reflection", "Select env reflection mode");

            public static string renderingMode = "Rendering Mode";
            public static string workflow = "Workflow";
            public static string advancedText = "Advanced Options";
            public static readonly string[] blendNames = Enum.GetNames(typeof(BlendMode));
            public static readonly string[] workflowNames = Enum.GetNames(typeof(Workflow));
            public static readonly string[] envReflectionNames = Enum.GetNames(typeof(EnvReflection));
        }

        MaterialProperty unlit;
        MaterialProperty workflow;
        MaterialProperty envReflection;
        MaterialProperty cloneForInst;
        MaterialProperty blendMode;
        MaterialProperty alphaCutoff;

        MaterialProperty baseColor;
        MaterialProperty baseColorMap;

        MaterialProperty metallic;
        MaterialProperty metallicMap;

        MaterialProperty roughness;
        MaterialProperty roughnessMap;

        MaterialProperty specular;
        MaterialProperty glossiness;
        MaterialProperty specularGlossinessMap;

        MaterialProperty occlusionStrength;
        MaterialProperty occlusionMap;

        MaterialProperty normalMap;

        MaterialProperty emission;
        MaterialProperty emissionMap;

        MaterialEditor m_MaterialEditor;

        public void FindProperties(MaterialProperty[] props)
        {
            blendMode = FindProperty("_Mode", props);
            alphaCutoff = FindProperty("_Cutoff", props);
            workflow = FindProperty("workflow", props);
            unlit = FindProperty("unlit", props);
            envReflection = FindProperty("envReflection", props);
            cloneForInst = FindProperty("cloneForInst", props);

            baseColor = FindProperty("_baseColor", props);
            baseColorMap = FindProperty("_baseColorMap", props);
            metallic = FindProperty("_metallic", props);
            metallicMap = FindProperty("_metallicMap", props);
            roughness = FindProperty("_roughness", props);
            roughnessMap = FindProperty("_roughnessMap", props);
            specular = FindProperty("_specular", props);
            glossiness = FindProperty("_glossiness", props);
            specularGlossinessMap = FindProperty("_specularGlossinessMap", props);
            glossiness = FindProperty("_glossiness", props);
            occlusionMap = FindProperty("_occlusionMap", props);
            occlusionStrength = FindProperty("_occlusionStrength", props);
            normalMap = FindProperty("_normalMap", props);
            emission = FindProperty("_emission", props);
            emissionMap = FindProperty("_emissionMap", props);
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
                WorkflowPopup();
                ReflectionPopup();
                m_MaterialEditor.ShaderProperty(unlit, Styles.unlitText);
                m_MaterialEditor.ShaderProperty(cloneForInst, Styles.cloneForInstText);

                EditorGUILayout.Space();

                DoBaseArea(material);
                DoWorkflow(material);
                m_MaterialEditor.TexturePropertySingleLine(Styles.normalText, normalMap);
                m_MaterialEditor.TexturePropertySingleLine(Styles.occlusionText, occlusionMap, occlusionStrength);
                m_MaterialEditor.TexturePropertySingleLine(Styles.emissionText, emissionMap, emission);
            }

            if (EditorGUI.EndChangeCheck())
            {
                foreach (var obj in blendMode.targets)
                {
                    MaterialChanged((Material)obj);
                }

                if (normalMap.textureValue != null)
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
            m_MaterialEditor.TexturePropertySingleLine(Styles.baseText, baseColorMap, baseColor);
            if (((BlendMode)material.GetFloat("_Mode") == BlendMode.Cutout))
            {
                m_MaterialEditor.ShaderProperty(alphaCutoff, Styles.alphaCutoffText.text, MaterialEditor.kMiniTextureFieldLabelIndentLevel + 1);
            }
        }

        void DoWorkflow(Material material)
        {
            if (((Workflow)material.GetFloat("workflow") == Workflow.Metal)) {
                m_MaterialEditor.TexturePropertySingleLine(Styles.metallicText, metallicMap, metallic);
                m_MaterialEditor.TexturePropertySingleLine(Styles.roughnessText, roughnessMap, roughness);
            }
            else
            {
                m_MaterialEditor.TexturePropertySingleLine(Styles.specularGlossinessText, specularGlossinessMap, specular);
                m_MaterialEditor.ShaderProperty(glossiness, Styles.glossinessText, MaterialEditor.kMiniTextureFieldLabelIndentLevel + 1);
            }
        }

        void WorkflowPopup()
        {
            EditorGUI.showMixedValue = workflow.hasMixedValue;
            var flow = (Workflow)workflow.floatValue;

            EditorGUI.BeginChangeCheck();
            flow = (Workflow)EditorGUILayout.Popup(Styles.workflow, (int)flow, Styles.workflowNames);
            if (EditorGUI.EndChangeCheck())
            {
                m_MaterialEditor.RegisterPropertyChangeUndo("Worlflow");
                workflow.floatValue = (float)flow;
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

            if (brdfLUT == null)
            {
                var brdfPath = "Assets/SeinJSUnityToolkit/Shaders/brdfLUT.jpg";
                var e = File.Exists(brdfPath);
                brdfLUT = AssetDatabase.LoadAssetAtPath<Texture2D>(brdfPath);
            }
            material.SetTexture("_brdfLUT", brdfLUT);
        }

        static void MaterialChanged(Material material)
        {
            SetupMaterialWithBlendMode(material, (BlendMode)material.GetFloat("_Mode"));
            SetupMaterialWithEnvMode(material, (EnvReflection)material.GetFloat("envReflection"));

            if (material.GetTexture("_emissionMap") != null)
            {
                material.EnableKeyword("EMISSION_MAP_MODE");
            } else
            {
                material.DisableKeyword("EMISSION_MAP_MODE");
            }
        }
    }
}
