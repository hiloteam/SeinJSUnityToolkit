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
        jsonWriter.Write("\"physicStatic\": " + (rigidbody.physicStatic ? "true" : "false"));
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
                jsonWriter.Write("\"name\": \"" + collider.name + "\",\n");

                if (collider is SphereCollider) {
                    Indent();
                    jsonWriter.Write("\"type\": \"SPHERE\",\n");
                    Indent();
                    jsonWriter.Write("\"center\": \"" + ((SphereCollider)collider).center + "\",\n");
                    Indent();
                    jsonWriter.Write("\"radius\": \"" + ((SphereCollider)collider).radius + "\"\n");
                } else if (collider is BoxCollider) {
                    Indent();
                    jsonWriter.Write("\"type\": \"BOX\",\n");
                    Indent();
                    jsonWriter.Write("\"center\": \"" + ((BoxCollider)collider).center + "\",\n");
                    Indent();
                    jsonWriter.Write("\"extents\": \"" + ((BoxCollider)collider).size + "\"\n");
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
