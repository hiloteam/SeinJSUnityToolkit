#if UNITY_EDITOR
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
using System.IO;
using System.Xml;

public class GlTFExporterWindow : EditorWindow
{
	const string KEY_PATH = "GlTFPath";
	const string KEY_FILE = "GlTFFile";
	static public string path = "?";
	static string savedPath;
	static string savedFile;
	static XmlDocument xdoc;

	static Preset preset = new Preset();
	static UnityEngine.TextAsset presetAsset;
	GameObject exporterGo;
	SceneToGlTFWiz exporter;
	bool buildZip = false;
	bool convertImages = false;
	bool exportAnimation = true;

	//EditorPrefs.SetString(KEY_PATH, savedPath);
	//EditorPrefs.SetString(KEY_FILE, savedFile);
	//[MenuItem("Tools/Export to glTF")]
	static void CreateWizard()
	{
		savedPath = EditorPrefs.GetString(KEY_PATH, "/");
		savedFile = EditorPrefs.GetString(KEY_FILE, "test.gltf");
		path = savedPath + "/" + savedFile;
		//		ScriptableWizard.DisplayWizard("Export Selected Stuff to glTF", typeof(SceneToGlTFWiz), "Export");

		GlTFExporterWindow window = (GlTFExporterWindow)EditorWindow.GetWindow(typeof(GlTFExporterWindow));
		window.Show();
	}

	void OnWizardUpdate()
	{
		//		Texture[] txs = Selection.GetFiltered(Texture, SelectionMode.Assets);
		//		Debug.Log("found "+txs.Length);
	}

	void OnGUI()
	{
		GUILayout.Label("Export Options");
		GlTF_Writer.binary = GUILayout.Toggle(GlTF_Writer.binary, "Binary GlTF");
		buildZip = GUILayout.Toggle(buildZip, "Export Zip");

		// Force animation baking for now
		GlTF_Writer.bakeAnimation = GUILayout.Toggle(true, "Bake animations (forced for now)");
		exportAnimation = GUILayout.Toggle(exportAnimation, "Export animations");
		convertImages = GUILayout.Toggle(convertImages, "Convert images");
		presetAsset = EditorGUILayout.ObjectField("Preset file", presetAsset, typeof(UnityEngine.TextAsset), false) as UnityEngine.TextAsset;
		if (!exporterGo)
		{
			exporterGo = new GameObject("exporter");
		}
		if(!exporter)
		{
			exporter = exporterGo.AddComponent<SceneToGlTFWiz>();
		}
		GUI.enabled = (Selection.GetTransforms(SelectionMode.Deep).Length > 0);
		if (GUILayout.Button("Export to glTF"))
		{
			ExportFile();
		}
		GUI.enabled = true;
	}

	void OnDestroy()
	{
		GameObject.DestroyImmediate(exporterGo);
		exporter = null;
	}

	void ExportFile() // Create (Export) button has been hit (NOT wizard has been created!)
	{
		var ext = GlTF_Writer.binary ? "glb" : "gltf";
		path = EditorUtility.SaveFilePanel("Save glTF file as", savedPath, savedFile, ext);
		if (path.Length != 0)
		{
			if (presetAsset != null)
			{
				string psPath = AssetDatabase.GetAssetPath(presetAsset);
				if (psPath != null)
				{
					psPath = psPath.Remove(0, "Assets".Length);
					psPath = Application.dataPath + psPath;
					preset.Load(psPath);
				}
			}
			exporter.ExportCoroutine(path, preset, buildZip, true, exportAnimation, convertImages);
		}
	}
}
#endif