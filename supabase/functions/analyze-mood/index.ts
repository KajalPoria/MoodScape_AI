import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing mood for text:", text);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert emotional intelligence AI that accurately detects nuanced human emotions. Carefully analyze the user's text for:

1. EMOTION DETECTION:
- Look for emotion keywords (happy, sad, anxious, excited, calm, tired, stressed, etc.)
- Consider context: "tired" often indicates sadness/low energy, "stressed" indicates anxiety
- "Can't wait" or "looking forward" = excited
- "Relaxed" or "peaceful" = calm
- Multiple emotions? Pick the dominant one

2. INTENSITY (0-1 scale):
- Mild expressions (0.3-0.5): "a bit", "somewhat", "slightly"
- Moderate (0.5-0.7): no qualifiers, straightforward statements
- Strong (0.7-1.0): "very", "extremely", "so", "really", exclamation marks

3. RESPONSE GUIDELINES:
- emotion: ["calm", "happy", "anxious", "sad", "excited", "neutral"]
- intensity: accurate 0-1 scale based on text strength
- message: empathetic, validating response (1-2 sentences)
- musicAction: emotion-appropriate music description
- visualAction: matching visual environment
- microAction: specific, actionable wellness suggestion

Be precise, empathetic, and context-aware.`
          },
          {
            role: "user",
            content: text
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_mood",
              description: "Analyze user's mood and provide emotional support",
              parameters: {
                type: "object",
                properties: {
                  emotion: {
                    type: "string",
                    enum: ["calm", "happy", "anxious", "sad", "excited", "neutral"]
                  },
                  intensity: {
                    type: "number",
                    minimum: 0,
                    maximum: 1
                  },
                  message: {
                    type: "string"
                  },
                  musicAction: {
                    type: "string"
                  },
                  visualAction: {
                    type: "string"
                  },
                  microAction: {
                    type: "string"
                  }
                },
                required: ["emotion", "intensity", "message", "musicAction", "visualAction", "microAction"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "analyze_mood" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response:", JSON.stringify(data));

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const result = JSON.parse(toolCall.function.arguments);
    console.log("Mood analysis result:", result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-mood function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        details: "Failed to analyze mood"
      }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
