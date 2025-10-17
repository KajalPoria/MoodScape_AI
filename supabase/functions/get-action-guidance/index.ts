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
    const { actionType, actionLabel, emotion } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Getting guidance for ${actionType}: ${actionLabel} (emotion: ${emotion})`);

    const systemPrompts: Record<string, string> = {
      breathing: `You are a breathwork expert. Provide detailed, step-by-step guidance for the breathing exercise "${actionLabel}". Include:
- Brief introduction (why this technique helps)
- Exact steps with timing
- What to focus on during each phase
- Tips for best results
- Duration and frequency recommendations
Format as clear, numbered steps.`,
      
      meditation: `You are a meditation guide. Create a complete 5-minute guided meditation script for someone feeling ${emotion}. Include:
- Opening (how to sit/prepare)
- Body scan sequence
- Breathing focus
- Visualization or mantras
- Gentle closing
Make it calming, detailed, and easy to follow.`,
      
      gratitude: `You are a gratitude coach. Provide a structured gratitude practice with:
- Why gratitude helps with ${emotion} feelings
- 5 specific prompts to guide reflection
- Tips for deeper engagement
- Suggestion for daily practice
Keep it warm and encouraging.`,
      
      bodywork: `You are a physical wellness expert. Provide detailed instructions for "${actionLabel}" including:
- Preparation and positioning
- Step-by-step movements
- Breathing coordination
- What to feel/focus on
- Safety tips and modifications
- Recommended duration`,
      
      grounding: `You are a grounding technique specialist. Teach the 5-4-3-2-1 method with:
- Clear explanation of each sense
- Specific examples for each step
- How to engage deeply with each sensation
- Why this helps with ${emotion}
- Tips for when to use it`,
      
      selfcare: `You are a self-compassion expert. Guide someone feeling ${emotion} through:
- Self-compassion statements to repeat
- Gentle self-care actions they can take now
- Why being kind to themselves matters
- Affirmations for ${emotion} feelings
- Creating a self-care moment`,
      
      movement: `You are a movement therapist. Create a 5-10 minute movement sequence for ${emotion} that includes:
- Warm-up movements
- Main activity suggestions
- Cool-down stretches
- Music/rhythm recommendations
- How movement helps process ${emotion}`,
      
      checkin: `You are an emotional awareness coach. Guide a mindful check-in process:
- Questions to explore current feelings
- Body sensation awareness prompts
- Thought observation techniques
- Emotion naming practice
- Integration and next steps`,
      
      creativity: `You are a creativity facilitator. Suggest creative outlets for ${emotion} energy:
- 3 quick creative activities (5-15 min each)
- Materials needed (or none)
- How creativity helps process ${emotion}
- Prompts to get started
- No-pressure approach`,
      
      exploration: `You are a mindfulness teacher. Design an exploration practice:
- Curiosity-based awareness exercises
- Sensory exploration activities
- Mindful observation techniques
- Gentle movement with awareness
- Reflection prompts`
    };

    const prompt = systemPrompts[actionType] || systemPrompts.checkin;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: `Provide guidance for: ${actionLabel}` }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const guidance = data.choices?.[0]?.message?.content;

    if (!guidance) {
      throw new Error("No guidance in AI response");
    }

    console.log("Generated guidance successfully");

    return new Response(JSON.stringify({ guidance }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-action-guidance function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        details: "Failed to generate action guidance"
      }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
