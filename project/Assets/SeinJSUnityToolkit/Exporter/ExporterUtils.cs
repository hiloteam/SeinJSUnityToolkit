using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;
using GLTF.Schema;
using System.IO;

namespace SeinJS
{
    public class ExporterUtils
    {
        public static Vector4[] BoneWeightToBoneVec4(BoneWeight[] bw)
        {
            Vector4[] bones = new Vector4[bw.Length];
            for (int i = 0; i < bw.Length; ++i)
            {
                bones[i] = new Vector4(bw[i].boneIndex0, bw[i].boneIndex1, bw[i].boneIndex2, bw[i].boneIndex3);
            }

            return bones;
        }

        public static Vector4[] BoneWeightToWeightVec4(BoneWeight[] bw)
        {
            Vector4[] weights = new Vector4[bw.Length];
            for (int i = 0; i < bw.Length; ++i)
            {
                weights[i] = new Vector4(bw[i].weight0, bw[i].weight1, bw[i].weight2, bw[i].weight3);
            }

            return weights;
        }

        public static Accessor PackToBuffer<BufferType, DataType>(BufferType buffer, DataType[] data, GLTFComponentType componentType, int offset, int stride)
        {
            var accessor = new Accessor();
            accessor.ByteOffset = offset;
            accessor.ComponentType = componentType;

            int count = 0;

            foreach (var item in data)
            {
                
            }

            return accessor;
        }

        private static void SetDataToBuffer(Vector2 value, int index, int offset, int stride, ref Vector2 max, ref Vector2 min)
        {

        }
    }
}
