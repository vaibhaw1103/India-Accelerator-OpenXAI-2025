import { NextRequest, NextResponse } from "next/server";
import ollama from "ollama";

const model = "llama3:latest";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { symptoms } = data;

    if (!symptoms) {
      return NextResponse.json(
        { error: "Symptoms are required" },
        { status: 400 }
      );
    }

    // Input validation
    const cleanSymptoms = symptoms.trim();
    
    // Check for minimum length and meaningful content
    if (cleanSymptoms.length < 10) {
      return NextResponse.json(
        { error: "Please provide a more detailed description of your symptoms (at least 10 characters)" },
        { status: 400 }
      );
    }

    // Check for non-medical content (greetings, random text, etc.)
    const nonMedicalPatterns = [
      /^(hi|hello|hey|hii|hiii|yo|sup|what's up|whatsup)$/i,
      /^(test|testing|123|abc|xyz|qwerty)$/i,
      /^[^a-zA-Z]*$/,  // Only numbers/symbols
      /^(.)\1{4,}$/,    // Repeated characters like "aaaaa"
    ];

    const isNonMedical = nonMedicalPatterns.some(pattern => pattern.test(cleanSymptoms));
    
    if (isNonMedical) {
      return NextResponse.json(
        { error: "Please describe your actual medical symptoms. For example: 'headache and fever for 2 days' or 'chest pain when breathing'" },
        { status: 400 }
      );
    }

    const prompt = `You are an AI medical assistant. IMPORTANT: First determine if the input describes actual medical symptoms or health concerns.

Input: ${cleanSymptoms}

VALIDATION STEP: Carefully analyze if this input is:
1. A real medical symptom description with context (duration, severity, location, etc.)
2. A test input, single word, or vague statement without medical context
3. Someone trying to test the system with disease names or simple words

If the input is NOT a genuine medical symptom description (like single words "cold", "fever", test phrases, or lacks proper medical context), respond with:
{
  "error": "invalid_input",
  "message": "Please describe your actual medical symptoms with proper context"
}

EXAMPLES OF INVALID INPUTS:
- Single words: "cold", "fever", "headache", "pain"
- Test phrases: "test cold", "testing fever", "check headache"
- Disease names without symptoms: "covid", "flu", "diabetes"
- Vague statements: "I feel bad", "something wrong", "not well"

EXAMPLES OF VALID INPUTS:
- "I've had a persistent headache for 3 days, mainly on the left side, with nausea"
- "Chest pain when breathing deeply, started yesterday after exercise"
- "Fever of 101°F for 2 days with body aches and sore throat"

If the input DOES describe genuine medical symptoms with proper context, analyze them and provide a structured response in JSON format:

{
  "conditions": [
    {
      "name": "Condition Name",
      "description": "Brief description of the condition",
      "likelihood": 75,
      "severity": "medium"
    }
  ],
  "recommendedSpecialist": "Type of doctor to visit (e.g., 'Cardiologist', 'General Practitioner')",
  "insights": [
    {
      "category": "red_flags",
      "title": "Warning Signs",
      "content": "Any urgent symptoms that need immediate attention"
    },
    {
      "category": "lifestyle",
      "title": "Lifestyle Recommendations",
      "content": "Things to do while waiting for medical consultation"
    },
    {
      "category": "prevention",
      "title": "Prevention Tips",
      "content": "How to prevent similar issues in the future"
    }
  ],
  "confidenceScores": [
    {
      "condition": "Condition Name",
      "confidence": 75,
      "reasoning": "Why this confidence level"
    }
  ]
}

Important guidelines:
- ONLY analyze if input describes actual medical symptoms with proper context
- Reject single words or vague statements without medical details
- Provide 2-4 most likely conditions
- Likelihood should be 0-100
- Severity can be "low", "medium", or "high"
- Always recommend seeing a healthcare professional
- Include red flags for urgent symptoms
- Be conservative with diagnoses
- Focus on common conditions first
- Provide practical lifestyle advice`;

    const response = await ollama.chat({
      model,
      messages: [{ role: "user", content: prompt }],
      stream: false,
    });

    let analysisResult;
    try {
      // Try to parse the JSON response
      const jsonMatch = response.message.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Check if AI detected invalid input
        if (parsed.error === "invalid_input") {
          return NextResponse.json(
            { error: parsed.message || "Please describe your actual medical symptoms" },
            { status: 400 }
          );
        }
        
        analysisResult = parsed;
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      // Fallback if JSON parsing fails
      analysisResult = {
        conditions: [
          {
            name: "Multiple Possible Conditions",
            description: "Based on your symptoms, several conditions could be possible. A healthcare professional can provide proper diagnosis.",
            likelihood: 50,
            severity: "medium"
          }
        ],
        recommendedSpecialist: "General Practitioner",
        insights: [
          {
            category: "red_flags",
            title: "When to Seek Immediate Care",
            content: "If symptoms worsen, become severe, or you experience difficulty breathing, chest pain, or severe headache, seek immediate medical attention."
          },
          {
            category: "lifestyle",
            title: "General Care",
            content: "Rest, stay hydrated, monitor your symptoms, and avoid strenuous activities until you can see a healthcare provider."
          },
          {
            category: "prevention",
            title: "Health Maintenance",
            content: "Maintain a healthy lifestyle with regular exercise, balanced diet, adequate sleep, and regular health check-ups."
          }
        ],
        confidenceScores: [
          {
            condition: "Multiple Possible Conditions",
            confidence: 50,
            reasoning: "Symptoms require professional medical evaluation for accurate diagnosis."
          }
        ]
      };
    }

    return NextResponse.json(analysisResult);
  } catch (error: any) {
    console.error("Error analyzing symptoms:", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to analyze symptoms" },
      { status: 500 }
    );
  }
}
