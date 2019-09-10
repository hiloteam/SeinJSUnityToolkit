using System;

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

            public static void U
            internal static void UpdateFolder(string defaultExportFolder)
            {
                throw new NotImplementedException();
            }
            ateFolder(string folder)
			{
				Config.SetExportPath(Utils.MakeRelativePath(Application.dataPath, folder));
				ExporterSettings.Export.folder = Path.GetFullPath(Path.Combine(Application.dataPath, Config.GetExportPath()));
			}

            public static string GetExportPath()
			{
				return Path.Combine(folder, name + ".gltf");
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
		    public static bool ambient = false;
			public static bool lightMap = true;
			public static int lightMapSize = 1024;
			public static EHDRTextureType lightMapType = EHDRTextureType.RGBD;
			public static bool reflection = true;
			public static int reflectionSize = 1024;
			public static EHDRTextureType reflectionType = EHDRTextureType.RGBD;
		}
	}
}
