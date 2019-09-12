using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;
using GLTF.Schema;
using System.IO;
using System;

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

        public static Accessor PackToBuffer<DataType>(
            byte[] buffer, DataType[] data,
            GLTFComponentType componentType, int offset, int stride
        )
        {
            var accessor = new Accessor();
            accessor.ByteOffset = offset;
            accessor.ComponentType = componentType;

            int count = 0;
            int index = 0;
            float[] max = null;
            float[] min = null;

            foreach (var item in data)
            {
                var bytes = GetDataToBuffer(item, componentType, ref max, ref min, ref accessor.Type);
                int byteOffset = offset + stride * index;

                bytes.CopyTo(buffer, byteOffset);
                count += bytes.Length;
            }

            accessor.Count = count;

            return accessor;
        }

        private static byte[] GetDataToBuffer<DataType>(
            DataType value, GLTFComponentType componentType,
            ref float[] max, ref float[] min, ref GLTFAccessorAttributeType type
        )
        {   
            /**
             @todo: support int uint short byte ushort...
             */
            if (typeof(DataType) == typeof(float))
            {
                var v = (float)Convert.ChangeType(value, typeof(float));
                var mx = (float)Convert.ChangeType(value, typeof(float));
                var mn = (float)Convert.ChangeType(value, typeof(float));

                type = GLTFAccessorAttributeType.SCALAR;
                mx = mx > v ? mx : v;
                mn = mn < v ? mn : v;

                return BitConverter.GetBytes(v);
            }

            float[] array = null;

            if (typeof(DataType) == typeof(Vector2))
            {
                type = GLTFAccessorAttributeType.VEC2;
                var v = (Vector2)Convert.ChangeType(value, typeof(Vector2));
                array = new float[] { v.x, v.y };
            }
            else if (typeof(DataType) == typeof(Vector3))
            {
                type = GLTFAccessorAttributeType.VEC3;
                var v = (Vector3)Convert.ChangeType(value, typeof(Vector3));
                array = new float[] { v.x, v.y, v.z };
            }
            else if (typeof(DataType) == typeof(Vector4))
            {
                type = GLTFAccessorAttributeType.VEC4;
                var v = (Vector4)Convert.ChangeType(value, typeof(Vector4));
                array = new float[] { v.x, v.y, v.z, v.w };
            } else
            {
                throw new Exception("Only support packing float, Vector2, Vector3, Vector4 now !");
            }

            if (max == null)
            {
                max = (float[])array.Clone();
            }

            if (min == null)
            {
                min = (float[])array.Clone();
            }

            for (int i = 0; i < array.Length; i += 1)
            {
                max[i] = max[i] > array[i] ? max[i] : array[i];
                min[i] = min[i] < array[i] ? min[i] : array[i];
            }

            return GetBytes(array, componentType);
        }

        private static byte[] GetBytes(float[] array, GLTFComponentType componentType)
        {
            int size = 0;
            Array dArray = null;

            switch (componentType)
            {
                case GLTFComponentType.Byte:
                case GLTFComponentType.UnsignedByte:
                    size = 1;
                    dArray = Array.ConvertAll(array, item => (byte)item);
                    break;
                case GLTFComponentType.Short:
                    size = 2;
                    dArray = Array.ConvertAll(array, item => (short)item);
                    break;
                case GLTFComponentType.UnsignedShort:
                    size = 2;
                    dArray = Array.ConvertAll(array, item => (ushort)item);
                    break;
                case GLTFComponentType.Float:
                    size = 4;
                    dArray = array;
                    break;
                case GLTFComponentType.UnsignedInt:
                    size = 4;
                    dArray = Array.ConvertAll(array, item => (uint)item);
                    break;
            }

            var bytes = new byte[size * array.Length];
            System.Buffer.BlockCopy(bytes, 0, array, 0, bytes.Length);

            return bytes;
        }
    }
}
