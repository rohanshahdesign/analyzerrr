function analyzePolicy(text) {
  const analysis = {
    score: 5,
    text: "No Worry",
    details: []
  };

  const rules = {
    "Data Sharing": [
      {
        regex: /do not share|do not sell|will not share|will not sell/i,
        rating: "Good",
        impact: 0
      },
      {
        regex: /share with third parties|share with partners|sell your data/i,
        rating: "Poor",
        impact: -2
      },
      {
        regex: /may share/i,
        rating: "Average",
        impact: -1
      }
    ],
    "User Rights": [
      {
        regex: /you have the right to access, correct, or delete/i,
        rating: "Good",
        impact: 0
      },
      {
        regex: /you can request access/i,
        rating: "Average",
        impact: -1
      }
    ],
    "Data Retention": [
      {
        regex: /retain your data for as long as necessary/i,
        rating: "Average",
        impact: -1
      },
      {
        regex: /retain your data indefinitely/i,
        rating: "Poor",
        impact: -2
      },
      {
        regex: /delete your data within .* days/i,
        rating: "Good",
        impact: 0
      }
    ],
    "Data Security": [
      {
        regex: /we take reasonable measures to protect your data/i,
        rating: "Average",
        impact: -1
      },
      {
        regex: /we use industry-standard encryption/i,
        rating: "Good",
        impact: 0
      },
      {
        regex: /we cannot guarantee the security of your data/i,
        rating: "Poor",
        impact: -2
      }
    ],
    "Cookie Policy": [
      {
        regex: /we use cookies for advertising/i,
        rating: "Poor",
        impact: -2
      },
      {
        regex: /we use cookies for functionality/i,
        rating: "Good",
        impact: 0
      },
      {
        regex: /we use cookies for analytics/i,
        rating: "Average",
        impact: -1
      }
    ]
  };

  let score = 5;

  for (const topic in rules) {
    let topicRating = "Good";
    let topicQuote = `No specific mention of ${topic.toLowerCase()} found.`;
    let topicImpact = 0;

    for (const rule of rules[topic]) {
      const match = text.match(rule.regex);
      if (match) {
        topicRating = rule.rating;
        topicImpact = rule.impact;
        const sentenceMatch = text.match(new RegExp(`[^.!?]*${match[0]}[^.!?]*[.!?]`, 'i'));
        topicQuote = sentenceMatch ? sentenceMatch[0].trim() : "Could not extract a specific quote.";
        break; // First rule matched wins for this topic
      }
    }
    analysis.details.push({
      topic: topic,
      rating: topicRating,
      quote: topicQuote
    });
    score += topicImpact;
  }

  analysis.score = Math.max(1, Math.min(5, score)); // Clamp score between 1 and 5

  const scoreMap = {
    1: "Danger",
    2: "High Risk",
    3: "Moderate Risk",
    4: "Low Risk",
    5: "No Worry"
  };
  analysis.text = scoreMap[analysis.score];

  return analysis;
}
