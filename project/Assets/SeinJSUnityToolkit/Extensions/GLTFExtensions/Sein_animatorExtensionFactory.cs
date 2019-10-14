/**
 * @File   : Sein_animatorExtensionFactory.cs
 * @Author : dtysky (dtysky@outlook.com)
 * @Link   : dtysky.moe
 * @Date   : 2019/10/12 0:00:00PM
 */
using System;
using Newtonsoft.Json.Linq;
using GLTF.Math;
using Newtonsoft.Json;
using GLTF.Extensions;
using System.Collections.Generic;
using GLTF.Schema;
using UnityEngine;

namespace SeinJS
{
    public class Sein_animatorExtensionFactory : SeinExtensionFactory
    {
        public override string GetExtensionName() { return "Sein_animator"; }
        public override List<Type> GetBindedComponents() { return new List<Type> { typeof(SeinAnimator) }; }

        public override void Serialize(ExporterEntry entry, Dictionary<string, Extension> extensions, UnityEngine.Object component = null)
        {
            var animator = component as SeinAnimator;
            var extension = new Sein_animatorExtension();

            extension.prefix = animator.prefix;
            extension.defaultAnimation = animator.defaultAnimation;
            extension.modelAnimations = animator.modelAnimations;

            AddExtension(extensions, extension);
        }

        public override Extension Deserialize(GLTFRoot root, JProperty extensionToken)
        {
            var extension = new Sein_animatorExtension();

            if (extensionToken != null)
            {
                extension.defaultAnimation = (string)extensionToken.Value["defaultAnimation"];
                extension.modelAnimations = extensionToken.Value["modelAnimations"].ToObject<string[]>();
                extension.prefix = (string)extensionToken.Value["prefix"];
            }

            return extension;
        }
    }
}
