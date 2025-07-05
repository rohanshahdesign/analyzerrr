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
    if (!response || response.error) {
      resultDiv.innerHTML = `<p>Error: ${response ? response.error : 'No response from the background script.'}</p>`;
      return;
    }

    if (response.score) {
      const { score, text, summary, details } = response;
      
      resultDiv.innerHTML = `
        <div class="score-section">
          <div class="score-visual">
            <svg class="score-arc" viewBox="0 0 100 100">
              <circle class="score-arc-background" cx="50" cy="50" r="40"></circle>
              <circle class="score-arc-foreground score-${score}-stroke" cx="50" cy="50" r="40"></circle>
            </svg>
            <div class="score-text-container">
              <span class="score-number score-${score}-color">${score}</span>
              <span class="score-total">/5</span>
            </div>
          </div>
          <div class="score-rating score-${score}-color">${text}</div>
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
      if (details) {
        details.forEach(item => {
          const topicDiv = document.createElement('div');
          topicDiv.innerHTML = `
            <div class="topic">
              <span class="topic-name">${item.topic}</span>
              <div class="topic-rating-container">
                <span class="topic-rating rating-${item.rating.toLowerCase()}">${item.rating}</span>
                <img src="icons/caretdown.svg" alt="Toggle" class="toggle">
              </div>
            </div>
            <div class="topic-quote" style="display: none;">
              <p>"${item.quote}"</p>
            </div>
          `;
          detailsContainer.appendChild(topicDiv);
        });
      }

      updateScoreArc(score);
    } else {
      resultDiv.innerHTML = '<p>Could not analyze the privacy policy.</p>';
    }
  }

  function updateScoreArc(score) {
    const arc = document.querySelector('.score-arc-foreground');
    if (arc) {
      const radius = arc.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (score / 5) * circumference;
      arc.style.strokeDasharray = `${circumference} ${circumference}`;
      arc.style.strokeDashoffset = offset;
    }
  }

  document.body.addEventListener('click', function(event) {
    const toggle = event.target.closest('.toggle');
    if (toggle) {
      const topicContainer = toggle.closest('.topic').parentElement;
      const quoteDiv = topicContainer.querySelector('.topic-quote');
      
      if (quoteDiv.style.display === 'none' || quoteDiv.style.display === '') {
        quoteDiv.style.display = 'block';
        toggle.classList.add('rotated');
      } else {
        quoteDiv.style.display = 'none';
        toggle.classList.remove('rotated');
      }
    }

    const closeIcon = event.target.closest('.close-icon');
    if (closeIcon) {
      window.close();
    }
  });
});
