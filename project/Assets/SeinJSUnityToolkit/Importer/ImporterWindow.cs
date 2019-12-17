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
using System;

namespace SeinJS
{
	class GlTFImporterWindow : EditorWindow
	{
        [MenuItem("SeinJS/Import GlTF", priority = 1)]
		static void Init()
		{
			GlTFImporterWindow window = (GlTFImporterWindow)EditorWindow.GetWindow(typeof(GlTFImporterWindow));
			window.titleContent.text = "Importer";
			window.Show(true);

            Config.Load();
            if (!Utils.inited)
            {
                Utils.Init();
            }

            ExtensionManager.Init();
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

        private List<string> _unzippedFiles;

		// UI elements
		Vector2 UI_SIZE = new Vector2(350, 21);
		float minWidthButton = 150;
		Vector2 _scrollView;
		string _sourceFileHint = "Select or drag and drop a file";

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
            _importDirectory = Config.GetImportPath();
            if (!Directory.Exists(_importDirectory))
            {
                Directory.CreateDirectory(_importDirectory);
            }
        }

        // UI
        private void OnGUI()
		{
			checkValidity();

            if (_ui == null)
				return;

            minSize = new Vector2(600, 360);

            GUILayout.Label(Config.header);
            GUILayout.Label("Version: " + Config.Version, EditorStyles.boldLabel);

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
                    Config.SetImportPath(newImportDir);
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
				_importDirectory = Config.GetImportPath();
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

                foreach (var dir in new DirectoryInfo(_importDirectory).GetDirectories())
                {
                    FileUtil.DeleteFileOrDirectory(dir.FullName);
                }
            }

            _importer.configure(_importDirectory, _currentSampleName, _addToCurrentScene, _generateLightMapUvs);
		    _importer.loadFromFile(_importFilePath);
		}

		public void UpdateProgress(string step, int current, int total)
		{
			EditorUtility.DisplayProgressBar("Importing glTF", "Importing " + step[0] + step.Substring(1).ToLower() + " (" + current + " / " + total + ")", (float)current / (float)total);
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