module.exports = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'No text provided for analysis.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on the server.' });
  }

  const prompt = `
    You are a Privacy Policy Analyst. Your task is to analyze the following privacy policy text and provide a detailed assessment.

    **Instructions:**

    1.  **Read the entire policy text carefully.** Understand the context and meaning of each section.
    2.  **Identify key information** related to the following topics:
        *   Data Collection
        *   Data Sharing
        *   Data Retention
        *   User Rights
        *   Data Security
        *   Cookie Policy
    3.  **For each topic, provide a rating:** "Good", "Average", or "Poor".
        *   **Good:** The policy is clear, transparent, and respects user privacy.
        *   **Average:** The policy is somewhat vague or has some practices that could be improved.
        *   **Poor:** The policy is unclear, invasive, or lacks important information.
    4.  **For each topic, provide a direct quote** from the policy that best justifies your rating. The quote should be the most relevant sentence or two.
    5.  **Provide an overall risk score** from 1 to 5, where 5 is the safest and 1 is the riskiest.
    6.  **Write a brief, overall summary** in the "text" field that explains the risk score and highlights the most important findings.
    7.  **If the policy mentions linking or redirecting** to another policy, note this in your summary.

    **Output Format:**

    Return a single JSON object with the following structure:
    {
      "score": number,
      "text": string,
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

  try {
    console.log('Received text for analysis:', text.substring(0, 200)); // Log the first 200 chars

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

    console.log('Received response from Gemini:', JSON.stringify(responseBody, null, 2));
    
    // Clean the response to remove the markdown code block
    const rawText = responseBody.candidates[0].content.parts[0].text;
    const jsonText = rawText.replace(/```json\n|```/g, '');
    
    const analysisResult = JSON.parse(jsonText);
    
    res.status(200).json(analysisResult);
  } catch (error) {
    console.error('Error analyzing policy:', error);
    res.status(500).json({ error: 'Failed to analyze the privacy policy.' });
  }
};
