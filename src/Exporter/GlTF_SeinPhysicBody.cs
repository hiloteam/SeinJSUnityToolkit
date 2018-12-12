using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class GlTF_SeinPhysicBody : GlTF_Writer
{
    public SeinRigidBody rigidbody = new SeinRigidBody();
    public List<Collider> colliders = new List<Collider>();

    public override void Write()
    {
        jsonWriter.Write("\"" + SeinRigidBody.extensionName + "\": {\n");
        IndentIn();
        Indent();
        jsonWriter.Write("\"mass\": " + rigidbody.mass + ",\n");
        Indent();
        jsonWriter.Write("\"friction\": " + rigidbody.friction + ",\n");
        Indent();
        jsonWriter.Write("\"restitution\": " + rigidbody.restitution + ",\n");
        Indent();
        jsonWriter.Write("\"unControl\": " + (rigidbody.unControl ? "true" : "false") + ",\n");
        Indent();
        jsonWriter.Write("\"physicStatic\": " + (rigidbody.physicStatic ? "true" : "false") + ",\n");
        Indent();
        jsonWriter.Write("\"sleeping\": " + (rigidbody.sleeping ? "true" : "false"));
        if (colliders.Count > 0) {
            jsonWriter.Write(",\n");
            Indent();
            jsonWriter.Write("\"colliders\": [\n");

            var length = colliders.Count;
            for (var i = 0; i < length; i += 1) {
                var collider = colliders[i];
                IndentIn();
                Indent();
                jsonWriter.Write("{\n");
                IndentIn();
                Indent();
                jsonWriter.Write("\"isTrigger\": " + (collider.isTrigger ? "true" : "false") + ",\n");

                if (collider is SphereCollider) {
                    Indent();
                    jsonWriter.Write("\"name\": \"sphere" + i + "\",\n");
                    Indent();
                    jsonWriter.Write("\"type\": \"SPHERE\",\n");
                    Indent();
                    var center = ((SphereCollider)collider).center;
                    jsonWriter.Write("\"offset\": [" + center.x + ", " + center.y + ", " + center.z + "],\n");
                    Indent();
                    jsonWriter.Write("\"radius\": " + ((SphereCollider)collider).radius + "\n");
                } else if (collider is BoxCollider) {
                    Indent();
                    jsonWriter.Write("\"name\": \"box" + i + "\",\n");
                    Indent();
                    jsonWriter.Write("\"type\": \"BOX\",\n");
                    Indent();
                    var center = ((BoxCollider)collider).center;
                    jsonWriter.Write("\"offset\": [" + center.x + ", " + center.y + ", " + center.z + "],\n");
                    Indent();
                    jsonWriter.Write("\"size\": " + ((BoxCollider)collider).size.ToString().Replace('(', '[').Replace(')', ']') + "\n");
                } else {
                    Debug.LogWarning("In current time, Sein only supports shpere and box collider !");
                }
                // todo: heightmap collider
                //else if (collider is TerrainCollider)
                //{

                //}
                // todo: capsule collider
                IndentOut();
                Indent();
                if (i == length - 1) {
                    jsonWriter.Write("}\n");
                } else {
                    jsonWriter.Write("},\n");
                }
            }

            IndentOut();
            Indent();
            jsonWriter.Write("]\n");
        }
        IndentOut();
        Indent();
        jsonWriter.Write("}");
    }
}
