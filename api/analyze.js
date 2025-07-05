module.exports = async (req, res) => {
  const { text, task } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'No text provided for analysis.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on the server.' });
  }

  let prompt;
  if (task === 'preliminary_check') {
    prompt = `
      You are a document classifier. Your task is to determine if the following text is a privacy policy.

      **Instructions:**
      1. Read the text and identify keywords and phrases commonly found in privacy policies (e.g., "privacy policy", "data collection", "your rights").
      2. Return a single JSON object with the key "is_privacy_policy" and a boolean value.

      **Output Format:**
      {
        "is_privacy_policy": boolean
      }

      **Text:**
      ${text}
    `;
  } else {
    prompt = `
      You are a Privacy Policy Analyst. Your task is to analyze the following privacy policy text and provide a detailed assessment.

      **Instructions:**
      1.  **Read the entire policy text carefully.**
      2.  **Identify key information** related to: Data Collection, Data Sharing, Data Retention, User Rights, Data Security, and Cookie Policy.
      3.  **For each topic, provide a rating:** "Good", "Average", or "Poor".
      4.  **For each topic, provide a direct quote** from the policy that justifies your rating.
      5.  **Provide an overall risk score** from 1 to 5 (5 is safest).
      6.  **Based on the score, provide a risk level text**: 1: "Danger", 2: "High Risk", 3: "Moderate Risk", 4: "Low Risk", 5: "No Worry".
      7.  **Write a brief summary** explaining the risk score.
      8.  **Extract keywords** from the summary that should be bolded.

      **Output Format:**
      Return a single JSON object:
      {
        "score": number,
        "text": string, // This should be the risk level text
        "summary": string,
        "keywords": [string],
        "details": [
          {
            "topic": string,
            "rating": "Good" | "Average" | "Poor",
            "quote": string
          }
        ]
      }

      **Privacy Policy Text:**
      ${text}
    `;
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const responseBody = await response.json();

    if (!response.ok) {
      console.error('Error from Gemini API:', JSON.stringify(responseBody, null, 2));
      return res.status(response.status).json({ error: 'Error from Gemini API.' });
    }

    const rawText = responseBody.candidates[0].content.parts[0].text;
    const jsonText = rawText.replace(/```json\n|```/g, '');
    const result = JSON.parse(jsonText);
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error analyzing policy:', error);
    res.status(500).json({ error: 'Failed to analyze the privacy policy.' });
  }
};
