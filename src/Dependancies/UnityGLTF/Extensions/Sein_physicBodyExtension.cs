using GLTF.Math;
using GLTF.Schema;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using UnityEngine;

namespace GLTF.Schema
{
    public class Sein_physicBodyExtension : Extension
    {
        public SeinRigidBody rigidBody;
        public List<Collider> colliders;
        public GameObject tmpGo;

        public Sein_physicBodyExtension(
            SeinRigidBody rigidBody,
            List<Collider> colliders,
            GameObject tmpGo
        )
        {
            this.rigidBody = rigidBody;
            this.colliders = colliders;
            this.tmpGo = tmpGo;
        }

        public JProperty Serialize()
        {
            return null;
        }
    }
}
