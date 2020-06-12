/**
 * @File   : ExportorSettings.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/09/09 0:00:00PM
 */
using System;
using System.IO;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace SeinJS
{
    public enum ENormalTextureType
	{
        JPG,
		PNG,
		//KTX,
	}

    public enum EPNGTextureFormat
    {
        RGBA32 = TextureFormat.RGBA32,
        RGBA4444 = TextureFormat.RGBA4444
    }

    public enum EHDRTextureType
	{
        DEFAULT,
		RGBD,
		HDR,
		EXR
	}

	public class ExporterSettings
	{
        public class Export
		{
			public static string folder = "";
			public static string name = "";
            public static bool clear = false;
            public static bool checkEmpty = true;
            public static bool splitChunks = false;
            public static bool skybox = false;
            public static bool noVertexColor = false;
            public static bool unlit = false;

            public static void UpdateFolder(string folder)
			{
                if (folder.Substring(0, 1) == ".")
                {
                    Config.SetExportPath(folder);
                }
                else
                {
                    Config.SetExportPath(Utils.MakeRelativePath(Config.AppDataPath, folder));
                }

                Export.folder = Path.GetFullPath(Path.Combine(Config.AppDataPath, Config.GetExportPath()));
            }

            public static void UpdateFolderTemp(string folder)
            {
                if (folder.Substring(0, 1) != ".")
                {
                     folder = Utils.MakeRelativePath(Config.AppDataPath, folder);
                }

                Export.folder = Path.GetFullPath(Path.Combine(Config.AppDataPath, folder));
            }

            public static string GetExportPath(string n = null)
			{
                if (n == null)
                {
                    n = name;
                }

				return Path.Combine(folder, n + ".gltf");
			}
		}

        public class Animation
        {
            public static bool forceLinear = true;
        }

        public class NormalTexture
		{
			public static int maxSize = 1024;
			public static ENormalTextureType transparentType = ENormalTextureType.PNG;
            public static ENormalTextureType opaqueType = ENormalTextureType.JPG;
            public static EPNGTextureFormat pngFormat = EPNGTextureFormat.RGBA32;
			public static int jpgQulity = 85;
		}

        public class HDR
        {
            public static EHDRTextureType type = EHDRTextureType.RGBD;
        }

        public class CubeTexture
        {
            public static int maxSize = 1024;
        }

        public class Lighting {
            public static bool ambient = true;
			public static bool lightMap = true;
			public static int lightMapSize = 1024;
            public static bool reflection = true;
            public static int reflectionSize = 1024;
        }

        public static JObject Serialize()
        {
            var obj = new JObject(
                new JProperty("Export", new JObject(
                    new JProperty("folder", Export.folder),
                    new JProperty("name", Export.name),
                    new JProperty("splitChunks", Export.splitChunks),
                    new JProperty("skybox", Export.skybox),
                    new JProperty("unlit", Export.unlit),
                    new JProperty("noVertexColor", Export.noVertexColor),
                    new JProperty("checkEmpty", Export.checkEmpty),
                    new JProperty("clear", Export.clear)
                )),
                new JProperty("Animation", new JObject(
                    new JProperty("forceLinear", Animation.forceLinear)
                )),
                new JProperty("NormalTexture", new JObject(
                    new JProperty("maxSize", NormalTexture.maxSize),
                    new JProperty("transparentType", NormalTexture.transparentType),
                    new JProperty("opaqueType", NormalTexture.opaqueType),
                    new JProperty("pngFormat", NormalTexture.pngFormat),
                    new JProperty("jpgQulity", NormalTexture.jpgQulity)
                )),
                new JProperty("HDR", new JObject(
                    new JProperty("type", HDR.type)
                )),
                new JProperty("CubeTexture", new JObject(
                    new JProperty("maxSize", CubeTexture.maxSize)
                )),
                new JProperty("Lighting", new JObject(
                    new JProperty("ambient", Lighting.ambient),
                    new JProperty("lightMap", Lighting.lightMap),
                    new JProperty("lightMapSize", Lighting.lightMapSize),
                    new JProperty("reflection", Lighting.reflection),
                    new JProperty("reflectionSize", Lighting.reflectionSize)
                ))
            );

            return obj;
        }

        public static void Deserialize(JObject json)
        {
            if (json == null)
            {
                return;
            }

            if (json["Export"] != null)
            {
                var obj = (JObject)json["Export"];
                if (obj["folder"] != null){ Export.folder = (string)obj["folder"]; }
                if (obj["name"] != null) { Export.name = (string)obj["name"]; }
                if (obj["splitChunks"] != null) { Export.splitChunks = (bool)obj["splitChunks"]; }
                if (obj["skybox"] != null) { Export.skybox = (bool)obj["skybox"]; }
                if (obj["unlit"] != null) { Export.unlit = (bool)obj["unlit"]; }
                if (obj["noVertexColor"] != null) { Export.noVertexColor = (bool)obj["noVertexColor"]; }
                if (obj["checkEmpty"] != null) { Export.checkEmpty = (bool)obj["checkEmpty"]; }
                if (obj["clear"] != null) { Export.clear = (bool)obj["clear"]; }
            }

            if (json["Animation"] != null)
            {
                var obj = (JObject)json["Animation"];
                if (obj["forceLinear"] != null) { Animation.forceLinear = (bool)obj["forceLinear"]; }
            }

            if (json["NormalTexture"] != null)
            {
                var obj = (JObject)json["NormalTexture"];
                if (obj["maxSize"] != null) { NormalTexture.maxSize = (int)obj["maxSize"]; }
                if (obj["transparentType"] != null) { NormalTexture.transparentType = (ENormalTextureType)(int)obj["transparentType"]; }
                if (obj["opaqueType"] != null) { NormalTexture.opaqueType = (ENormalTextureType)(int)obj["opaqueType"]; }
                if (obj["pngFormat"] != null) { NormalTexture.pngFormat = (EPNGTextureFormat)(int)obj["pngFormat"]; }
                if (obj["jpgQulity"] != null) { NormalTexture.jpgQulity = (int)obj["jpgQulity"]; }
            }

            if (json["HDR"] != null)
            {
                var obj = (JObject)json["HDR"];
                if (obj["type"] != null) { HDR.type = (EHDRTextureType)(int)obj["type"]; }
            }

            if (json["CubeTexture"] != null)
            {
                var obj = (JObject)json["CubeTexture"];
                if (obj["maxSize"] != null) { CubeTexture.maxSize = (int)obj["maxSize"]; }
            }

            if (json["Lighting"] != null)
            {
                var obj = (JObject)json["Lighting"];
                if (obj["ambient"] != null) { Lighting.ambient = (bool)obj["ambient"]; }
                if (obj["lightMap"] != null) { Lighting.lightMap = (bool)obj["lightMap"]; }
                if (obj["lightMapSize"] != null) { Lighting.lightMapSize = (int)obj["lightMapSize"]; }
                if (obj["reflection"] != null) { Lighting.reflection = (bool)obj["reflection"]; }
                if (obj["reflectionSize"] != null) { Lighting.reflectionSize = (int)obj["reflectionSize"]; }
            }
        }
    }
}
