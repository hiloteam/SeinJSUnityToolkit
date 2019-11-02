/**
 * @File   : ExportorSettings.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/09/09 0:00:00PM
 */
using System;
using System.IO;
using UnityEngine;

namespace SeinJS
{
    public enum ENormalTextureType
	{
        JPG,
		PNG,
		//KTX,
	}

	public enum EHDRTextureType
	{
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
			public static bool splitChunks = false;

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

		public class NormalTexture
		{
			public static int maxSize = 1024;
			public static ENormalTextureType transparentType = ENormalTextureType.PNG;
			public static ENormalTextureType opaqueType = ENormalTextureType.JPG;
			public static int jpgQulity = 85;
		}

		public class Lighting {
		    public static bool ambient = true;
			public static bool lightMap = true;
			public static int lightMapSize = 1024;
			public static EHDRTextureType lightMapType = EHDRTextureType.RGBD;
			public static bool reflection = true;
			public static int reflectionSize = 1024;
			public static EHDRTextureType reflectionType = EHDRTextureType.RGBD;
		}
	}
}
