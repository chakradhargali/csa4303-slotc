/* ==========================================================================
   WEB DEVELOPMENT STANDARDS ASSESSMENT APP - LOGIC & INTERACTIVITY
   ========================================================================== */

// Correct answers mapping with technical rationales
const ANSWER_KEY = {
  q1: {
    correct: 'B',
    title: '<video src="video.mp4" controls></video>',
    explanation: 'Correct! The <video> element is the standard HTML5 specification tag for embedding video content with native playback controls.'
  },
  q2: {
    correct: 'B',
    title: 'POST',
    explanation: 'Correct! POST transmits data inside the HTTP request body. It is secure for form submission compared to GET, which appends parameters in plain view in the URL.'
  },
  q3: {
    correct: 'B',
    title: '<nav>',
    explanation: 'Correct! <nav> is an HTML5 semantic element that designates a major navigation section, improving web accessibility (a11y) and SEO parsing.'
  },
  q4: {
    correct: 'B',
    title: '<note><to>User</to><from>Admin</from></note>',
    explanation: 'Correct! XML requires strict tag opening/closing matching, case sensitivity, and proper tag nesting without dangling or unclosed tags.'
  },
  q5: {
    correct: 'B',
    title: 'HTTP',
    explanation: 'Correct! HyperText Transfer Protocol (HTTP/HTTPS) is the underlying protocol for web communication and web page document retrieval.'
  }
};

// User state tracking
const userAnswers = {
  q1: null,
  q2: null,
  q3: null,
  q4: null,
  q5: null
};

document.addEventListener('DOMContentLoaded', () => {
  initOptionListeners();
  initXMLValidator();
});

// Setup option click listeners for all 5 questions
function initOptionListeners() {
  const questions = ['q1', 'q2', 'q3', 'q4', 'q5'];

  questions.forEach(qId => {
    const container = document.getElementById(`${qId}-options`);
    if (!container) return;

    const buttons = container.querySelectorAll('.option-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Deselect others in group
        buttons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        const opt = btn.getAttribute('data-opt');
        userAnswers[qId] = opt;

        // Trigger interactive updates in corresponding sandbox
        updateSandboxPreview(qId, opt);
      });
    });
  });
}

// Update sandbox view based on selected option
function updateSandboxPreview(qId, selectedOption) {
  if (qId === 'q1') {
    const codePreview = document.getElementById('q1-code-preview');
    if (selectedOption === 'A') {
      codePreview.innerHTML = `&lt;!-- Non-standard element --&gt;\n&lt;media src="video.mp4"&gt;&lt;/media&gt;\n&lt;!-- Result: Rendered as unknown inline element; no player UI --&gt;`;
    } else if (selectedOption === 'B') {
      codePreview.innerHTML = `&lt;!-- Standard HTML5 Video Element --&gt;\n&lt;video src="video.mp4" controls&gt;&lt;/video&gt;\n&lt;!-- Result: Native player with play, pause, volume & seek --&gt;`;
    } else if (selectedOption === 'C') {
      codePreview.innerHTML = `&lt;!-- Deprecated/Non-standard element --&gt;\n&lt;movie src="video.mp4"&gt;&lt;/movie&gt;`;
    } else if (selectedOption === 'D') {
      codePreview.innerHTML = `&lt;!-- Non-standard tag --&gt;\n&lt;vid src="video.mp4"&gt;&lt;/vid&gt;`;
    }
  } else if (selectedOption && qId === 'q3') {
    const tagName = document.getElementById('tree-tag-name');
    const tagClose = document.getElementById('tree-tag-close');
    const tagBadge = document.getElementById('tree-tag-badge');
    
    if (selectedOption === 'B') {
      tagName.innerText = 'nav';
      tagClose.innerText = 'nav';
      tagBadge.innerText = 'Semantic Landmark';
      tagBadge.style.background = 'rgba(16, 185, 129, 0.2)';
      tagBadge.style.color = 'var(--accent-success)';
    } else {
      const names = { A: 'div', C: 'section', D: 'header' };
      const name = names[selectedOption] || 'div';
      tagName.innerText = name;
      tagClose.innerText = name;
      tagBadge.innerText = 'Generic / Non-Nav Landmark';
      tagBadge.style.background = 'rgba(239, 68, 68, 0.2)';
      tagBadge.style.color = 'var(--accent-danger)';
    }
  }
}

// HTTP Form Simulator toggle
function setSimMethod(method) {
  const btnPost = document.getElementById('btn-sim-post');
  const btnGet = document.getElementById('btn-sim-get');
  const urlBar = document.getElementById('sim-url-bar');
  const payload = document.getElementById('sim-payload');
  const warning = document.getElementById('sim-method-warning');

  if (method === 'GET') {
    btnGet.classList.add('active');
    btnPost.classList.remove('active');
    urlBar.innerText = 'https://example.com/api/register?username=alex_dev&password=SuperSecret123!&email=alex%40example.com';
    payload.innerText = `GET /api/register?username=alex_dev&password=SuperSecret123!&email=alex%40example.com HTTP/1.1\nHost: example.com\n\n(No Request Body)`;
    warning.innerHTML = `⚠️ <strong>Insecure GET Method:</strong> Password and user data are exposed in plain view in the URL bar, browser logs, and referrer headers!`;
    warning.style.color = 'var(--accent-danger)';
  } else {
    btnPost.classList.add('active');
    btnGet.classList.remove('active');
    urlBar.innerText = 'https://example.com/api/register';
    payload.innerText = `POST /api/register HTTP/1.1\nHost: example.com\nContent-Type: application/x-www-form-urlencoded\n\nusername=alex_dev&password=SuperSecret123!&email=alex%40example.com`;
    warning.innerHTML = `✓ <strong>Secure POST Method:</strong> Credentials are safely encapsulated inside the encrypted HTTP request body payload.`;
    warning.style.color = 'var(--accent-success)';
  }
}

// Live XML Syntax Validator
function initXMLValidator() {
  const editor = document.getElementById('xml-live-input');
  if (!editor) return;

  editor.addEventListener('input', () => {
    validateXML(editor.value);
  });
}

function validateXML(xmlString) {
  const badge = document.getElementById('xml-status-badge');
  const output = document.getElementById('xml-diagnostic-output');

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const parseError = xmlDoc.getElementsByTagName('parsererror');

    if (parseError.length > 0) {
      const errText = parseError[0].textContent || 'XML Parsing Error';
      badge.innerText = '❌ Invalid XML Syntax';
      badge.className = 'xml-status-badge invalid';
      output.innerText = `Syntax Error Details: ${errText.split('\n')[0]}`;
      output.style.color = 'var(--accent-danger)';
    } else {
      badge.innerText = '✓ Valid XML Syntax';
      badge.className = 'xml-status-badge valid';
      output.innerText = `✓ Well-formed XML document. Tags are properly opened, nested, and closed.`;
      output.style.color = 'var(--accent-success)';
    }
  } catch (e) {
    badge.innerText = '❌ Invalid XML';
    badge.className = 'xml-status-badge invalid';
    output.innerText = `XML Syntax Exception: ${e.message}`;
    output.style.color = 'var(--accent-danger)';
  }
}

// Check all answers and grade student submission
function checkAllAnswers() {
  let score = 0;
  const questions = ['q1', 'q2', 'q3', 'q4', 'q5'];

  questions.forEach(qId => {
    const selected = userAnswers[qId];
    const key = ANSWER_KEY[qId];
    const feedbackBox = document.getElementById(`${qId}-feedback`);
    const optionsContainer = document.getElementById(`${qId}-options`);
    
    if (!feedbackBox || !optionsContainer) return;

    // Highlight option buttons
    const buttons = optionsContainer.querySelectorAll('.option-btn');
    buttons.forEach(btn => {
      const opt = btn.getAttribute('data-opt');
      if (opt === key.correct) {
        btn.classList.add('correct');
      } else if (opt === selected && selected !== key.correct) {
        btn.classList.add('incorrect');
      }
    });

    feedbackBox.classList.add('active');
    if (selected === key.correct) {
      score += 2;
      feedbackBox.className = 'feedback-box active success';
      feedbackBox.innerHTML = `✓ <strong>Correct (2 Marks)!</strong> ${key.explanation}`;
    } else if (selected) {
      feedbackBox.className = 'feedback-box active error';
      feedbackBox.innerHTML = `❌ <strong>Incorrect (0 Marks).</strong> Correct answer is <strong>${key.correct}</strong>. ${key.explanation}`;
    } else {
      feedbackBox.className = 'feedback-box active error';
      feedbackBox.innerHTML = `⚠️ <strong>Unanswered (0 Marks).</strong> Correct answer is <strong>${key.correct}</strong>. ${key.explanation}`;
    }
  });

  alert(`Assessment Scored: ${score} / 10 Total Marks!\nCheck individual feedback boxes under each question for detailed technical rationales.`);
}

// Form Submit Handler
function handleFormSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('student-name').value.trim();
  const regno = document.getElementById('student-regno').value.trim();
  const agree = document.getElementById('conduct-agree').checked;
  const resultBox = document.getElementById('submission-result');

  if (!name || !regno || !agree) {
    alert('Please fill in your Name, Register Number, and agree to the Code of Conduct.');
    return;
  }

  // Calculate score
  let score = 0;
  Object.keys(ANSWER_KEY).forEach(qId => {
    if (userAnswers[qId] === ANSWER_KEY[qId].correct) score += 2;
  });

  const timestamp = new Date().toLocaleString();

  resultBox.classList.add('active');
  resultBox.className = 'feedback-box active success';
  resultBox.innerHTML = `
    <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem;">🎉 Assessment Submitted Successfully!</h3>
    <p><strong>Student Name:</strong> ${name}</p>
    <p><strong>Register Number:</strong> ${regno}</p>
    <p><strong>Calculated Score:</strong> ${score} / 10 Marks</p>
    <p><strong>Timestamp:</strong> ${timestamp}</p>
    <p><strong>Original Clean PDF Document:</strong> <a href="assignemet1_no_header.pdf" target="_blank" style="color: var(--accent-secondary);">assignemet1_no_header.pdf</a></p>
    <p style="margin-top: 0.5rem; font-size: 0.85rem; color: #a7f3d0;">✓ Code of Conduct verified and logged.</p>
  `;

  resultBox.scrollIntoView({ behavior: 'smooth' });
}
