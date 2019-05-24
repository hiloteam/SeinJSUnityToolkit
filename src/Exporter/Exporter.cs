#if UNITY_EDITOR
using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using SimpleJSON;
using System.Runtime.Serialization.Formatters.Binary;
using System;
using UnityEditor.SceneManagement;

public enum ExporterState
{
	IDLE,
	REQUEST_CODE,
	PUBLISH_MODEL,
	GET_CATEGORIES,
	USER_ACCOUNT_TYPE,
	CHECK_VERSION
}


public class Exporter : EditorWindow {

    [MenuItem("SeinJS/Export to GlTF")]
	static void Init()
	{
#if UNITY_STANDALONE_WIN || UNITY_STANDALONE_OSX // edit: added Platform Dependent Compilation - win or osx standalone
		Exporter window = (Exporter)EditorWindow.GetWindow(typeof(Exporter));
		window.titleContent.text = "Export to GlTF";
		window.Show();
#else // and error dialog if not standalone
		EditorUtility.DisplayDialog("Error", "Your build target must be set to standalone", "Okay");
#endif
        if (!SeinUtils.inited)
        {
            SeinUtils.Init();
        }
	}

    public static String MakeRelativePath(String fromPath, String toPath)
    {
        if (String.IsNullOrEmpty(fromPath)) throw new ArgumentNullException("fromPath");
        if (String.IsNullOrEmpty(toPath)) throw new ArgumentNullException("toPath");

        Uri fromUri = new Uri(fromPath + "/a.txt");
        Uri toUri = new Uri(toPath);

        if (fromUri.Scheme != toUri.Scheme) { return toPath; } // path can't be made relative.

        Uri relativeUri = fromUri.MakeRelativeUri(toUri);
        String relativePath = Uri.UnescapeDataString(relativeUri.ToString()).Replace("/a.txt", "");

        if (toUri.Scheme.Equals("file", StringComparison.InvariantCultureIgnoreCase))
        {
            relativePath = relativePath.Replace(Path.AltDirectorySeparatorChar, Path.DirectorySeparatorChar);
        }

        return relativePath;
    }

    // Static data
    public static int opt_maxSize = 1024;
    public static bool opt_halfSpotAngle = true;
    public static bool opt_quadraticAttenuation = true;
    public static bool opt_forcePNG = false;
    public static int opt_jpgQuality= 85;
    public static bool opt_noLighting= false;
    public static bool opt_splitChunks = false;
    public static bool opt_exportLightMap = true;
    public static bool opt_exportEnvLight = false;

    // UI dimensions (to be cleaned)
	[SerializeField]
	Vector2 fullSize = new Vector2(603, 540);


	// Fields limits
	const int NAME_LIMIT = 48;
	const int DESC_LIMIT = 1024;
	const int TAGS_LIMIT = 50;
	const int PASSWORD_LIMIT = 64;
	const int SPACE_SIZE = 5;

	// Exporter UI: static elements
	[SerializeField]
	GUIStyle exporterTextArea;
	GUIStyle exporterLabel;
	GUIStyle exporterClickableLabel;
	//private Color clickableLabelColor =
	// Exporter objects and scripts
	GameObject exporterGo;
	SceneToGlTFWiz exporter;
    private JSONNode config;
    private string exportFolder;
    private string exportPath;
	private string zipPath;

    private bool opt_exportAnimation = true;
    //private bool opt_quadraticAttenuation = true;
    private string param_name = "scene";
	private string param_description = "";
	private string param_tags = "";

	// Exporter UI: dynamic elements
	private string status = "";
	private Color blueColor = new Color(69 / 255.0f, 185 / 255.0f, 223 / 255.0f);
	private Color greyColor = Color.white;
	//int categoryIndex = 0;
	Rect windowRect;
    Texture2D header;

	//private List<String> tagList;
	void Awake()
	{
        config = JSON.Parse(File.ReadAllText(Path.Combine(Application.dataPath, "./SeinJSUnityToolkit/config.json")));
        exportFolder = Path.GetFullPath(Path.Combine(Application.dataPath, config["exportPath"]));
        if (!Directory.Exists(exportFolder))
        {
            Directory.CreateDirectory(exportFolder);
        }

        exporterGo = new GameObject("Exporter");
		exporter = exporterGo.AddComponent<SceneToGlTFWiz>();
		//FIXME: Make sure that object is deleted;
		exporterGo.hideFlags = HideFlags.HideAndDontSave;
		//publisher.getCategories();
		resizeWindow(fullSize);
    }

	void OnEnable()
	{
        if (!header)
        {
            header = new Texture2D(1, 1);
            header.LoadImage(File.ReadAllBytes(Application.dataPath + "/SeinJSUnityToolkit/logo.png"));
            header.Apply();
        }
        // Pre-fill model name with scene name if empty
        if (param_name.Length == 0)
		{
			param_name = EditorSceneManager.GetActiveScene().name;
		}
		resizeWindow(fullSize);
	}

	int convertToSeconds(DateTime time)
	{
		return (int)(time.Hour * 3600 + time.Minute * 60 + time.Second);
	}

	void OnSelectionChange()
	{
		// do nothing for now
	}

	void resizeWindow(Vector2 size)
	{
		//this.maxSize = size;
		this.minSize = size;
	}

	void expandWindow(bool expand)
	{
		windowRect = this.position;
		windowRect.height = fullSize.y;
		position = windowRect;
	}

	// Update is called once per frame
	void OnInspectorUpdate()
	{
		Repaint();
	}

	private string jsonify(string jsondata)
	{
		return jsondata.Replace("null", "\"null\"");
	}

	private bool updateExporterStatus()
	{
		status = "";

		if (param_name.Length > NAME_LIMIT)
		{
			status = "Model name is too long";
			return false;
		}


		if (param_name.Length == 0)
		{
			status = "Please give a name to your model";
			return false;
		}


		if (param_description.Length > DESC_LIMIT)
		{
			status = "Model description is too long";
			return false;
		}


		if (param_tags.Length > TAGS_LIMIT)
		{
			status = "Model tags are too long";
			return false;
		}


		int nbSelectedObjects = Selection.GetTransforms(SelectionMode.Deep).Length;
		if (nbSelectedObjects == 0)
		{
			status = "No object selected to export";
			return false;
		}

		status = "Upload " + nbSelectedObjects + " object" + (nbSelectedObjects != 1 ? "s" : "");
		return true;
	}

	void OnGUI()
	{
        minSize = new Vector2(600, 500);

        GUILayout.BeginHorizontal();
        GUILayout.FlexibleSpace();
        GUILayout.Label(header);
        GUILayout.FlexibleSpace();
        GUILayout.EndHorizontal();

        string defaultExportFolder = Path.GetFullPath(Path.Combine(Application.dataPath, "../Output"));

        if (exporterLabel == null)
		{
			exporterLabel = new GUIStyle(GUI.skin.label);
			exporterLabel.richText = true;
		}

		if(exporterTextArea == null)
		{
			exporterTextArea = new GUIStyle(GUI.skin.textArea);
			exporterTextArea.fixedWidth = fullSize.x;
			exporterTextArea.fixedHeight = fullSize.y;
		}

		if(exporterClickableLabel == null)
		{
			exporterClickableLabel = new GUIStyle(EditorStyles.centeredGreyMiniLabel);
			exporterClickableLabel.richText = true;
		}

        GUILayout.Space(SPACE_SIZE);

		// Model settings
		GUILayout.Label("Model properties", EditorStyles.boldLabel);

		// Model name
		GUILayout.Label("Name");
		param_name = EditorGUILayout.TextField(param_name);
		GUILayout.Space(SPACE_SIZE);

        GUILayout.Label("Export folder");
        GUILayout.BeginHorizontal();
        GUILayout.TextField(exportFolder, GUILayout.MinWidth(350), GUILayout.Height(21));
        GUILayout.FlexibleSpace();
        if (!Directory.Exists(exportFolder))
        {
            exportFolder = defaultExportFolder;
        }
        if (GUILayout.Button("Select file", GUILayout.Height(21), GUILayout.Width(150)))
        {
            var tmp= EditorUtility.OpenFolderPanel("Choose a folder", exportFolder, "");
            if (tmp != "")
            {
                exportFolder = tmp;

                config["exportPath"] = MakeRelativePath(Application.dataPath, exportFolder);
                File.WriteAllText(
                Path.Combine(
                    Application.dataPath, "./SeinJSUnityToolkit/config.json"),
                    config.ToString()
                );
            }
        }
        GUILayout.EndHorizontal();

        GUILayout.Label("Texture properties", EditorStyles.boldLabel);

        Exporter.opt_forcePNG = EditorGUILayout.Toggle("Force export as png", Exporter.opt_forcePNG);
        GUILayout.Label("Texture max size");
        Exporter.opt_maxSize = EditorGUILayout.IntField(Exporter.opt_maxSize);
        GUILayout.Label("Texture jpg quality");
        Exporter.opt_jpgQuality = EditorGUILayout.IntField(Exporter.opt_jpgQuality);
        GUILayout.Space(SPACE_SIZE);

        GUILayout.Label("Options", EditorStyles.boldLabel);
        //opt_exportAnimation = EditorGUILayout.Toggle("Export animation", opt_exportAnimation);
        opt_splitChunks = EditorGUILayout.Toggle("Split Chunks", opt_splitChunks);
        opt_exportLightMap = EditorGUILayout.Toggle("Export LightMap", opt_exportLightMap);
        opt_exportEnvLight = EditorGUILayout.Toggle("Export Env Light", opt_exportEnvLight);

        //GUILayout.Label("Lights", EditorStyles.boldLabel);
        //EditorGUIUtility.labelWidth = 200;
        //opt_halfSpotAngle = EditorGUILayout.Toggle("Half spot angle(Hilo3d, Threejs...)", Exporter.opt_halfSpotAngle);
        //opt_quadraticAttenuation = EditorGUILayout.Toggle("Light quadratic attenuation(Hilo3d...)", Exporter.opt_quadraticAttenuation);

        GUILayout.Label("Materials", EditorStyles.boldLabel);
        opt_noLighting = EditorGUILayout.Toggle("Unlit(Always for mobile)", Exporter.opt_noLighting);

        //GUILayout.Space(SPACE_SIZE);
        bool enable = updateExporterStatus();

		if (enable)
			GUI.color = blueColor;
		else
			GUI.color = greyColor;

		GUILayout.BeginHorizontal();
		GUILayout.FlexibleSpace();
		if (GUILayout.Button ("Export", GUILayout.Width(250), GUILayout.Height(40))) {
            if (!Directory.Exists(exportFolder))
            {
                EditorUtility.DisplayDialog("Error", "Folder for exporting is not existed: \"" + exportFolder + "\"", "OK");
                return;
            }
            exportPath = Path.Combine(exportFolder, param_name + ".gltf");
            zipPath = Path.Combine(exportFolder, param_name + ".zip");
            if (File.Exists(zipPath))
            {
                File.Delete(zipPath);
            }

            DirectoryInfo directory = new DirectoryInfo(exportFolder);
            var files = directory.GetFiles();
            var subDirectories = directory.GetDirectories();

            if (
                exportFolder != defaultExportFolder
                && (files.Length > 0 || subDirectories.Length > 0)
            )
            {
                if (EditorUtility.DisplayDialog(
                    "This folder is not empty",
                    "If your export gltf here, all files and sub directories will be deleted !",
                    "Continue",
                    "Cancel"
                ))
                {
                    //delete files:
                    foreach (System.IO.FileInfo file in files)
                        file.Delete();
                    //delete directories in this directory:
                    foreach (System.IO.DirectoryInfo subDirectory in subDirectories)
                        subDirectory.Delete(true);

                    exporter.ExportCoroutine(exportPath, null, false, true, opt_exportAnimation, true);
                    OpenInFileBrowser.Open(Path.GetDirectoryName(exportPath));
                }

                return;
            }

            //delete files:
            foreach (System.IO.FileInfo file in files)
                file.Delete();
            //delete directories in this directory:
            foreach (System.IO.DirectoryInfo subDirectory in subDirectories)
                subDirectory.Delete(true);
           
            exporter.ExportCoroutine(exportPath, null, false, true, opt_exportAnimation, true);
			OpenInFileBrowser.Open(Path.GetDirectoryName(exportPath));
		}
	}

	void OnDestroy()
	{
		if (System.IO.File.Exists(zipPath))
			System.IO.File.Delete(zipPath);

		if (exporterGo)
		{
			DestroyImmediate(exporterGo);
			exporter = null;
		}
	}
}
#endif