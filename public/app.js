document.getElementById('uploadButton').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file && file.type === 'image/jpeg') {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Image = reader.result.split(',')[1];
            document.getElementById('imagePreview').src = reader.result;
            detectModerationLabels(base64Image);
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select a JPG image.');
    }
});

function detectModerationLabels(base64Image) {
    fetch('/api/detect-moderation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: base64Image })
    })
    .then(response => response.json())
    .then(data => {
        displayModerationLabels(data.ModerationLabels);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while detecting moderation labels.');
    });
}

function displayModerationLabels(labels) {
    const moderationLabelsDiv = document.getElementById('moderationLabels');
    moderationLabelsDiv.innerHTML = '';

    if (labels.length === 0) {
        moderationLabelsDiv.textContent = 'No moderation labels detected.';
        return;
    }

    const ul = document.createElement('ul');
    labels.forEach(label => {
        const li = document.createElement('li');
        li.textContent = label.Name;
        ul.appendChild(li);
    });

    moderationLabelsDiv.appendChild(ul);
}

