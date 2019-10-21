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
        A,
        G_INVERT
    };

    public class Config
	{
        public static string GeneratorName = "Sein.js Unity Toolkit";
        public static string DefaultExportFolder = "../Output";
        public static string DefaultImportFolder = "./Resources";

        static bool inited = false;
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

        public static string GetExportPath()
		{
			Init();
			return exportPath;
		}

		public static void SetExportPath(string value)
		{
			exportPath = value;
			Save();
		}

		public static string GetImportPath()
		{
			Init();
			return importPath;
		}

		public static void SetImportPath(string value)
		{
			importPath = value;
			Save();
		}

		public static void Init()
		{
            if (inited)
			{
				return;
			}

			configPath = Path.Combine(Application.dataPath, "./SeinJSUnityToolkit/config.json");
			JObject config = JObject.Parse(File.ReadAllText(configPath));

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

            header = new Texture2D(1, 1);
			header.LoadImage(File.ReadAllBytes(Path.Combine(Application.dataPath, "./SeinJSUnityToolkit/logo.jpg")));
			header.Apply();
		}

		static void Save()
		{
			JObject config = new JObject(new JProperty("exportPath", exportPath), new JProperty("importPath", importPath));

            var serializer = new JsonSerializer();
            serializer.NullValueHandling = NullValueHandling.Ignore;
            using (var sw = new StreamWriter(configPath))
            using (var writer = new JsonTextWriter(sw))
            {
                serializer.Serialize(writer, config);
            }
		}
	}
}
