using UnityEngine;
using System.Collections;

public class GlTF_SeinNode : GlTF_Writer
{
    public SeinNode node;

    public override void Write()
    {
        jsonWriter.Write("\"" + SeinNode.extensionName + "\": {\n");
        IndentIn();
        Indent();
        jsonWriter.Write("\"selfType\": " + node.selfType.ToString("d") + ",\n");
        Indent();
        jsonWriter.Write("\"childrenType\": " + node.childrenType.ToString("d") + ",\n");
        Indent();
        jsonWriter.Write("\"className\": \"" + node.className + "\",\n");
        Indent();
        jsonWriter.Write("\"tag\": \"" + node.tag + "\",\n");
        Indent();
        jsonWriter.Write("\"layer\": " + node.layer + ",\n");
        Indent();
        jsonWriter.Write("\"persistent\": " + (node.persistent ? "true" : "false") + ",\n");
        Indent();
        jsonWriter.Write("\"emitComponentsDestroy\": " + (node.emitComponentsDestroy ? "true" : "false") + ",\n");
        Indent();
        jsonWriter.Write("\"updateOnEverTick\": " + (node.updateOnEverTick ? "true" : "false") + ",\n");
        Indent();
        jsonWriter.Write("\"isStatic\": " + (node.isStatic ? "true" : "false") + ",\n");
        Indent();
        jsonWriter.Write("\"skipThisNode\": " + (node.skipThisNode ? "true" : "false") + "\n");
        IndentOut();
        Indent();
        jsonWriter.Write("}");
    }
}