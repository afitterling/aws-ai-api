import OpenAI from "openai";
import { Resource } from "sst";

export default function ai() {
    return new OpenAI({
        apiKey: Resource.OPEN_AI_SECRET.value,
    } as any);
}