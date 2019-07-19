using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using SimpleJSON;

public class Preset {
	public class Shader {
		public string vertexShader;
		public string fragmentShader;
	}

	public Dictionary<string, Shader> shaderMap = new Dictionary<string, Shader>();

	const string DEFAULT_VERTEX_SHADER = "DefaultVS.glsl";
	const string DEFAULT_FRAGMENT_SHADER = "DefaultFS.glsl";

	public string GetVertexShader(string shaderName)
	{
		if (shaderMap.ContainsKey(shaderName))
		{
			var s = shaderMap[shaderName];
			return s.vertexShader;
		}
		return DEFAULT_VERTEX_SHADER;
	}

	public string GetFragmentShader(string shaderName)
	{
		if (shaderMap.ContainsKey(shaderName))
		{
			var s = shaderMap[shaderName];
			return s.fragmentShader;
		}
		return DEFAULT_FRAGMENT_SHADER;
	}

	public void Load(string path)
	{
		var text = File.ReadAllText(path);
		var obj = JSON.Parse(text);
		var sm = obj["ShaderMap"];

		shaderMap.Clear();
		foreach (var smc in sm.AsObject.Dict)
		{
			Shader shader = new Shader();
			shader.vertexShader = smc.Value["shaders"]["vertexShader"];
			shader.fragmentShader = smc.Value["shaders"]["fragmentShader"];
			shaderMap[smc.Key] = shader;
		}
	}
}
