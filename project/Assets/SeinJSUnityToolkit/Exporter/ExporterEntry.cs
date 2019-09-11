using UnityEngine;
using UnityEditor;
using GLTF.Schema;
using Newtonsoft.Json.Linq;
using GLTF;
using System.Collections.Generic;
using System.IO;

namespace SeinJS
{
    public class ExportEntry
    {
        public class Pair<Key, Value>
        {
            public Key key;
            public Value value;

            public Pair(Key key, Value value) {
                this.key = key;
                this.value = value;
            }

        }

        public string path;
        public string name;
        public Transform[] transforms;
        public GLTFRoot root = new GLTFRoot();
        public List<Transform> bones = new List<Transform>();
        public Dictionary<Transform, Node> tr2node = new Dictionary<Transform, Node>();

        private MemoryStream _buffer = new MemoryStream();
        // for byteStride
        //private Dictionary<number, MemoryStream> _bufferViews = new MemoryStream();
        private Dictionary<UnityEngine.Mesh, Dictionary<string, MeshId>> _mesh2Id = new Dictionary<UnityEngine.Mesh, Dictionary<string, MeshId>>();

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

        public Pair<MeshId, bool> SaveMesh(UnityEngine.Mesh mesh, Renderer renderer)
        {
            string materialsId = "";
            foreach (var mat in renderer.sharedMaterials)
            {
                materialsId += mat.GetInstanceID();
            }

            var id = _mesh2Id[mesh][materialsId];
            if (id != null)
            {
                return new Pair<MeshId, bool>(id, false);
            }

            var m = new GLTF.Schema.Mesh();
            var attributes = GenerateAttributes(mesh);
            m.Name = mesh.name;
            m.Primitives = new List<MeshPrimitive>();
            

            for (int i = 0; i < mesh.subMeshCount; i += 1)
            {
                m.Primitives[i].Attributes = attributes;
                SavePrimitive(mesh, m, i);
            }

            root.Meshes.Add(m);
            id = new MeshId { Id = root.Meshes.Count };

            return new Pair<MeshId, bool>(id, true);
        }

        private Dictionary<string, AccessorId> GenerateAttributes(UnityEngine.Mesh mesh)
        {
            var attrs= new Dictionary<string, AccessorId>();

            attrs.Add("POSITION", PackToBuffer(mesh.vertices, mesh.vertexCount));

            if (mesh.normals.Length > 0)
            {
                attrs.Add("NORMAL", PackToBuffer(mesh.normals, mesh.normals.Length));
            }

            if (mesh.colors.Length > 0)
            {
                attrs.Add("COLOR", PackToBuffer(mesh.colors, mesh.colors.Length));
            }

            if (mesh.uv.Length > 0)
            {
                attrs.Add("TEXCOORD_0", PackToBuffer(mesh.uv, mesh.uv.Length));
            }

            if (mesh.uv2.Length > 0)
            {
                attrs.Add("TEXCOORD_1", PackToBuffer(mesh.uv2, mesh.uv2.Length));
            }

            if (mesh.tangents.Length > 0)
            {
                attrs.Add("TANGENT", PackToBuffer(mesh.tangents, mesh.tangents.Length));
            }

            if (mesh.boneWeights.Length > 0)
            {
                attrs.Add("JOINT", PackToBufferShort(ExporterUtils.BoneWeightToBoneVec4(mesh.boneWeights), mesh.boneWeights.Length));
            }

            if (mesh.boneWeights.Length > 0)
            {
                attrs.Add("WEIGHT", PackToBuffer(ExporterUtils.BoneWeightToWeightVec4(mesh.boneWeights), mesh.boneWeights.Length));                
            }

            return attrs;
        }

        private AccessorId PackToBuffer(Vector2[] data, int count)
        {
            ExporterUtils.PackToBuffer(_buffer, data, count);
        }

        private AccessorId PackToBuffer(Vector3[] data, int count)
        {
            ExporterUtils.PackToBuffer(_buffer, data, count);
        }

        private AccessorId PackToBuffer(Vector4[] data, int count)
        {
            ExporterUtils.PackToBuffer(_buffer, data, count);
        }
        private AccessorId PackToBuffer(Color[] data, int count)
        {
            ExporterUtils.PackToBuffer(_buffer, data, count);
        }

        private AccessorId PackToBufferShort(Vector4[] data, int count)
        {
            ExporterUtils.PackToBufferShort(_buffer, data, count);
        }

        private void SavePrimitive(UnityEngine.Mesh mesh, GLTF.Schema.Mesh m, int i)
        {
            // indices
            m.Primitives[i].Mode = DrawMode.Triangles;
        }

        public MaterialId SaveMaterial(UnityEngine.Material material)
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
