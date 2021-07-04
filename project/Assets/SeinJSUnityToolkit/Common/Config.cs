/**
 * @File   : config.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/09/09 0:00:00PM
 */
using System;
using UnityEngine;
using UnityEditor;
using Newtonsoft.Json.Linq;
using System.IO;
using Newtonsoft.Json;

namespace SeinJS
{
    public enum EImageChannel
    {
        R,
        G,
        B,
        A
    };

    public class Config
    {
        public static Version Version = new Version("1.2.7");
        public static string GeneratorName = "SEIN.JS Toolkit";
        public static string DefaultExportFolder = "../Output";
        public static string DefaultImportFolder = "./Resources";
        public static string AppDataPath;

        static string configPath = "";
        static string exportPath = "";
        static string importPath = "";

        public static Texture2D header;

        public static bool IsInMacOS
        {
            get
            {
                return UnityEngine.SystemInfo.operatingSystem.IndexOf("Mac OS") != -1;
            }
        }

        public static bool IsInWinOS
        {
            get
            {
                return UnityEngine.SystemInfo.operatingSystem.IndexOf("Windows") != -1;
            }
        }

        public static bool PathIsInProject(string path)
        {
            var root = Path.GetFullPath(Path.Combine(AppDataPath, "../../"));
            var unityRoot = Path.GetFullPath(Path.Combine(AppDataPath, "../"));
            var fullPath = Path.GetFullPath(path);

            if (fullPath.Contains(root) && !fullPath.Contains(unityRoot) && fullPath.Contains("assets") && (fullPath.Contains("models") || fullPath.Contains("gltfs")))
            {
                return true;
            }

            return false;
        }

        public static string GetExportPath()
		{
			return exportPath;
		}

		public static void SetExportPath(string value)
		{
			exportPath = value;
			Save();
		}

		public static string GetImportPath()
		{
			return importPath;
		}

		public static void SetImportPath(string value)
		{
			importPath = value;
			Save();
		}

		public static void Load()
		{
            AppDataPath = Application.dataPath;
            configPath = Path.Combine(Application.dataPath, "./seinjs.config.json");
            JObject config = new JObject();

            if (File.Exists(configPath))
            {
                config = JObject.Parse(File.ReadAllText(configPath));
            }

			exportPath = (string)config["exportPath"];
            if (string.IsNullOrEmpty(exportPath))
            {
                exportPath = DefaultExportFolder;
            }

            importPath = (string)config["importPath"];
            if (string.IsNullOrEmpty(importPath))
            {
                importPath = DefaultImportFolder;
            }

            if (IsInWinOS)
            {
                importPath = importPath.Replace("/", "\\");
                exportPath = exportPath.Replace("/", "\\");
            }
            else
            {
                importPath = importPath.Replace("\\", "/");
                exportPath = exportPath.Replace("\\", "/");
            }

            ExporterSettings.Deserialize((JObject)config["exporterSettings"]);

            if (File.Exists(configPath))
            {
                Save();
            }

            header = new Texture2D(1, 1);
			header.LoadImage(File.ReadAllBytes(Path.Combine(AppDataPath, "./SeinJSUnityToolkit/logo.jpg")));
			header.Apply();
		}

		public static void Save()
		{
			JObject config = new JObject(
                new JProperty("exportPath", exportPath),
                new JProperty("importPath", importPath),
                new JProperty("exporterSettings", ExporterSettings.Serialize())
            );
            Utils.SaveJson(config, configPath);
		}
	}
}
