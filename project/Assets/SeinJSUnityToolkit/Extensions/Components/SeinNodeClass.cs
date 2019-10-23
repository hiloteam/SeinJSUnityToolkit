using UnityEngine;
using System.Collections;
using Newtonsoft.Json.Linq;
using System.Reflection;

namespace SeinJS
{
    public enum ESeinNodePropType
    {
        Num,
        Arr,
        Str,
        Bool,
        Tex2D,
        Vec2,
        Vec3,
        Vec4,
        Mat2,
        Mat3,
        Mat4
    }
}

[AddComponentMenu("Sein/Class/Sein Node Class")]
public class SeinNodeClass : MonoBehaviour
{
    public virtual string className { get; }
    public object props;


    //public virtual JProperty Serialize(SeinJS.ExporterEntry entry)
    //{

    //}
}
