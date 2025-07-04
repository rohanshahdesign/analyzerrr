document.addEventListener('DOMContentLoaded', function() {
  const analyzeButton = document.getElementById('analyze');
  const resultDiv = document.getElementById('result');

  analyzeButton.addEventListener('click', function() {
    resultDiv.innerHTML = '<div class="loader"></div>';
    chrome.runtime.sendMessage({ action: "analyze" }, function(response) {
      if (response && response.error) {
        resultDiv.innerHTML = `<p>Error: ${response.error}</p>`;
      } else if (response && response.score) {
        resultDiv.innerHTML = `
          <h3>Risk Score: ${response.score}/5 (${response.text})</h3>
          <div id="details"></div>
        `;
        const detailsDiv = document.getElementById('details');
        response.details.forEach(item => {
          const topicDiv = document.createElement('div');
          topicDiv.className = 'topic';
          topicDiv.innerHTML = `
            <div class="topic-header">
              <strong>${item.topic}:</strong> ${item.rating}
              <span class="toggle">+</span>
            </div>
            <div class="topic-quote" style="display: none;">
              <p>"${item.quote}"</p>
            </div>
          `;
          detailsDiv.appendChild(topicDiv);
        });
      } else {
        resultDiv.innerHTML = '<p>Could not analyze the privacy policy.</p>';
      }
    });
  });

  document.body.addEventListener('click', function(event) {
    if (event.target.classList.contains('toggle')) {
      const quoteDiv = event.target.parentElement.nextElementSibling;
      if (quoteDiv.style.display === 'none') {
        quoteDiv.style.display = 'block';
        event.target.textContent = '-';
      } else {
        quoteDiv.style.display = 'none';
        event.target.textContent = '+';
      }
    }
  });
});
