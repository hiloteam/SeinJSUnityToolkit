/**
 * @File   : KHR_materials_unlit.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/08 0:00:00AM
 */
using System;
using System.Collections.Generic;
using GLTF.Schema;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace SeinJS
{
    public class Sein_customMaterialExtensionFactory : SeinExtensionFactory
    {
        public override string GetExtensionName() { return "Sein_customMaterial"; }
        public override List<Type> GetBindedComponents() { return new List<Type>(); }
        public override List<EExtensionType> GetExtensionTypes() { return new List<EExtensionType> { EExtensionType.Material, EExtensionType.Node }; }

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null)
        {
            var material = component as SeinCustomMaterial;
            var extension = new Sein_customMaterialExtension();

            extension.className = material.className;
            extension.cloneForInst = material.cloneForInst;
            extension.renderOrder = material.renderOrder;
            extension.transparent = material.transparent;
            extension.uniformsColor = material.uniformsColor;
            extension.uniformsTexture = material.uniformsTexture;
            extension.uniformsCubeTexture = material.uniformsCubeTexture;
            extension.uniformsFloat = material.uniformsFloat;
            extension.uniformsFloatVec2 = material.uniformsFloatVec2;
            extension.uniformsFloatVec3 = material.uniformsFloatVec3;
            extension.uniformsFloatVec4 = material.uniformsFloatVec4;
            extension.uniformsFloatMat2 = material.uniformsFloatMat2;
            extension.uniformsFloatMat3 = material.uniformsFloatMat3;
            extension.uniformsFloatMat4 = material.uniformsFloatMat4;
            extension.uniformsInt = material.uniformsInt;
            extension.uniformsIntVec2 = material.uniformsIntVec2;
            extension.uniformsIntVec3 = material.uniformsIntVec3;
            extension.uniformsIntVec4 = material.uniformsIntVec4;

            AddExtension(extensions, extension);
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            return new Sein_customMaterialExtension();
        }
    }
}
