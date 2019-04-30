#if UNITY_EDITOR
using UnityEngine;
using System.Collections;
using System.Collections.Generic;

class GlTF_Light_EX: GlTF_Writer {
    public int index;

    public override void Write()
    {
        jsonWriter.Write("\"KHR_lights_punctual\": { \"light\": " + index + "}");
    }
}

public class GlTF_Node : GlTF_Writer
{
    public string cameraName;
    public int cameraIndex = -1;
    public bool hasParent = false;
    public List<int> childrenIDs = new List<int>();
    public bool uniqueItems = true;
    public string lightName;
    public int lightIndex = -1;
    public List<string> bufferViewNames = new List<string>();
    public List<string> indexNames = new List<string>();
    public List<string> accessorNames = new List<string>();
    public int meshIndex = -1;
    public GlTF_Matrix matrix;
    //  public GlTF_Mesh mesh;
    public GlTF_Rotation rotation;
    public GlTF_Scale scale;
    public GlTF_Translation translation;
    public int skinIndex = -1;
    public List<string> skeletons = new List<string>();
    public bool additionalProperties = false;
    public GlTF_SeinNode seinNode;
    public GlTF_SeinPhysicBody physicBody;
    public GlTF_SeinAnimator animator;
    public GlTF_SeinRenderer seinRenderer;
    public GlTF_SeinAudioListener seinAudioListener;
    public GlTF_SeinAudioSource seinAudioSource;
    public GlTF_AmbientLight seinAmibentLight;

    public static string GetNameFromObject(Transform o)
    {
        Transform obj = o;

        return obj.name;
    }

    public static int GetIDFromObject(Transform o) {
        return o.GetHashCode();
    }

    public static int GetIDFromObject(GlTF_Node o)
    {
        return o.GetHashCode();
    }

    public override void Write()
    {
        List<GlTF_Writer> extensions = new List<GlTF_Writer>();

        Indent();
        jsonWriter.Write("{\n");
        IndentIn();
        Indent();
        CommaNL();
        string nodeName;
        nodeName = GlTF_Writer.nodeNames.TryGetValue(uuid, out nodeName) ? nodeName : id;
        jsonWriter.Write("\"name\": \"" + nodeName + "\"");
        if (cameraName != null)
        {
            CommaNL();
            Indent();
            jsonWriter.Write("\"camera\": " + cameraIndex);
        }

        if (lightIndex != -1)
        {
            var lightWriter = new GlTF_Light_EX();
            lightWriter.index = lightIndex;
            extensions.Add(lightWriter);
        }

        if (meshIndex != -1)
        {
            CommaNL();
            Indent();
            jsonWriter.Write("\"mesh\": " + meshIndex);
        }

        if (seinNode != null)
        {
            extensions.Add(seinNode);
        }

        if (physicBody != null)
        {
            extensions.Add(physicBody);
        }

        if (animator != null)
        {
            extensions.Add(animator);
        }

        if (seinRenderer != null)
        {
            extensions.Add(seinRenderer);
        }

        if (seinAudioListener != null)
        {
            extensions.Add(seinAudioListener);
        }

        if (seinAudioSource != null)
        {
            extensions.Add(seinAudioSource);
        }

        if (seinAmibentLight != null)
        {
            extensions.Add(seinAmibentLight);
        }

        if (childrenIDs != null && childrenIDs.Count > 0)
        {
            CommaNL();
            Indent(); jsonWriter.Write("\"children\": [\n");
            IndentIn();
            foreach (int ch in childrenIDs)
            {
                CommaNL();
                int index = GlTF_Writer.nodeIDs.IndexOf(ch);
                Indent(); jsonWriter.Write(index);
            }
            jsonWriter.WriteLine();
            IndentOut();
            Indent(); jsonWriter.Write("]");
        }

        if (matrix != null)
        {
            CommaNL();
            matrix.Write();
        }
        else
        {
            if (translation != null && (translation.items[0] != 0f || translation.items[1] != 0f || translation.items[2] != 0f))
            {
                CommaNL();
                translation.Write();
            }
            if (scale != null && (scale.items[0] != 1f || scale.items[1] != 1f || scale.items[2] != 1f))
            {
                CommaNL();
                scale.Write();
            }
            if (rotation != null && (rotation.items[0] != 0f || rotation.items[1] != 0f || rotation.items[2] != 0f || rotation.items[3] != 0f))
            {
                CommaNL();
                rotation.Write();
            }
        }
        jsonWriter.Write("\n");

        if (skinIndex > -1)
        {
            CommaNL();
            Indent(); jsonWriter.Write("\"skin\": " + skinIndex + "\n");
        }

        if (extensions.Count > 0) {
            CommaNL();
            Indent(); jsonWriter.Write("\"extensions\": {\n");
            IndentIn();
            for (var i = 0; i < extensions.Count; i += 1)
            {
                var extension = extensions[i];

                Indent();
                extension.Write();

                if (i != extensions.Count - 1)
                {
                    jsonWriter.Write(",");
                }
                jsonWriter.Write("\n");
            }
            IndentOut();
            Indent(); jsonWriter.Write("}\n");
        }

        IndentOut();
        Indent(); jsonWriter.Write("}");
    }
}
#endif