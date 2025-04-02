import OpenAI from "openai";
import { Resource } from "sst";

export default function ai() {
    return new OpenAI({
        apiKey: Resource.OPEN_AI_SECRET.value,
        organisation: "org-SrHhs2i4xnQZ37GqS98CTbVI",
        project: "proj_cij9i6MKiwhQPpNIRyaVSDtj"
    } as any);
}