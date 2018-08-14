# Unity to Sketchfab exporter

Unity editor wizard that exports Unity object to Sketchfab using **glTF 2.0** format.

Plugin based on Unity-glTF-Exporter from https://github.com/tparisi/Unity-glTF-Exporter

* [How to use it](#howto)
* [PBR Materials](#pbrmaterials)
* [Texture conversion](#texture)
* [Samples](#samples)
* [Unsupported features](#unsupported)

<a name="howto"></a>
## How to use it

### Find the plugin
Once the plugin is imported (from the Unity package provided in [the last release here](https://github.com/sketchfab/Unity-glTF-Exporter/releases), or after having checked out this repo),
a new item should appear in the *Tools* menu. You can access the exporter by going through **Tools/Publish to Sketchfab** as shown in the following screenshot:


![alt tag](https://github.com/sketchfab/Unity-glTF-Exporter/blob/master/Resources/dropdown_menu.JPG)

### Authentication
The exporter uses OAuth authentication with *username/password* workflow.
You need to log in with your Sketchfab account before continuing.
If you don't have a Sketchfab account, you can click on the helpers to be redirected to the [sign up page](https://sketchfab.com/signup).
When successfuly logged in, you will be able to use the exporter.

### Export your selection
Select the objects you want to export, fill the forms with model info and then click the upload button.
The exporter will pack up everything and upload it on Sketchfab. You will be redirected to the model page when it's done.

### Supported features
Supported Unity objects and features so far:
- Scene objects such as transforms and meshes
- PBR materials (both *Standard* and *Standard (Specular setup)* for metal/smoothness and specular/smoothness respectively). Other materials may also be exported but not with all their channels.
- Solid and skinning animation

### Report an issue
If you have any issue, please use the [Report an issue](https://help.sketchfab.com/hc/en-us/requests/new?type=exporters&subject=Unity+Exporter) link to be redirected to the support form.

<a name="pbrmaterials"></a>
## PBR materials

glTF 2.0 core specification includes metal/roughness PBR material declaration. Specular/glossiness workflow is also available under an extension.

Link to the glTF 2.0 specification: https://github.com/KhronosGroup/glTF/tree/2.0/specification/2.0

**Note:** Bump maps (normal maps generated from grayscale) are not exported, as glTF materials don't provide them and since the export doesn"t handle the conversion.

The following example describes a Metallic-Roughness material with transparency:
```json
    "materials": [
        {
            "pbrMetallicRoughness": {
                "baseColorFactor": [1, 1, 1, 1],
                "baseColorTexture" : {
                    "index" : 0,
                    "texCoord" : 0
                },
                "roughnessFactor": 1,
                "metallicFactor": 1,
                "metallicRoughnessTexture" : {
                    "index" : 1,
                    "texCoord" : 0
                }
            },
            "doubleSided": false,
            "alphaMode": "BLEND",
            "alphaCutoff": 0.5,
            "normalTexture" : {
                "index" : 2,
                "texCoord" : 0,
                "scale" : 1
            },
            "occlusionTexture" : {
                "index" : 3,
                "texCoord" : 0,
                "strength" : 0.13
            },
            "emissiveFactor": [1, 1, 1],
            "emissiveTexture" : {
                "index" : 4,
                "texCoord" : 0
            },
            "name": "metallicPlane"
        }
    ],
```

It's composed of a set of PBR textures, under `pbrMetallicRoughness`, and a set of additionnal maps.
For specular/glossiness workflow, it's still kept under an extension.

The following example describes an opaque Specular-Glossiness material:
```json
{
    "materials": [
        {
            "extensions": {
                "KHR_materials_pbrSpecularGlossiness": {
                    "diffuseFactor": [1, 1, 1, 1],
                    "diffuseTexture" : {
                        "index" : 0,
                        "texCoord" : 0
                    },
                    "glossinessFactor": 0.358,
                    "specularFactor": [0.2, 0.2, 0.2, 1],
                    "specularGlossinessTexture" : {
                        "index" : 1,
                        "texCoord" : 0
                    }               }

            },
            "doubleSided": false,
            "normalTexture" : {
                "index" : 2,
                "texCoord" : 0
            },
            "emissiveFactor": [0, 0, 0],
            "name": "specularPlane"
        }
    ],
```

<a name="texture"></a>
## Texture conversion

Textures are processed to be compliant with glTF 2.0 specification.
It includes:
* flipping images along Y axis: FLIP_Y is enabled in Unity but disabled in glTF.(more details about Flip Y flag  [in glTF](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#images) and [in WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/pixelStorei)).
* packing **occlusion**(*R*)/**metalness**(*G*)/**roughness**(*B*) for PBR metallicRoughness and **specular(*RGB*)**/**glossiness**(*A*) for specularGlossiness, including inversion to convert **smothness** to **roughness**

<a name="samples"></a>
## Samples

Some samples exported using this plugin are available (and downloadable) on Sketchfab https://sketchfab.com/features/gltf.
They will be kept up-to-date while the glTF 2.0 specification is being developped.

<a name="unsupported"></a>
## Unsupported features

### Materials
* emission color values are clamped in [0.0, 1.0] as glTF doesn"t allow HDR values for this channel yet. (see this [github issue](https://github.com/KhronosGroup/glTF/issues/1083))
* bump maps or normal map generated from grayscale are ignored
* tiling/offset parameters not exported (see current [github pull request](https://github.com/KhronosGroup/glTF/pull/1015))
* secondary maps and all other following material settings

### Animation
* all animations that are not Generic or Legacy (like Humanoid)
* animation from MonoBehaviour scripts or custom tools

### Scene objects
* camera
* lights
* custom scripts/shaders/postprocesses



