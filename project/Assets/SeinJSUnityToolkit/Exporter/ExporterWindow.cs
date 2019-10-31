/**
 * @File   : ExportorWindow.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/09/09 0:00:00PM
 */
#if UNITY_EDITOR

using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using System.IO;

namespace SeinJS {

    public class ExporterWindow : EditorWindow {

        [MenuItem("SeinJS/Export to GlTF", priority = 0)]
	    static void Init()
	    {
#if UNITY_STANDALONE_WIN || UNITY_STANDALONE_OSX
            ExporterWindow window = (ExporterWindow)GetWindow(typeof(ExporterWindow));
		    window.titleContent.text = "Export to GlTF";
		    window.Show();
#else // and error dialog if not standalone
		    EditorUtility.DisplayDialog("Error", "Your build target must be set to standalone", "Okay");
#endif
            if (!Utils.inited)
            {
                Utils.Init();
            }

            ExtensionManager.Init();
        }

        public static GameObject tempGoForSein = null;

        // UI dimensions (to be cleaned)
        [SerializeField]
	    Vector2 fullSize = new Vector2(620, 660);

	    // Exporter UI: static elements
	    [SerializeField]
	    GUIStyle exporterTextArea;
	    GUIStyle exporterLabel;
	    GUIStyle exporterClickableLabel;
        int SPACE_SIZE = 10;

        Rect windowRect;
        private Exporter _exporter;
        
        void Awake()
	    {
            _exporter = new Exporter();
            ExporterSettings.Export.UpdateFolder(Config.GetExportPath());

            if (!Directory.Exists(ExporterSettings.Export.folder))
            {
                Directory.CreateDirectory(ExporterSettings.Export.folder);
            }

		    ResizeWindow(fullSize);
        }

	    void OnEnable()
	    {
            // Pre-fill model name with scene name if empty
            if (ExporterSettings.Export.name.Length == 0)
		    {
                ExporterSettings.Export.name = EditorSceneManager.GetActiveScene().name;
		    }
	    }

	    void ResizeWindow(Vector2 size)
	    {
		    //this.maxSize = size;
		    minSize = size;
	    }

	    void ExpandWindow(bool expand)
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

	    void OnGUI()
	    {
            GUILayout.Label(Config.header);
            GUILayout.Label("Version: " + Config.Version, EditorStyles.boldLabel);

            string defaultExportFolder = Config.DefaultExportFolder;

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

		    GUILayout.Label("Export Settings(导出设置)", EditorStyles.boldLabel);

            GUILayout.Label("Name(场景名)");
		    ExporterSettings.Export.name = EditorGUILayout.TextField(ExporterSettings.Export.name);
		    GUILayout.Space(SPACE_SIZE);

            GUILayout.Label("Folder(目录)");
            GUILayout.BeginHorizontal();
            GUILayout.TextField(ExporterSettings.Export.folder, GUILayout.MinWidth(350), GUILayout.Height(21));
            GUILayout.FlexibleSpace();

            if (GUILayout.Button("Select Folder(选择目录)", GUILayout.Height(21), GUILayout.Width(150)))
            {
                var tmp= EditorUtility.OpenFolderPanel("Choose a folder", ExporterSettings.Export.folder, "");
                if (tmp != "")
                {
                    ExporterSettings.Export.UpdateFolder(tmp);
                }
            }
            GUILayout.EndHorizontal();

            ExporterSettings.Export.splitChunks = EditorGUILayout.Toggle("Split chunks(分割物体)", ExporterSettings.Export.splitChunks);

            GUILayout.Label("Normal Texture Settings(一般纹理设置)", EditorStyles.boldLabel);

            EditorGUIUtility.labelWidth = 200;
            ExporterSettings.NormalTexture.opaqueType = (ENormalTextureType)EditorGUILayout.EnumPopup("Opaque image type(不透明纹理)", ExporterSettings.NormalTexture.opaqueType);
            ExporterSettings.NormalTexture.transparentType = (ENormalTextureType)EditorGUILayout.EnumPopup("Transparent image type(透明纹理)", ExporterSettings.NormalTexture.transparentType);
            GUILayout.Label("Texture max size(纹理尺寸限制)");
            ExporterSettings.NormalTexture.maxSize = EditorGUILayout.IntField(ExporterSettings.NormalTexture.maxSize);
            GUILayout.Label("Texture jpg quality(JPG压缩率)");
            ExporterSettings.NormalTexture.jpgQulity = EditorGUILayout.IntField(ExporterSettings.NormalTexture.jpgQulity);
            GUILayout.Space(SPACE_SIZE);

            GUILayout.Label("Lighting Settings(光照设置)", EditorStyles.boldLabel);
            ExporterSettings.Lighting.ambient = EditorGUILayout.Toggle("Export ambient light(输出环境光)", ExporterSettings.Lighting.ambient);

            ExporterSettings.Lighting.lightMap = EditorGUILayout.Toggle("Export light map(输出光照贴图)", ExporterSettings.Lighting.lightMap);
            ExporterSettings.Lighting.lightMapType = (EHDRTextureType)EditorGUILayout.EnumPopup("Light map image type(编码类型)", ExporterSettings.Lighting.lightMapType);
            GUILayout.Label("Light map max size(贴图尺寸限制)");
            ExporterSettings.Lighting.lightMapSize = EditorGUILayout.IntField(ExporterSettings.Lighting.lightMapSize);

            ExporterSettings.Lighting.reflection = EditorGUILayout.Toggle("Export reflection(输出全局反射)", ExporterSettings.Lighting.reflection);
            ExporterSettings.Lighting.reflectionType = (EHDRTextureType)EditorGUILayout.EnumPopup("Reflection map image type(编码类型)", ExporterSettings.Lighting.reflectionType);
            GUILayout.Label("Reflection map max size(贴图尺寸限制)");
            ExporterSettings.Lighting.reflectionSize = EditorGUILayout.IntField(ExporterSettings.Lighting.reflectionSize);

		    GUILayout.BeginHorizontal();
		    if (GUILayout.Button ("Preview(预览)", GUILayout.Width(240), GUILayout.Height(40))) {
                var origFolder = ExporterSettings.Export.folder;
                var origSplit = ExporterSettings.Export.splitChunks;
                var origName = ExporterSettings.Export.name;
                ExporterSettings.Export.UpdateFolderTemp("../sein-previewer-temp-assets");
                ExporterSettings.Export.splitChunks = false;
                ExporterSettings.Export.name = "scene";
                var folder = ExporterSettings.Export.folder;

                try
                {
                    if (!Directory.Exists(folder))
                    {
                        Directory.CreateDirectory(folder);
                    }

                    DirectoryInfo directory = new DirectoryInfo(folder);
                    var files = directory.GetFiles();
                    var subDirectories = directory.GetDirectories();

                    StartExport(files, subDirectories, false);

                    Previewer.StartPreview();
                }
                finally
                {
                    ExporterSettings.Export.UpdateFolderTemp(origFolder);
                    ExporterSettings.Export.splitChunks = origSplit;
                    ExporterSettings.Export.name = origName;
                }
		    }
            GUILayout.FlexibleSpace();
            if (GUILayout.Button("Export(导出)", GUILayout.Width(240), GUILayout.Height(40)))
            {
                var folder = ExporterSettings.Export.folder;
                if (!Directory.Exists(folder))
                {
                    EditorUtility.DisplayDialog("Error", "Folder for exporting is not existed: \"" + folder + "\"", "OK");
                    return;
                }

                DirectoryInfo directory = new DirectoryInfo(folder);
                var files = directory.GetFiles();
                var subDirectories = directory.GetDirectories();

                if (
                    folder != defaultExportFolder
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
                        StartExport(files, subDirectories);
                    }

                    return;
                }

                StartExport(files, subDirectories);
            }

            GUILayout.EndHorizontal();
        }

        void StartExport(FileInfo[] files, DirectoryInfo[] subDirectories, bool openFolder = true)
        {
            //delete files:
            foreach (FileInfo file in files)
                file.Delete();
            //delete directories in this directory:
            foreach (DirectoryInfo subDirectory in subDirectories)
                subDirectory.Delete(true);

            _exporter.Export();

            if (openFolder)
            {
                OpenInFileBrowser.Open(Path.GetDirectoryName(ExporterSettings.Export.GetExportPath()));
            }
        }

	    void OnDestroy()
	    {

	    }
    }
}

#endif
