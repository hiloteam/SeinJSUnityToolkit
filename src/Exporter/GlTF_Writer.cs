#if UNITY_EDITOR
using UnityEngine;
using System.Collections;
using System.IO;
using System.Collections.Generic;
using System.Text.RegularExpressions;

public class GlTF_Writer {
	public static FileStream fs;
	public static StreamWriter jsonWriter;
	public static BinaryWriter binWriter;
	public static Stream binFile;
	public static int indent = 0;
	public static string binFileName;
	public static bool binary;
	static bool[] firsts = new bool[100];
	public static GlTF_BufferView ushortBufferView = new GlTF_BufferView("ushortBufferView", 0, 34963);
	public static GlTF_BufferView floatBufferView = new GlTF_BufferView("floatBufferView", 0);
	public static GlTF_BufferView vec2BufferView = new GlTF_BufferView("vec2BufferView", 8);
	public static GlTF_BufferView vec3BufferView = new GlTF_BufferView("vec3BufferView", 12);
	public static GlTF_BufferView vec4BufferView = new GlTF_BufferView("vec4BufferView", 16);
	public static GlTF_BufferView vec4UshortBufferView = new GlTF_BufferView("vec4UshortBufferView", 8);
	public static GlTF_BufferView mat4BufferView = new GlTF_BufferView("mat4BufferView", 64);

	public static GlTF_BufferView vec3BufferViewAnim = new GlTF_BufferView("vec3BufferViewAnim", 12);
	public static GlTF_BufferView vec4BufferViewAnim = new GlTF_BufferView("vec4BufferViewAnim", 16);

	public static List<GlTF_BufferView> bufferViews = new List<GlTF_BufferView>();
	public static List<GlTF_Camera> cameras = new List<GlTF_Camera>();
	public static List<GlTF_Light> lights = new List<GlTF_Light>();
	public static List<GlTF_Mesh> meshes = new List<GlTF_Mesh>();
    public static Dictionary<Mesh, Dictionary<string, GlTF_Mesh>> exportMeshes = new Dictionary<Mesh, Dictionary<string, GlTF_Mesh>>();
    public static List<GlTF_Accessor> accessors = new List<GlTF_Accessor>();

	public static List<int> nodeIDs = new List<int>();
	public static List<GlTF_Node> nodes = new List<GlTF_Node>();
    public static Dictionary<int, string> nodeNames = new Dictionary<int, string>();
    public static Dictionary<Transform, GlTF_Node> nodeTransforms = new Dictionary<Transform, GlTF_Node>();

    public static List<string> materialNames = new List<string>();
	public static List<GlTF_Material> materials = new List<GlTF_Material>();
	public static List<string> samplerNames = new List<string>();
	public static List<GlTF_Sampler> samplers = new List<GlTF_Sampler>();

	public static List<string> textureNames = new List<string>();
	public static List<GlTF_Texture> textures = new List<GlTF_Texture>();

	public static List<string> imageNames = new List<string>();
	public static List<GlTF_Image> images = new List<GlTF_Image>();
	public static List<GlTF_Animation> animations = new List<GlTF_Animation>();
    public static List<string> animationNames = new List<string>();

    public static List<string> techniqueNames = new List<string>();
	public static List<GlTF_Technique> techniques = new List<GlTF_Technique>();

	public static List<GlTF_Program> programs = new List<GlTF_Program>();
	public static List<GlTF_Shader> shaders = new List<GlTF_Shader>();
    public static List<string> shaderPathes = new List<string>();
    public static List<GlTF_Skin> skins = new List<GlTF_Skin>();
	public static List<GlTF_Node> rootNodes = new List<GlTF_Node>();

    public static List<SeinAudioClip> audioClips = new List<SeinAudioClip>();
    public static Dictionary<SeinAudioClip, string> audioClipURIs = new Dictionary<SeinAudioClip, string>();

    // Keys are original file path, values correspond to the directory in the output zip file
    public static Dictionary<string, string> exportedFiles = new Dictionary<string, string>();
	// Exporter specifics
	public static bool bakeAnimation;
	public static bool exportPBRMaterials;
	public static bool hasSpecularMaterials = false;
	public static bool convertRightHanded = true;
	public static string exporterVersion = "0.8.0";
	public static Regex rgx = new Regex("[^a-zA-Z0-9-_.]");
    public static Regex rgxPath = new Regex("[^a-zA-Z0-9-_./]");

    static public string cleanNonAlphanumeric(string s)
	{
		return rgx.Replace(s, "");
	}
    static public string cleanPath(string s)
    {
        return rgxPath.Replace(s, "").ToLower();
    }
    static public string GetNameFromObject(Object o, bool useId = false)
	{
        if (o == null)
        {
            return "";
        }
        var ret = cleanNonAlphanumeric(o.name);
		if (useId)
		{
			ret += "_" + o.GetInstanceID();
		}
		return ret;
	}

	public void convertVector3LeftToRightHandedness(ref Vector3 vect)
	{
		vect.z = -vect.z;
	}

	public void convertVector4LeftToRightHandedness(ref Vector4 vect)
	{
		vect.z = -vect.z;
		vect.w = -vect.w;
	}

	public void convertQuatLeftToRightHandedness(ref Quaternion quat)
	{
		quat.w = -quat.w;
		quat.z = -quat.z;
	}

	// Decomposes a matrix, converts each component from left to right handed and
	// rebuilds a matrix
	// FIXME: there is probably a better way to do that. It doesn't work well with non uniform scales
	public void convertMatrixLeftToRightHandedness(ref Matrix4x4 mat)
	{
		Vector3 position = mat.GetColumn(3);
		convertVector3LeftToRightHandedness(ref position);
		Quaternion rotation = Quaternion.LookRotation(mat.GetColumn(2), mat.GetColumn(1));
		convertQuatLeftToRightHandedness(ref rotation);

		Vector3 scale = new Vector3(mat.GetColumn(0).magnitude, mat.GetColumn(1).magnitude, mat.GetColumn(2).magnitude);
		float epsilon = 0.00001f;

		// Some issues can occurs with non uniform scales
		if(Mathf.Abs(scale.x - scale.y) > epsilon  || Mathf.Abs(scale.y - scale.z) > epsilon || Mathf.Abs(scale.x - scale.z) > epsilon)
		{
			Debug.LogWarning("A matrix with non uniform scale is being converted from left to right handed system. This code is not working correctly in this case");
		}

		// Handle negative scale component in matrix decomposition
		if (Matrix4x4.Determinant(mat) < 0)
		{
			Quaternion rot = Quaternion.LookRotation(mat.GetColumn(2), mat.GetColumn(1));
			Matrix4x4 corr = Matrix4x4.TRS(mat.GetColumn(3), rot, Vector3.one).inverse;
			Matrix4x4 extractedScale = corr * mat;
			scale = new Vector3(extractedScale.m00, extractedScale.m11, extractedScale.m22);
		}

		// convert transform values from left handed to right handed
		mat.SetTRS(position, rotation, scale);
	}

	public void Init()
	{
		firsts = new bool[100];
		ushortBufferView = new GlTF_BufferView("ushortBufferView", 0, 34963);
		floatBufferView = new GlTF_BufferView("floatBufferView", 0);
		vec2BufferView = new GlTF_BufferView("vec2BufferView", 8);
		vec3BufferView = new GlTF_BufferView("vec3BufferView", 12);
		vec4BufferView = new GlTF_BufferView("vec4BufferView", 16);
		vec4UshortBufferView = new GlTF_BufferView("vec4iBufferView", 8);
		mat4BufferView = new GlTF_BufferView("mat4BufferView", 64);
		
		//Animation
		vec3BufferViewAnim = new GlTF_BufferView("vec3BufferViewAnim", 12);
		vec4BufferViewAnim = new GlTF_BufferView("vec4BufferViewAnim", 16);

		vec2BufferView.target = (int)GlTF_BufferView.TARGET.ARRAY;
		vec3BufferView.target = (int)GlTF_BufferView.TARGET.ARRAY;
		vec4BufferView.target = (int)GlTF_BufferView.TARGET.ARRAY;
		ushortBufferView.target = (int)GlTF_BufferView.TARGET.ELEMENT;

		bufferViews = new List<GlTF_BufferView>();
		cameras = new List<GlTF_Camera>();
		lights = new List<GlTF_Light>();
		meshes = new List<GlTF_Mesh>();
        exportMeshes = new Dictionary<Mesh, Dictionary<string, GlTF_Mesh>>();
		accessors = new List<GlTF_Accessor>();

		nodes = new List<GlTF_Node>();
        nodeIDs = new List<int>();
        nodeNames = new Dictionary<int, string>();
        nodeTransforms = new Dictionary<Transform, GlTF_Node>();

        materialNames = new List<string>();
		materials = new List<GlTF_Material>();

		samplerNames = new List<string>();
		samplers = new List<GlTF_Sampler>();

		textureNames = new List<string>();
		textures = new List<GlTF_Texture>();

		imageNames = new List<string>();
		images = new List<GlTF_Image>();
		animations = new List<GlTF_Animation>();
        animationNames = new List<string>();

        techniqueNames = new List<string>();
		techniques = new List<GlTF_Technique>();

		programs = new List<GlTF_Program>();
		shaders = new List<GlTF_Shader>();
        shaderPathes = new List<string>();
		skins = new List<GlTF_Skin>();
		rootNodes = new List<GlTF_Node>();

        audioClips = new List<SeinAudioClip>();
        audioClipURIs = new Dictionary<SeinAudioClip, string>();

        bakeAnimation = true;
        hasSpecularMaterials = false;
    }

	public void Indent() {
		for (int i = 0; i < indent; i++)
			jsonWriter.Write ("\t");
	}

	public void IndentIn() {
		indent++;
		firsts[indent] = true;
	}

	public void IndentOut() {
		indent--;
	}

	public void CommaStart() {
		firsts[indent] = false;
	}

	public void CommaNL() {
		if (!firsts[indent])
			jsonWriter.Write (",\n");

		firsts[indent] = false;
	}

	public string id;
    public int uuid;
    public string name; // name of this object

	// Extra data for objects
	public Dictionary<string, string> extraString = new Dictionary<string, string>();
	public Dictionary<string, float> extraFloat = new Dictionary<string, float>();
	public Dictionary<string, bool> extraBool = new Dictionary<string, bool>();

	public void OpenFiles (string filepath) {
		fs = File.Open(filepath, FileMode.Create);
		exportedFiles.Add(filepath, "");  // Value is an empty string since we want the file at the root of the .zip file
		if (binary)
		{
			binWriter = new BinaryWriter(fs);
			binFile = fs;
			fs.Seek(20, SeekOrigin.Begin); // header skip
		}
		else
		{
			// separate bin file
			binFileName = Path.GetFileNameWithoutExtension(filepath) + ".bin";
			var binPath = Path.Combine(Path.GetDirectoryName(filepath), binFileName);
			exportedFiles.Add(binPath, "");  // Value is an empty string since we want the file at the root of the .zip file
			binFile = File.Open(binPath, FileMode.Create);
		}

		jsonWriter = new StreamWriter (fs);
	}

	public void CloseFiles() {
		if (binary)
		{
			binWriter.Close();
		}
		else
		{
			binFile.Close();
		}

		jsonWriter.Close ();
		fs.Close();
	}

	public void writeExtras()
	{
		if (extraFloat.Count > 0 || extraString.Count > 0 || extraBool.Count > 0)
		{
			Indent(); jsonWriter.Write("\"extras\": {\n");
			IndentIn();
			foreach (var s in extraString)
			{
				CommaNL();
				Indent(); jsonWriter.Write("\"" + s.Key + "\" : \"" + s.Value + "\"");
			}
			foreach (var s in extraFloat)
			{
				CommaNL();
				Indent(); jsonWriter.Write("\"" + s.Key + "\" : " + s.Value + "");
			}
			foreach (var s in extraBool)
			{
				CommaNL();
				Indent(); jsonWriter.Write("\"" + s.Key + "\" : " + (s.Value ? "true" : "false") + "");
			}
			IndentOut();
			jsonWriter.Write("\n");
			Indent(); jsonWriter.Write("},");
			jsonWriter.Write("\n");
		}
	}

	public virtual void Write () {

		if(ushortBufferView.byteLength > 0)
			bufferViews.Add (ushortBufferView);

		if (floatBufferView.byteLength > 0)
			bufferViews.Add (floatBufferView);

		if (vec2BufferView.byteLength > 0)
			bufferViews.Add (vec2BufferView);

		if (vec3BufferView.byteLength > 0)
			bufferViews.Add (vec3BufferView);

		if (vec4BufferView.byteLength > 0)
			bufferViews.Add (vec4BufferView);

		if (vec4UshortBufferView.byteLength > 0)
			bufferViews.Add(vec4UshortBufferView);

		if (mat4BufferView.byteLength > 0)
			bufferViews.Add (mat4BufferView);

		if (vec3BufferViewAnim.byteLength > 0)
			bufferViews.Add(vec3BufferViewAnim);

		if (vec4BufferViewAnim.byteLength > 0)
			bufferViews.Add(vec4BufferViewAnim);

		ushortBufferView.bin = binary;
		floatBufferView.bin = binary;
		vec2BufferView.bin = binary;
		vec3BufferView.bin = binary;
		vec4BufferView.bin = binary;
		vec4UshortBufferView.bin = binary;
		mat4BufferView.bin = binary;

		vec3BufferViewAnim.bin = binary;
		vec4BufferViewAnim.bin = binary;

		// write memory streams to binary file
		floatBufferView.byteOffset = 0;
		vec2BufferView.byteOffset = floatBufferView.byteOffset + floatBufferView.byteLength;
		vec3BufferView.byteOffset = vec2BufferView.byteOffset + vec2BufferView.byteLength;
		vec4BufferView.byteOffset = vec3BufferView.byteOffset + vec3BufferView.byteLength;
		vec4UshortBufferView.byteOffset = vec4BufferView.byteOffset + vec4BufferView.byteLength;
		mat4BufferView.byteOffset = vec4UshortBufferView.byteOffset + vec4UshortBufferView.byteLength;
		ushortBufferView.byteOffset = mat4BufferView.byteOffset + mat4BufferView.byteLength;
		vec3BufferViewAnim.byteOffset = ushortBufferView.byteOffset + ushortBufferView.byteLength;
		vec4BufferViewAnim.byteOffset = vec3BufferViewAnim.byteOffset + vec3BufferViewAnim.byteLength;

		long bufferByteLength = vec4BufferViewAnim.byteOffset + vec4BufferViewAnim.byteLength;

        List<string> extensionsRequired = new List<string>();
        List<string> extensionsUsed = new List<string>();

        extensionsRequired.Add(SeinNode.extensionName);
        extensionsUsed.Add(SeinNode.extensionName);
        extensionsRequired.Add(SeinRigidBody.extensionName);
        extensionsUsed.Add(SeinRigidBody.extensionName);
        extensionsRequired.Add(SeinAnimator.extensionName);
        extensionsUsed.Add(SeinAnimator.extensionName);
        extensionsRequired.Add(SeinCustomMaterial.extensionName);
        extensionsUsed.Add(SeinCustomMaterial.extensionName);
        extensionsUsed.Add(GlTF_SeinRenderer.extensionName);
        extensionsRequired.Add(GlTF_SeinRenderer.extensionName);

        if (audioClips.Count > 0)
        {
            extensionsRequired.Add("Sein_audioClips");
            extensionsRequired.Add("Sein_audioListener");
            extensionsRequired.Add("Sein_audioSource");
            extensionsUsed.Add("Sein_audioClips");
            extensionsUsed.Add("Sein_audioListener");
            extensionsUsed.Add("Sein_audioSource");
        }

        if (Exporter.opt_exportEnvLight)
        {
            extensionsRequired.Add("Sein_ambientLight");
            extensionsUsed.Add("Sein_ambientLight");
        }

        jsonWriter.Write ("{\n");
		IndentIn();

		// asset
		CommaNL();
		Indent();	jsonWriter.Write ("\"asset\": {\n");
		IndentIn();
		Indent();	jsonWriter.Write ("\"generator\": \"Sein.js Unity Toolkit\",\n");

		writeExtras();

		Indent();	jsonWriter.Write ("\"version\": \"2.0\"\n");

		IndentOut();
		Indent();	jsonWriter.Write ("}");

		if (accessors != null && accessors.Count > 0)
		{
			CommaNL();
			Indent();	jsonWriter.Write ("\"accessors\": [\n");
			IndentIn();
			foreach (GlTF_Accessor a in accessors)
			{
				CommaNL();
				a.Write ();
			}
			jsonWriter.WriteLine();
			IndentOut();
			Indent();	jsonWriter.Write ("]");
		}

		if (animations.Count > 0)
		{
			CommaNL();
			Indent();	jsonWriter.Write ("\"animations\": [\n");
			IndentIn();
			foreach (GlTF_Animation a in animations)
			{
				CommaNL();
				a.Write ();
			}
			jsonWriter.WriteLine();
			IndentOut();
			Indent();	jsonWriter.Write ("]");
		}

		if (!binary)
		{
			// FIX: Should support multiple buffers
			CommaNL();
			Indent();	jsonWriter.Write ("\"buffers\": [\n");
			IndentIn();
			Indent();	jsonWriter.Write ("{\n");
			IndentIn();
			Indent();	jsonWriter.Write ("\"byteLength\": "+ (bufferByteLength) +",\n");
			Indent();	jsonWriter.Write ("\"uri\": \"" + GlTF_Writer.binFileName + "\"\n");

			IndentOut();
			Indent();	jsonWriter.Write ("}\n");

			IndentOut();
			Indent();	jsonWriter.Write ("]");
		}
		else
		{
			CommaNL();
			Indent();	jsonWriter.Write ("\"buffers\": {\n");
			IndentIn();
			Indent();	jsonWriter.Write ("\"binary_glTF\": {\n");
			IndentIn();
			Indent();	jsonWriter.Write ("\"byteLength\": "+ (vec4BufferViewAnim.byteOffset+ vec4BufferViewAnim.byteLength)+",\n");
			Indent();	jsonWriter.Write ("\"type\": \"arraybuffer\"\n");

			IndentOut();
			Indent();	jsonWriter.Write ("}\n");

			IndentOut();
			Indent();	jsonWriter.Write ("}");
		}

		if (bufferViews != null && bufferViews.Count > 0)
		{
			CommaNL();
			Indent();	jsonWriter.Write ("\"bufferViews\": [\n");
			IndentIn();
			foreach (GlTF_BufferView bv in bufferViews)
			{
				if (bv.byteLength > 0)
				{
					CommaNL();
					bv.Write ();
				}
			}
			jsonWriter.WriteLine();
			IndentOut();
			Indent();	jsonWriter.Write ("]");
		}

		if (cameras != null && cameras.Count > 0)
		{
			CommaNL();
			Indent();		jsonWriter.Write ("\"cameras\": [\n");
			IndentIn();
			foreach (GlTF_Camera c in cameras)
			{
				CommaNL();
				c.Write ();
			}
			jsonWriter.WriteLine();
			IndentOut();
			Indent();		jsonWriter.Write ("]");
		}

        if (techniques.Count > 0)
        {
            extensionsRequired.Add("KHR_techniques_webgl");
            extensionsUsed.Add("KHR_techniques_webgl");
        }

        if (Exporter.opt_noLighting)
        {
            extensionsRequired.Add("KHR_materials_unlit");
            extensionsUsed.Add("KHR_materials_unlit");
        }

        if (!Exporter.opt_noLighting && (hasSpecularMaterials || lights.Count > 0))
        {
            extensionsRequired.Add("KHR_lights_punctual");
            extensionsUsed.Add("KHR_lights_punctual");
            if (hasSpecularMaterials)
            {
                extensionsRequired.Add("KHR_materials_pbrSpecularGlossiness");
                extensionsUsed.Add("KHR_materials_pbrSpecularGlossiness");
            }
        }

        if (binary)
        {
            extensionsUsed.Add("KHR_binary_glTF");
            Indent(); jsonWriter.Write("\"KHR_binary_glTF\"");
        }

        if (extensionsRequired.Count > 0)
        {
            CommaNL();
            Indent(); jsonWriter.Write("\"extensionsRequired\": [\n");
            IndentIn();
            for (var i = 0; i < extensionsRequired.Count; i += 1)
            {
                var extension = extensionsRequired[i];
                Indent(); jsonWriter.Write("\"" + extension + "\"");
                if (i != extensionsRequired.Count - 1)
                {
                    jsonWriter.Write(",");
                }
                jsonWriter.Write("\n");
            }
            IndentOut();
            Indent(); jsonWriter.Write("]");
        }

        if (extensionsUsed.Count > 0)
        {
            CommaNL();
            Indent(); jsonWriter.Write("\"extensionsUsed\": [\n");
            IndentIn();
            for (var i = 0; i < extensionsUsed.Count; i += 1)
            {
                var extension = extensionsUsed[i];
                Indent(); jsonWriter.Write("\"" + extension + "\"");
                if (i != extensionsUsed.Count - 1)
                {
                    jsonWriter.Write(",");
                }
                jsonWriter.Write("\n");
            }
            IndentOut();
            Indent(); jsonWriter.Write("]");
        }

        if (images.Count > 0)
		{
			CommaNL();
			Indent();	jsonWriter.Write ("\"images\": [\n");
			IndentIn();
			foreach (var i in images)
			{
				CommaNL();
				i.Write ();
			}
			jsonWriter.WriteLine();
			IndentOut();
			Indent();	jsonWriter.Write ("]");
		}

        var extensions = new List<string>();
        if (techniques.Count > 0)
        {
            extensions.Add("techniques");
        }
        if (audioClips.Count > 0)
        {
            extensions.Add("audioClips");
        }
        if (!Exporter.opt_noLighting && lights != null && lights.Count > 0)
        {
            extensions.Add("lights");
        }

        if (extensions.Count > 0)
        {
            CommaNL();
            Indent(); jsonWriter.Write("\"extensions\": {\n");
            IndentIn();

            foreach (var ex in extensions)
            {
                CommaNL();
                Indent();

                if (ex == "techniques")
                {
                    jsonWriter.Write("\"KHR_techniques_webgl\": {\n");
                    IndentIn();

                    CommaNL();
                    Indent(); jsonWriter.Write("\"programs\": [\n");
                    IndentIn();
                    foreach (GlTF_Program p in programs)
                    {
                        CommaNL();
                        p.Write();
                    }
                    jsonWriter.WriteLine();
                    IndentOut();
                    Indent(); jsonWriter.Write("]");

                    CommaNL();
                    Indent(); jsonWriter.Write("\"shaders\": [\n");
                    IndentIn();
                    foreach (GlTF_Shader s in shaders)
                    {
                        CommaNL();
                        s.Write();
                    }
                    jsonWriter.WriteLine();
                    IndentOut();
                    Indent(); jsonWriter.Write("]");

                    CommaNL();
                    Indent(); jsonWriter.Write("\"techniques\": [\n");
                    IndentIn();
                    foreach (GlTF_Technique t in techniques)
                    {
                        CommaNL();
                        t.Write();
                    }
                    jsonWriter.WriteLine();
                    IndentOut();
                    Indent(); jsonWriter.Write("]");
                }
                else if (ex == "audioClips")
                {
                    jsonWriter.Write("\"Sein_audioClips\": {\n");
                    IndentIn();
                    Indent(); jsonWriter.Write("\"clips\": [\n");
                    IndentIn();
                    foreach (var clip in audioClips)
                    {
                        CommaNL();
                        Indent(); jsonWriter.Write("{\n");
                        IndentIn();
                        Indent(); jsonWriter.Write("\"mode\": \"" + clip.mode + "\",\n");
                        Indent(); jsonWriter.Write("\"isLazy\": " + (clip.isLazy ? "true" : "false") + ",\n");
                        Indent(); jsonWriter.Write("\"uri\": \"" + audioClipURIs[clip] + "\"\n");
                        IndentOut();
                        Indent(); jsonWriter.Write("}");
                        jsonWriter.WriteLine();
                    }
                    IndentOut();
                    Indent(); jsonWriter.Write("]");
                }
                else if (ex == "lights")
                {
                    jsonWriter.Write("\"KHR_lights_punctual\": {\n");
                    IndentIn();
                    Indent();
                    jsonWriter.Write("\"lights\": [\n");
                    IndentIn();
                    foreach (GlTF_Light l in lights)
                    {
                        CommaNL();
                        l.Write();
                    }
                    jsonWriter.WriteLine();
                    IndentOut();
                    Indent();
                    jsonWriter.Write("]");
                }

                jsonWriter.WriteLine();
                IndentOut();
                Indent();
                jsonWriter.Write("}");
            }

            jsonWriter.WriteLine();
            IndentOut();
            Indent(); jsonWriter.Write("}");
        }

        if (materials.Count > 0)
		{
			CommaNL();
			Indent();	jsonWriter.Write ("\"materials\": [\n");
			IndentIn();
			foreach (GlTF_Material m in materials)
			{
				CommaNL();
				m.Write ();
			}
			jsonWriter.WriteLine();
			IndentOut();
			Indent();	jsonWriter.Write ("]");
		}

		if (meshes != null && meshes.Count > 0)
		{
			CommaNL();
			Indent();
			jsonWriter.Write ("\"meshes\": [\n");
			IndentIn();
			foreach (GlTF_Mesh m in meshes)
			{
				CommaNL();
				m.Write ();
			}
			jsonWriter.WriteLine();
			IndentOut();
			Indent();
			jsonWriter.Write ("]");
		}

		if (nodes != null && nodes.Count > 0)
		{
			CommaNL();
			Indent();			jsonWriter.Write ("\"nodes\": [\n");
			IndentIn();
			foreach (GlTF_Node n in nodes)
			{
				CommaNL();
				n.Write();
			}
			jsonWriter.WriteLine();
			IndentOut();
			Indent();			jsonWriter.Write ("]");
		}

		if (samplers.Count > 0)
		{
			CommaNL();
			Indent();	jsonWriter.Write ("\"samplers\": [\n");
			IndentIn();
			foreach (GlTF_Sampler s in samplers)
			{
				CommaNL();
				s.Write ();
			}
			jsonWriter.WriteLine();
			IndentOut();
			Indent();	jsonWriter.Write ("]");
		}
		CommaNL();
		Indent();			jsonWriter.Write ("\"scenes\": [\n");
		IndentIn();
		Indent();			jsonWriter.Write ("{\n");
		IndentIn();
		CommaNL();
		Indent(); jsonWriter.Write("\"name\":\"defaultScene\",\n");
		Indent();			jsonWriter.Write ("\"nodes\": [\n");
		IndentIn();
		foreach (GlTF_Node n in rootNodes)
		{
			CommaNL();
			Indent();		jsonWriter.Write(nodes.IndexOf(n));
		}
		jsonWriter.WriteLine();
		IndentOut();
		Indent();			jsonWriter.Write ("]\n");
		IndentOut();
		Indent();			jsonWriter.Write ("}\n");
		IndentOut();
		Indent();			jsonWriter.Write ("],\n");

		Indent(); jsonWriter.Write("\"scene\": 0");

		if(skins.Count > 0)
		{
			CommaNL();
			Indent(); jsonWriter.Write("\"skins\": [\n");
			IndentIn();
			foreach(GlTF_Skin skin in skins)
			{
				CommaNL();
				skin.Write();
			}
			jsonWriter.WriteLine();
			IndentOut();
			Indent(); jsonWriter.Write("]");
		}

		if (textures.Count > 0)
		{
			CommaNL();
			Indent();	jsonWriter.Write ("\"textures\": [\n");
			IndentIn();
			foreach (GlTF_Texture t in textures)
			{
				CommaNL();
				t.Write ();
			}
			jsonWriter.WriteLine();
			IndentOut();
			Indent();	jsonWriter.Write ("]");
		}

		IndentOut();
		jsonWriter.Write ("\n}");
		jsonWriter.Flush();

		uint contentLength = 0;
		if (binary)
		{
			long curLen = fs.Position;
			var rem = curLen % 4;
			if (rem != 0)
			{
				// add padding if not aligned to 4 bytes
				var next = (curLen / 4 + 1) * 4;
				rem = next - curLen;
				for (int i = 0; i < rem; ++i)
				{
					jsonWriter.Write(" ");
				}
			}
			jsonWriter.Flush();

			// current pos - header size
			contentLength = (uint)(fs.Position - 20);
		}

		floatBufferView.memoryStream.WriteTo(binFile);
		vec2BufferView.memoryStream.WriteTo (binFile);
		vec3BufferView.memoryStream.WriteTo (binFile);
		vec4BufferView.memoryStream.WriteTo (binFile);
		vec4UshortBufferView.memoryStream.WriteTo(binFile);
		mat4BufferView.memoryStream.WriteTo(binFile);
		ushortBufferView.memoryStream.WriteTo(binFile);

		vec3BufferViewAnim.memoryStream.WriteTo(binFile);
		vec4BufferViewAnim.memoryStream.WriteTo(binFile);

		binFile.Flush();
		if (binary)
		{
			uint fileLength = (uint)fs.Length;

			// write header
			fs.Seek(0, SeekOrigin.Begin);
			jsonWriter.Write("glTF");	// magic
			jsonWriter.Flush();
			binWriter.Write(1);	// version
			binWriter.Write(fileLength);
			binWriter.Write(contentLength);
			binWriter.Write(0);	// format
			binWriter.Flush();
		}

        if (Exporter.tempGoForSein != null)
        {
            Object.DestroyImmediate(Exporter.tempGoForSein);
        }
    }
}
#endif