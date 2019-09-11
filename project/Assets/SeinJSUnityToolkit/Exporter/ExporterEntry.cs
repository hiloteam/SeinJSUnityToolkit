using UnityEngine;
using UnityEditor;
using GLTF.Schema;
using Newtonsoft.Json.Linq;
using GLTF;
using System.Collections.Generic;

namespace SeinJS
{
    public class ExportEntry
    {
        public string path;
        public string name;
        public Transform[] transforms;
        public GLTFRoot root = new GLTFRoot();
        public List<Transform> bones = new List<Transform>();
        public Dictionary<Transform, Node> tr2node = new Dictionary<Transform, Node>();

        public NodeId SaveNode(Transform tr)
        {
            var node = new Node
            {
                Name = tr.name,
                UseTRS = true,
                Translation = Utils.convertVector3LeftToRightHandedness(tr.localPosition),
                Rotation = Utils.convertQuatLeftToRightHandedness(tr.localRotation),
                Scale = Utils.convertVector3LeftToRightHandedness(tr.localScale)
            };
            root.Nodes.Add(node);
            tr2node.Add(tr, node);

            return new NodeId { Id = root.Nodes.Count };
        }

        public MeshId SaveMesh(UnityEngine.Mesh mesh)
        {
            var id = new MeshId();

            return id;
        }

        public MeshPrimitive SavePrimitive(MeshId mesh, )
        {
            
        }

        public MaterialId SaveMaterial()
        {
            var id = new MaterialId();

            return id;
        }

        public TextureId SaveTexture()
        {
            var id = new TextureId();

            return id;
        }

        //public string SaveAudio()
        //{

        //}
    }
}
