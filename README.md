# UnityGLTFManager

Export unity scene to gltf for "sein.js", or import gltf to unity, fork from sketchfab/UnityGLTF.

## Usage

Double click bin/UnityGlTFManager.unitypackage and import all to your project, then check the 'Topbar -> SeinJS -> Export to GlTF' and 'Topbar -> SeinJS -> Import GlTF'.

## Features

1. Remove steps like logging, uploading......
2. Use original animations' name(ani1, ani2...) and meshes' name(mesh_m1, mesh_m2...) like in unity instead of hash.
3. For nodes, exported name will keep it's original name.
4. Support lights(point, directional, spot).
5. Support texture compression.
6. Support Unlit mode.
7. Support importing gltf file to unity.
8. Support exporting lightmap.
9. Support import gltf file with Sein.js extensions.
10. Support import and export morph.
11. Support import multi primitives mesh and its hierarchy in unity(by using sub meshes).
