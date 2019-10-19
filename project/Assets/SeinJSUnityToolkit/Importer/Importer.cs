/*
 * Copyright(c) 2017-2018 GlTF Inc.
 * License: https://github.com/sketchfab/UnityGLTF/blob/master/LICENSE
 */
#if UNITY_EDITOR
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityGLTF;
using Ionic.Zip;

namespace SeinJS
{
	class GlTFImporter
	{
		EditorImporter _importer;
		private List<string> _unzippedFiles;

		// Settings
		string _unzipDirectory = Application.temporaryCachePath + "/unzip";
		string _importDirectory = Application.dataPath + "/Resources";
		string _currentSampleName = "Imported";
		bool _addToCurrentScene = false;
        bool _generateLightMapUvs = false;
        string _gltfInput;

		public GlTFImporter(EditorImporter.ProgressCallback progressCallback, EditorImporter.RefreshWindow finishCallback)
		{
			_importer = new EditorImporter(progressCallback, finishCallback);
			_unzippedFiles = new List<string>();
		}

		public void Update()
		{
			_importer.Update();
		}

		public void configure(string importDirectory, string prefabName, bool addToScene = false, bool generateLightMapUvs = false)
		{

			if (importDirectory.Length > 0)
			{
				if (!GLTFUtils.isFolderInProjectDirectory(importDirectory))
				{
					Debug.LogError("Import directory in not in Assets/Resources");
				}
				else
				{
					_importDirectory = importDirectory;
				}
			}

			if (prefabName.Length > 0)
				_currentSampleName = prefabName;

			_addToCurrentScene = addToScene;
            _generateLightMapUvs = generateLightMapUvs;
        }

		private string findGltfFile(string directory)
		{
			string gltfFile = "";
			DirectoryInfo info = new DirectoryInfo(directory);
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

		private void deleteExistingGLTF()
		{
			string gltfFile = findGltfFile(_unzipDirectory);
			if (gltfFile != "")
			{
				File.Delete(gltfFile);
			}
		}

		private string unzipGltfArchive(string zipPath)
		{
            if (Directory.Exists(_unzipDirectory))
                (new DirectoryInfo(_unzipDirectory)).Delete(true);

            Directory.CreateDirectory(_unzipDirectory);

			// Extract archive
			ZipFile zipfile = ZipFile.Read(zipPath);

			foreach (ZipEntry e in zipfile)
			{
				// check if you want to extract e or not
				_unzippedFiles.Add(_unzipDirectory + "/" + e.FileName);
				e.Extract(_unzipDirectory, ExtractExistingFileAction.OverwriteSilently);
			}

            string realDirectory = _unzipDirectory;
            foreach (string path in _unzippedFiles) {
                if (!path.Contains("__MACOSX") && Path.GetExtension(path) == ".gltf") {
                    realDirectory = Path.GetDirectoryName(path);
                }
            }


            return findGltfFile(realDirectory);
		}

		private string unzipGLTFArchiveData(byte[] zipData)
		{
			if (!Directory.Exists(_unzipDirectory))
				Directory.CreateDirectory(_unzipDirectory);
			else
				deleteExistingGLTF();

			MemoryStream stream = new MemoryStream(zipData);
			ZipFile zipfile = ZipFile.Read(stream);
			foreach (ZipEntry e in zipfile)
			{
				// check if you want to extract e or not
				_unzippedFiles.Add(_unzipDirectory + "/" + e.FileName);
				e.Extract(_unzipDirectory, ExtractExistingFileAction.OverwriteSilently);
			}

			return findGltfFile(_unzipDirectory);
		}

		private string stripProjectDirectory(string directory)
		{
			return directory.Replace(Application.dataPath, "Assets");
		}

		public void loadFromBuffer(byte[] data)
		{
			if (!GLTFUtils.isFolderInProjectDirectory(_importDirectory))
			{
				Debug.LogError("Import directory is outside of project directory. Please select path in Assets/Resources/");
				return;
			}

			if (!Directory.Exists(_importDirectory))
			{
				Directory.CreateDirectory(_importDirectory);
			}

			_gltfInput = unzipGLTFArchiveData(data);
			_importer.setupForPath(_gltfInput, _importDirectory, _currentSampleName, _addToCurrentScene, _generateLightMapUvs);
			_importer.Load();
		}

		public void loadFromFile(string filepath)
		{
			_gltfInput = filepath;

			if (!Directory.Exists(_importDirectory))
			{
				Directory.CreateDirectory(_importDirectory);
			}

			if (Path.GetExtension(filepath) == ".zip")
			{
				_gltfInput = unzipGltfArchive(filepath);
			}

			_importer.setupForPath(_gltfInput, _importDirectory, _currentSampleName, _addToCurrentScene, _generateLightMapUvs);
			_importer.Load();
		}

		public void cleanArtifacts()
		{
			GLTFUtils.removeFileList(_unzippedFiles.ToArray());
		}

		public void OnDestroy()
		{
			GLTFUtils.removeFileList(_unzippedFiles.ToArray());
			GLTFUtils.removeEmptyDirectory(_unzipDirectory);
		}
	}
}
#endif