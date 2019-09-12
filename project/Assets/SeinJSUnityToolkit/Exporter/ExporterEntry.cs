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

        public class EntryBufferView
        {
            public BufferViewId id;
            public BufferView view = new BufferView();
            public byte[] byteBuffer;
            public MemoryStream streamBuffer;
        }

        public string path;
        public string name;
        public Transform[] transforms;
        public GLTFRoot root = new GLTFRoot();
        public List<Transform> bones = new List<Transform>();
        public Dictionary<Transform, Node> tr2node = new Dictionary<Transform, Node>();

        //private MemoryStream _buffer = new MemoryStream();
        private List<EntryBufferView> _bufferViews = new List<EntryBufferView>();
		// for each mesh
		private Dictionary<UnityEngine.Mesh, Dictionary<string, AccessorId>> _mesh2attrs= new Dictionary<UnityEngine.Mesh, Dictionary<string, AccessorId>>();
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
            if (_mesh2attrs[mesh] != null)
            {
                return _mesh2attrs[mesh];
            }

            var attrs= new Dictionary<string, AccessorId>();
            var bufferView = new EntryBufferView();
            bufferView.view.Name = mesh.name;

            int stride = GetBufferLength(mesh);
            bufferView.view.ByteStride = stride;
            bufferView.view.ByteLength = stride * mesh.vertexCount;
            bufferView.byteBuffer = new byte[bufferView.view.ByteLength];
            root.BufferViews.Add(bufferView.view);
            bufferView.id = new BufferViewId { Id = root.BufferViews.Count };

            stride = 3 * 4;
            attrs.Add("POSITION", PackAttrToBuffer(bufferView, mesh.vertices, 0));

            if (mesh.normals.Length > 0)
            {
                attrs.Add("NORMAL", PackAttrToBuffer(bufferView, mesh.normals, stride));
                stride += 3 * 4;
            }

            if (mesh.colors.Length > 0)
            {
                attrs.Add("COLOR", PackAttrToBuffer(bufferView, mesh.colors, stride));
                stride += 4 * 4;
            }

            if (mesh.uv.Length > 0)
            {
                attrs.Add("TEXCOORD_0", PackAttrToBuffer(bufferView, mesh.uv, stride));
                stride += 2 * 4;
            }

            if (mesh.uv2.Length > 0)
            {
                attrs.Add("TEXCOORD_1", PackAttrToBuffer(bufferView, mesh.uv2, stride));
                stride += 2 * 4;
            }

            if (mesh.tangents.Length > 0)
            {
                attrs.Add("TANGENT", PackAttrToBuffer(bufferView, mesh.tangents, stride));
                stride += 4 * 4;
            }

            if (mesh.boneWeights.Length > 0)
            {
                attrs.Add("JOINT", PackAttrToBufferShort(bufferView, ExporterUtils.BoneWeightToBoneVec4(mesh.boneWeights), stride));
                stride += 1 * 4;
                attrs.Add("WEIGHT", PackAttrToBuffer(bufferView, ExporterUtils.BoneWeightToWeightVec4(mesh.boneWeights), stride));
                stride += 4 * 4;
            }

            return attrs;
        }

        private int GetBufferLength(UnityEngine.Mesh mesh)
        {
            int stride = 3 * 4; 

            if (mesh.normals.Length > 0)
            {
                stride += 3 * 4;
            }

            if (mesh.colors.Length > 0)
            {
                stride += 4 * 4;
            }

            if (mesh.uv.Length > 0)
            {
                stride += 2 * 4;
            }

            if (mesh.uv2.Length > 0)
            {
                stride += 2 * 4;
            }

            if (mesh.tangents.Length > 0)
            {
                stride += 4 * 4;
            }

            if (mesh.boneWeights.Length > 0)
            {
                stride += 1 * 4;
                stride += 4 * 4;
            }

            return stride;
        }

        private AccessorId PackAttrToBuffer<DataType>(EntryBufferView bufferView, DataType[] data, int offset)
        {
            var accessor = ExporterUtils.PackToBuffer(bufferView.byteBuffer, data, GLTFComponentType.Float, offset, bufferView.view.ByteStride);

            return AccessorToId(accessor, bufferView);
        }

        private AccessorId PackAttrToBufferShort<DataType>(EntryBufferView bufferView, DataType[] data, int offset)
        {
            var accessor = ExporterUtils.PackToBuffer(bufferView.byteBuffer, data, GLTFComponentType.Short, offset, bufferView.view.ByteStride);

            return AccessorToId(accessor, bufferView);
        }

        private AccessorId AccessorToId(Accessor accessor, EntryBufferView bufferView)
        {
            accessor.BufferView = bufferView.id;
            root.Accessors.Add(accessor);

            return new AccessorId { Id = root.Accessors.Count };
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
