using UnityEngine;
using System.Collections;
using Newtonsoft.Json.Linq;
using System.Reflection;
using System;
using SeinJS;

namespace SeinJS
{
    public struct SeinNodeOption
    {
        public string type;
        public JToken value;

        public SeinNodeOption(string type, JToken value) {
            this.type = type;
            this.value = value;
        }
    }
}

[AddComponentMenu("Sein/Classes/Sein Node Class")]
public class SeinNodeClass : MonoBehaviour
{
    public object options;

    public virtual JObject Serialize(SeinJS.ExporterEntry entry, SeinJS.Sein_nodeExtension extension)
    {
        var type = GetType();
        var className = type.FullName.Replace("SeinNodeClass_", "");
        extension.className = string.IsNullOrEmpty(className) ? extension.className : className;
        var result = new JObject();

        if (type.GetField("options") == null)
        {
            return result;
        }

        var initOptions = type.GetField("options").GetValue(this);
        foreach (var pair in initOptions.GetType().GetFields())
        {
            var option = SerializeValue(entry, pair.GetValue(initOptions));
            result.Add(pair.Name, new JObject(
                new JProperty("type", option.type),
                new JProperty("value", option.value)
            ));
        }

        return result;
    }

    public virtual SeinJS.SeinNodeOption SerializeValue(SeinJS.ExporterEntry entry, object option)
    {
        if (option is float)
        {
            return SerializeValue(entry, (float)option);
        }
        else if (option is int)
        {
            return SerializeValue(entry, (int)option);
        }
        else if (option is string)
        {
            return SerializeValue(entry, (string)option);
        }
        else if (option is bool)
        {
            return SerializeValue(entry, (bool)option);
        }
        else if (option is Vector2)
        {
            return SerializeValue(entry, (Vector2)option);
        }
        else if (option is Vector3)
        {
            return SerializeValue(entry, (Vector3)option);
        }
        else if (option is Vector4)
        {
            return SerializeValue(entry, (Vector4)option);
        }
        else if (option is Matrix4x4)
        {
            return SerializeValue(entry, (Matrix4x4)option);
        }
        else if (option is Quaternion)
        {
            return SerializeValue(entry, (Quaternion)option);
        }
        else if (option is Color)
        {
            return SerializeValue(entry, (Color)option);
        }
        else if (option is Texture2D)
        {
            return SerializeValue(entry, (Texture2D)option);
        }
        else if (option is Cubemap)
        {
            return SerializeValue(entry, (Cubemap)option);
        }
        else if (option is SeinAtlas)
        {
            return SerializeValue(entry, (SeinAtlas)option);
        }
        else if (option is Material)
        {
            return SerializeValue(entry, (Material)option);
        }
        else if (option is Array)
        {
            var res = new JArray();
            foreach (var item in (Array)option)
            {
                var value = SerializeValue(entry, item);
                res.Add(new JObject(
                    new JProperty("type", value.type),
                    new JProperty("value", value.value)
                ));
            }

            return new SeinJS.SeinNodeOption("Array", res);
        }
        else
        {
            return SerializeValueUnknown(entry, option);
        }
    }

    public virtual SeinJS.SeinNodeOption SerializeValueUnknown(SeinJS.ExporterEntry entry, object option)
    {
        var result = new JObject();

        foreach (var pair in option.GetType().GetFields())
        {
            var value = SerializeValue(entry, pair.GetValue(option));
            result.Add(pair.Name, new JObject(
                new JProperty("type", value.type),
                new JProperty("value", value.value)
            ));
        }

        return new SeinJS.SeinNodeOption("Object", result);
    }

    public virtual SeinJS.SeinNodeOption SerializeValue(SeinJS.ExporterEntry entry, float option)
    {
        return new SeinJS.SeinNodeOption("Float", option);
    }

    public virtual SeinJS.SeinNodeOption SerializeValue(SeinJS.ExporterEntry entry, int option)
    {
        return new SeinJS.SeinNodeOption("Int", option);
    }

    public virtual SeinJS.SeinNodeOption SerializeValue(SeinJS.ExporterEntry entry, string option)
    {
        return new SeinJS.SeinNodeOption("String", option);
    }

    public virtual SeinJS.SeinNodeOption SerializeValue(SeinJS.ExporterEntry entry, bool option)
    {
        return new SeinJS.SeinNodeOption("Bool", option);
    }

    public virtual SeinJS.SeinNodeOption SerializeValue(SeinJS.ExporterEntry entry, Vector2 option)
    {
        return new SeinJS.SeinNodeOption("Vec2", new JArray { option.x, option.y });
    }

    public virtual SeinJS.SeinNodeOption SerializeValue(SeinJS.ExporterEntry entry, Vector3 option)
    {
        return new SeinJS.SeinNodeOption("Vec3", new JArray { option.x, option.y, option.z });
    }

    public virtual SeinJS.SeinNodeOption SerializeValue(SeinJS.ExporterEntry entry, Vector4 option)
    {
        return new SeinJS.SeinNodeOption("Vec4", new JArray { option.x, option.y, option.z, option.w });
    }

    public virtual SeinJS.SeinNodeOption SerializeValue(SeinJS.ExporterEntry entry, Quaternion option)
    {
        return new SeinJS.SeinNodeOption("Quat", new JArray { option.x, option.y, option.z, option.w });
    }

    public virtual SeinJS.SeinNodeOption SerializeValue(SeinJS.ExporterEntry entry, Color option)
    {
        return new SeinJS.SeinNodeOption("Color", new JArray { option.r, option.g, option.b, option.a });
    }

    public virtual SeinJS.SeinNodeOption SerializeValue(SeinJS.ExporterEntry entry, Matrix4x4 option)
    {
        return new SeinJS.SeinNodeOption("Mat4", new JArray {
            option.m00, option.m01, option.m02, option.m03,
            option.m10, option.m11, option.m12, option.m13,
            option.m20, option.m21, option.m22, option.m23,
            option.m30, option.m31, option.m32, option.m33
        });
    }

    public virtual SeinJS.SeinNodeOption SerializeValue(SeinJS.ExporterEntry entry, Texture2D option)
    {
        return new SeinJS.SeinNodeOption("Tex2D", new JObject(new JProperty("index", entry.SaveTexture(option, true).Id)));
    }

    public virtual SeinJS.SeinNodeOption SerializeValue(SeinJS.ExporterEntry entry, Cubemap option)
    {
        return new SeinJS.SeinNodeOption("TexCube", new JObject(new JProperty("index", entry.SaveCubeTexture(option, true).Id)));
    }

    public virtual SeinJS.SeinNodeOption SerializeValue(SeinJS.ExporterEntry entry, SeinAtlas option)
    {
        ExtensionManager.Serialize(ExtensionManager.GetExtensionName(typeof(Sein_atlasExtensionFactory)), entry, entry.root.Extensions, option);
        var atlasId = Sein_atlasExtensionFactory.GetAtlasIndex(entry, option);
        return new SeinJS.SeinNodeOption("Atlas", new JObject(new JProperty("index", atlasId)));
    }

    public virtual SeinJS.SeinNodeOption SerializeValue(SeinJS.ExporterEntry entry, Material option)
    {
        return new SeinJS.SeinNodeOption("Mat", new JObject(new JProperty("index", entry.SaveNormalMaterial(option).Id)));
    }
}
