using UnityEngine;
using System.Collections;

public class GlTF_SeinAudioListener : GlTF_Writer
{
    public SeinAudioListener listener;

    public override void Write()
    {
        jsonWriter.Write("\"" + SeinAudioListener.extensionName + "\": {\n");
        IndentIn();
        Indent();
        jsonWriter.Write("\"rotatable\": " + (listener.rotatable ? "true" : "false") + "\n");
        IndentOut();
        Indent();
        jsonWriter.Write("}");
    }
}
