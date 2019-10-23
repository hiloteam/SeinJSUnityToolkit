using UnityEngine;
using System.Collections;
using Newtonsoft.Json.Linq;
using System.Reflection;

[AddComponentMenu("Sein/Class/Test Actor")]
public class TestActor : SeinNodeClass
{
    [System.Serializable]
    public struct TestActorProps
    {
        public int a;
        public string b;
    }

    public override string className { get { return "TestActor"; } }
    public new TestActorProps props;
}
