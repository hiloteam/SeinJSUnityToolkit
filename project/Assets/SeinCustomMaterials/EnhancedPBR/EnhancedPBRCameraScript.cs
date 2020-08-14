using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class EnhancedPBRCameraScript : MonoBehaviour
{
    private HashSet<Material> materials = new HashSet<Material>();
    private RenderTexture texture;
    private Camera copyCamera;

    private void Awake()
    {
        gameObject.AddComponent<SeinEnhancedPBRFreeCameraControl>();
        var rootObjects = new List<GameObject>();
        var scene = SceneManager.GetActiveScene();
        scene.GetRootGameObjects(rootObjects);

        texture = new RenderTexture(Screen.width, Screen.height, 24);
        var cam = GetComponent<Camera>();
        var go = GameObject.FindGameObjectWithTag("SeinPBRRefractionCamera");
        if (go == null)
        {
            go = new GameObject("RefractionCamera");
            go.tag = "SeinPBRRefractionCamera";
            copyCamera = go.AddComponent<Camera>();
        }
        else
        {
            copyCamera = go.GetComponent<Camera>();
        }
        copyCamera.CopyFrom(cam);
        copyCamera.targetTexture = texture;

        foreach (var obj in rootObjects)
        {
            if (!obj.activeSelf)
            {
                continue;
            }

            var mrs = obj.GetComponentsInChildren<MeshRenderer>();
            if (mrs.Length == 0)
            {
                continue;
            }

            foreach (var mr in mrs)
            {
                var sms = mr.sharedMaterials;
                foreach (var mat in sms)
                {
                    materials.Add(mat);
                }
            }
        }
    }

    void OnPreRender()
    {
        var cam = GetComponent<Camera>();
        foreach (var mat in materials)
        {
            if (mat.shader.name == "Sein/EnhancedPBR")
            {
                mat.SetInt("_refractionPass", 2);
                UnityEditor.SeinEnhancedPBRShaderGUI.SetupMaterialWithBlendMode(mat, UnityEditor.SeinEnhancedPBRShaderGUI.BlendMode.Transparent);
            }
            else
            {
                mat.SetInt("_Cull", (int)UnityEngine.Rendering.CullMode.Front);
            }
        }

        copyCamera.CopyFrom(cam);
        copyCamera.targetTexture = texture;
        copyCamera.Render();

        foreach (var mat in materials)
        {
            if (mat.shader.name == "Sein/EnhancedPBR")
            {
                mat.SetTexture("_refractionMap", texture);
                mat.SetInt("_refractionPass", 1);
                UnityEditor.SeinEnhancedPBRShaderGUI.SetupMaterialWithBlendMode(mat, UnityEditor.SeinEnhancedPBRShaderGUI.BlendMode.Opaque);
            }
            else
            {
                mat.SetInt("_Cull", (int)UnityEngine.Rendering.CullMode.Back);
            }
        }
    }

    private void OnDestroy()
    {
        foreach (var mat in materials)
        {
            if (mat.shader.name == "Sein/EnhancedPBR")
            {
                mat.SetInt("_refractionPass", 0);
                UnityEditor.SeinEnhancedPBRShaderGUI.SetupMaterialWithBlendMode(mat, UnityEditor.SeinEnhancedPBRShaderGUI.BlendMode.Transparent);
            }
            else
            {
                mat.SetInt("_Cull", (int)UnityEngine.Rendering.CullMode.Back);
            }
        }
    }
}
