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
    Analyze the following privacy policy and return a JSON object with a risk score from 1 to 5 (5 being the safest) and a detailed breakdown.
    The JSON object should have the following structure: { "score": number, "text": string, "details": [{ "topic": string, "rating": "Good" | "Average" | "Poor", "quote": string }] }
    The topics to analyze are: Data Sharing, User Rights, Data Retention, Data Security, and Cookie Policy.
    For each topic, provide a rating and a direct quote from the policy that justifies the rating.

    Privacy Policy Text:
    ${text}
  `;

  try {
    console.log('Received text for analysis:', text.substring(0, 200)); // Log the first 200 chars

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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
    const analysisResult = JSON.parse(responseBody.candidates[0].content.parts[0].text);
    
    res.status(200).json(analysisResult);
  } catch (error) {
    console.error('Error analyzing policy:', error);
    res.status(500).json({ error: 'Failed to analyze the privacy policy.' });
  }
};
