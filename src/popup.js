document.addEventListener('DOMContentLoaded', function() {
  const analyzeButton = document.getElementById('analyze');
  const resultDiv = document.getElementById('result');

  if (analyzeButton) {
    analyzeButton.addEventListener('click', function() {
      resultDiv.innerHTML = '<div class="loader"></div>';
      chrome.runtime.sendMessage({ action: "analyze" }, function(response) {
        renderResponse(response);
      });
    });
  }

  function renderResponse(response) {
    if (!response) {
      resultDiv.innerHTML = '<p>Error: No response from the background script.</p>';
      return;
    }
    if (response.error) {
      resultDiv.innerHTML = `<p>Error: ${response.error}</p>`;
      return;
    }
    if (response.score) {
      const score = response.score;
      const scoreText = response.text;
      const summary = response.details.find(d => d.topic === "Summary")?.quote || "No summary available.";
      const details = response.details.filter(d => d.topic !== "Summary");

      resultDiv.innerHTML = `
        <div class="score-section">
          <div class="score-visual">
            <img src="http://localhost:3845/assets/8a698373084b36220f6984952c339ed3af66e388.svg" alt="Score Ring">
            <div class="score-text-container">
              <span class="score-number">${score}</span>
              <span class="score-total">/5</span>
            </div>
          </div>
          <div class="score-rating score-${score}">${scoreText}</div>
        </div>
        <div class="summary-section">
          <div class="section-title">Summary</div>
          <p class="summary-text">${summary}</p>
        </div>
        <div class="details-section">
          <div class="section-title">Detailed breakdown</div>
          <div id="details-container"></div>
        </div>
      `;

      const detailsContainer = document.getElementById('details-container');
      details.forEach(item => {
        const topicDiv = document.createElement('div');
        topicDiv.innerHTML = `
          <div class="topic">
            <span class="topic-name">${item.topic}</span>
            <div class="topic-rating-container">
              <span class="topic-rating rating-${item.rating.toLowerCase()}">${item.rating}</span>
              <img src="http://localhost:3845/assets/d353e0c28001a9a46ccf089003ed2d00ffd2e47f.svg" alt="Toggle" class="toggle">
            </div>
          </div>
          <div class="topic-quote" style="display: none;">
            <p>"${item.quote}"</p>
          </div>
        `;
        detailsContainer.appendChild(topicDiv);
      });
    } else {
      resultDiv.innerHTML = '<p>Could not analyze the privacy policy.</p>';
    }
  }

  document.body.addEventListener('click', function(event) {
    if (event.target.classList.contains('toggle')) {
      const topicDiv = event.target.closest('.topic');
      const quoteDiv = topicDiv.nextElementSibling;
      if (quoteDiv.style.display === 'none') {
        quoteDiv.style.display = 'block';
      } else {
        quoteDiv.style.display = 'none';
      }
    }
    if (event.target.classList.contains('close-icon')) {
      window.close();
    }
  });
});
