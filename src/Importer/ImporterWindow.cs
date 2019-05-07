/*
 * Copyright(c) 2017-2018 GlTF Inc.
 * License: https://github.com/sketchfab/UnityGLTF/blob/master/LICENSE
 */
#if UNITY_EDITOR
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEditor;
using Ionic.Zip;
using SimpleJSON;

namespace GlTF
{
	class GlTFImporterWindow : EditorWindow
	{
        [MenuItem("SeinJS/Import GlTF")]
		static void Init()
		{
			GlTFImporterWindow window = (GlTFImporterWindow)EditorWindow.GetWindow(typeof(GlTFImporterWindow));
			window.titleContent.text = "Importer";
			window.Show(true);
		}

		// GlTF elements
		GlTFUI _ui;
		GlTFImporter _importer;

		// Import paths and options
		string _unzipDirectory = "";
		string _importFilePath = "";
		string _defaultImportDirectory = "";
		string _importDirectory = "";

		static string _currentSampleName = "Imported";
		bool _addToCurrentScene = false;
        bool _generateLightMapUvs = false;

        private JSONNode config;
        private List<string> _unzippedFiles;

		// UI elements
		Vector2 UI_SIZE = new Vector2(350, 21);
		float minWidthButton = 150;
		Vector2 _scrollView;
		string _sourceFileHint = "Select or drag and drop a file";
        Texture2D header;

        private void Initialize()
		{
			_importer = new GlTFImporter(UpdateProgress, OnFinishImport);
			_unzippedFiles = new List<string>();
			_unzipDirectory = Application.temporaryCachePath + "/unzip";
			_defaultImportDirectory = Application.dataPath + "/Resources";
			_importDirectory = _defaultImportDirectory;
			_importFilePath = _sourceFileHint;
            _ui = new GlTFUI();
		}

		private void Update()
		{
			if (_importer != null)
				_importer.Update();

		}

		void OnCheckVersionFailure()
		{
			Debug.Log("Failed to retrieve Plugin version");
		}

		private string findGltfFile()
		{
			string gltfFile = "";
			DirectoryInfo info = new DirectoryInfo(_unzipDirectory);
			foreach (FileInfo fileInfo in info.GetFiles())
			{
				_unzippedFiles.Add(fileInfo.FullName);
				if (Path.GetExtension(fileInfo.FullName) == ".gltf")
				{
					gltfFile = fileInfo.FullName;
				}
			}

			return gltfFile;
		}

		private string unzipGltfArchive(string zipPath)
		{
			if (!Directory.Exists(_unzipDirectory))
				Directory.CreateDirectory(_unzipDirectory);

			// Clean previously unzipped files
			GLTFUtils.removeFileList(_unzippedFiles.ToArray());
			string gltfFile = findGltfFile();
			if (gltfFile != "")
			{
				File.Delete(gltfFile);
			}

			// Extract archive
			ZipFile zipfile = ZipFile.Read(zipPath);
			zipfile.ExtractAll(_unzipDirectory, ExtractExistingFileAction.OverwriteSilently);

			return findGltfFile();
		}

		private string unzipGltfArchive(byte[] zipData)
		{


			return findGltfFile();
		}

		private void checkValidity()
		{
			if(_ui == null)
			{
				_ui = new GlTFUI();
			}
			if (_importer == null)
			{
				Initialize();
			}
		}

		private void handleDragNDrop()
		{
			DragAndDrop.visualMode = DragAndDropVisualMode.Generic;

			if (Event.current.type == EventType.DragExited)
			{
				if (DragAndDrop.paths.Length > 0)
				{
					_importFilePath = DragAndDrop.paths[0];
					string modelfileName = Path.GetFileNameWithoutExtension(_importFilePath);
					_importDirectory = GLTFUtils.unifyPathSeparator(Path.Combine(_defaultImportDirectory, modelfileName));
					_currentSampleName = modelfileName;
				}
			}
		}

        void Awake()
        {
            config = JSON.Parse(File.ReadAllText(Path.Combine(Application.dataPath, "./SeinJSUnityToolkit/config.json")));
            _importDirectory = Path.GetFullPath(Path.Combine(Application.dataPath, config["importPath"]));
            if (!Directory.Exists(_importDirectory))
            {
                Directory.CreateDirectory(_importDirectory);
            }
        }

        private void OnEnable()
        {
            if (!header)
            {
                header = new Texture2D(1, 1);
                header.LoadImage(File.ReadAllBytes(Application.dataPath + "/SeinJSUnityToolkit/logo.png"));
                header.Apply();
            }
        }

        // UI
        private void OnGUI()
		{
			checkValidity();

            if (_ui == null)
				return;

            minSize = new Vector2(600, 360);

            GUILayout.BeginHorizontal();
            GUILayout.FlexibleSpace();
            GUILayout.Label(header);
            GUILayout.FlexibleSpace();
            GUILayout.EndHorizontal();

            handleDragNDrop();

			_scrollView = GUILayout.BeginScrollView(_scrollView);
            displayInputInfos();
			displayImportDirectory();
			displayImportOptions();
			GUILayout.EndScrollView();

            displayImportButton();
		}

		private void displayInputInfos()
		{
			GUILayout.Label("Import a glTF (*.gltf, *.glb, *.zip)", _ui.sketchfabModelName);

			_ui.displaySubContent("Source file:");
			GUILayout.BeginHorizontal();
			Color backup = GUI.color;
			if (_importFilePath == _sourceFileHint)
				GUI.contentColor = Color.red;

			GUILayout.TextField(_importFilePath, GUILayout.MinWidth(UI_SIZE.x), GUILayout.Height(UI_SIZE.y));
			GUI.contentColor = backup;
			GUILayout.FlexibleSpace();
			if (GUILayout.Button("Select file", GUILayout.Height(UI_SIZE.y), GUILayout.Width(minWidthButton)))
			{
                _importFilePath = EditorUtility.OpenFilePanel("Choose gltf or zip file", "", "zip,gltf,glb");

                string modelfileName = Path.GetFileNameWithoutExtension(_importFilePath);
                _importDirectory = GLTFUtils.unifyPathSeparator(Path.Combine(_defaultImportDirectory, modelfileName));
                _currentSampleName = modelfileName;
			}

			GUILayout.EndHorizontal();
		}

		private void displayImportDirectory()
		{
			_ui.displaySubContent("Import into");
			GUILayout.BeginHorizontal();
            _importDirectory = GUILayout.TextField(_importDirectory, GUILayout.MinWidth(UI_SIZE.x), GUILayout.Height(UI_SIZE.y));
			GUILayout.FlexibleSpace();
			if (GUILayout.Button("Change destination", GUILayout.Height(UI_SIZE.y), GUILayout.Width(minWidthButton)))
			{
                string newImportDir = EditorUtility.OpenFolderPanel("Choose import directory", _importDirectory, "");
                if (newImportDir == "")
                {

                }
                else if (GLTFUtils.isFolderInProjectDirectory(newImportDir))
				{
                    _importDirectory = config["importPath"] = Exporter.MakeRelativePath(Application.dataPath, newImportDir);
                    File.WriteAllText(
                        Path.Combine(Application.dataPath, "./SeinJSUnityToolkit/config.json"),
                        config.ToString()
                    );
                }
				else
				{
					EditorUtility.DisplayDialog("Error", "Please select a path within your current Unity project (with Assets/)", "Ok");
				}
			}
			GUILayout.EndHorizontal();
		}

		private void displayImportOptions()
		{
			GUILayout.Space(2);
			_ui.displaySubContent("Options");
			GUILayout.BeginHorizontal();

			GUILayout.Label("Prefab name: ", GUILayout.Height(UI_SIZE.y));

			_currentSampleName = GUILayout.TextField(_currentSampleName, GUILayout.MinWidth(200), GUILayout.Height(UI_SIZE.y));
			GUILayout.FlexibleSpace();
			GUILayout.EndHorizontal();

            _generateLightMapUvs = GUILayout.Toggle(_generateLightMapUvs, "Generate LightMap Uvs to channel 2");
            _addToCurrentScene = GUILayout.Toggle(_addToCurrentScene, "Add to current scene");
			GUILayout.Space(2);
		}

		private void displayImportButton()
		{
			GUILayout.BeginHorizontal();
			Color old = GUI.color;
			GUI.color = GlTFUI.SKFB_BLUE;
			GUI.contentColor = Color.white;
			GUI.enabled = GLTFUtils.isFolderInProjectDirectory(_importDirectory) && File.Exists(_importFilePath);
			if (GUILayout.Button("IMPORT", _ui.GlTFButton))
			{
				processImportButton();
			}
			GUI.color = old;
			GUI.enabled = true;
			GUILayout.EndHorizontal();
		}

		private void emptyLines(int nbLines)
		{
			for (int i = 0; i < nbLines; ++i)
			{
				GUILayout.Label("");
			}
		}

		private void changeDirectory()
		{
			_importDirectory = EditorUtility.OpenFolderPanel("Choose import directory in Project", Application.dataPath, "Assets");

			// Discard if selected directory is outside of the project
			if (!isDirectoryInProject())
			{
				Debug.Log("Import directory is outside of project directory. Please select path in Assets/");
				_importDirectory = Path.GetFullPath(Path.Combine(Application.dataPath, config["importPath"]));
				return;
			}
		}

		private bool isDirectoryInProject()
		{
			return _importDirectory.Contains(Application.dataPath) || !_importDirectory.Contains("/Resources");
		}

		private void processImportButton()
		{
			if (!isDirectoryInProject())
			{
				Debug.LogError("Import directory is outside of project directory. Please select path in Assets/");
				return;
			}

            if (Directory.Exists(_importDirectory))
            {
                if (!EditorUtility.DisplayDialog(
                    "Resources already existed",
                    "Are you sure you want to replace it? Don't forget to sync your prefab if necessary !",
                    "Replace",
                    "Cancel"
                ))
                {
                    return;
                }
            }

            _importer.configure(_importDirectory, _currentSampleName, _addToCurrentScene, _generateLightMapUvs);
			_importer.loadFromFile(_importFilePath);
		}

		public void UpdateProgress(UnityGLTF.GLTFEditorImporter.IMPORT_STEP step, int current, int total)
		{
			string element = "";
			switch (step)
			{
				case UnityGLTF.GLTFEditorImporter.IMPORT_STEP.BUFFER:
					element = "Buffer";
					break;
				case UnityGLTF.GLTFEditorImporter.IMPORT_STEP.IMAGE:
					element = "Image";
					break;
				case UnityGLTF.GLTFEditorImporter.IMPORT_STEP.TEXTURE:
					element = "Texture";
					break;
				case UnityGLTF.GLTFEditorImporter.IMPORT_STEP.MATERIAL:
					element = "Material";
					break;
				case UnityGLTF.GLTFEditorImporter.IMPORT_STEP.MESH:
					element = "Mesh";
					break;
                case UnityGLTF.GLTFEditorImporter.IMPORT_STEP.AUDIO:
                    element = "AudioClips";
                    break;
                case UnityGLTF.GLTFEditorImporter.IMPORT_STEP.NODE:
					element = "Node";
					break;
				case UnityGLTF.GLTFEditorImporter.IMPORT_STEP.ANIMATION:
					element = "Animation";
					break;
				case UnityGLTF.GLTFEditorImporter.IMPORT_STEP.SKIN:
					element = "Skin";
					break;
                case UnityGLTF.GLTFEditorImporter.IMPORT_STEP.SKINNEDMESH:
                    element = "SkinnedMesh";
                    break;
            }

			EditorUtility.DisplayProgressBar("Importing glTF", "Importing " + element + " (" + current + " / " + total + ")", (float)current / (float)total);
			this.Repaint();
		}

		private void OnFinishImport()
		{
			EditorUtility.ClearProgressBar();
			EditorUtility.DisplayDialog("Import successful", "Model has been successfully imported", "OK");
		}

		public void OnDestroy()
		{
			GLTFUtils.removeFileList(_unzippedFiles.ToArray());
			GLTFUtils.removeEmptyDirectory(_unzipDirectory);
		}
	}
}

#endif