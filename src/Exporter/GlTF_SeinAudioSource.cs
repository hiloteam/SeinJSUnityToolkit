using UnityEngine;
using System.Collections;

public class GlTF_SeinAudioSource : GlTF_Writer
{
    public SeinAudioSource source;

    public override void Write()
    {
        jsonWriter.Write("\"" + SeinAudioSource.extensionName + "\": {\n");
        IndentIn();
        Indent(); jsonWriter.Write("\"isSpaceAudio\": " + (source.isSpaceAudio ? "true" : "false") + ",\n");
        if (source.isSpaceAudio)
        {
            Indent(); jsonWriter.Write("\"spaceOptions\": {\n");
            IndentIn();
            Indent(); jsonWriter.Write("\"rotatable\": " + (source.spaceOptions.rotatable ? "true" : "false") + ",\n");
            Indent(); jsonWriter.Write("\"panningModel\": \"" + source.spaceOptions.panningModel + "\",\n");
            Indent(); jsonWriter.Write("\"distanceModel\": \"" + source.spaceOptions.distanceModel + "\",\n");
            Indent(); jsonWriter.Write("\"refDistance\": " + source.spaceOptions.refDistance + ",\n");
            Indent(); jsonWriter.Write("\"maxDistance\": " + source.spaceOptions.maxDistance + ",\n");
            Indent(); jsonWriter.Write("\"rolloffFactor\": " + source.spaceOptions.rolloffFactor + ",\n");
            Indent(); jsonWriter.Write("\"coneInnerAngle\": " + source.spaceOptions.coneInnerAngle + ",\n");
            Indent(); jsonWriter.Write("\"coneOuterAngle\": " + source.spaceOptions.coneOuterAngle + ",\n");
            Indent(); jsonWriter.Write("\"coneOuterGain\": " + source.spaceOptions.coneOuterGain + "\n");
            IndentOut();
            Indent(); jsonWriter.Write("},\n");
        }
        Indent(); jsonWriter.Write("\"needAutoPlay\": " + (source.needAutoPlay ? "true" : "false") + ",\n");
        if (source.needAutoPlay)
        {
            Indent(); jsonWriter.Write("\"autoPlayOptions\": {\n");
            IndentIn();
            Indent(); jsonWriter.Write("\"loop\": " + (source.autoPlayOptions.loop ? "true" : "false") + ",\n");
            Indent(); jsonWriter.Write("\"start\": \"" + source.autoPlayOptions.start + "\",\n");
            Indent(); jsonWriter.Write("\"end\": " + source.autoPlayOptions.end + "\n");
            IndentOut();
            Indent(); jsonWriter.Write("},\n");
        }
        Indent(); jsonWriter.Write("\"defaultClip\": \"" + source.defaultClip + "\",\n");
        Indent(); jsonWriter.Write("\"clips\": {\n");
        IndentIn();
        var length = source.clips.Length;
        var index = 0;
        foreach (var clip in source.clips)
        {
            Indent(); jsonWriter.Write("\"" + clip.name + "\": " + GlTF_Writer.audioClips.IndexOf(clip.clip));
            jsonWriter.Write(index == length - 1 ? "\n" : ",\n");
            index += 1;
        }
        IndentOut();
        Indent(); jsonWriter.Write("}\n");
        IndentOut();
        Indent();
        jsonWriter.Write("}");
    }
}
