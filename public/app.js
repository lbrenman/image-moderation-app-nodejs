document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    const imagePreview = document.getElementById('imagePreview');
    const moderationLabels = document.getElementById('moderationLabels');

    if (file && file.type === 'image/jpeg') {
        const reader = new FileReader();
        reader.onloadend = () => {
            imagePreview.src = reader.result;
            imagePreview.classList.remove('hidden');
            moderationLabels.innerHTML = '<p class="text-gray-500">Analyzing image...</p>';
            detectModerationLabels(reader.result.split(',')[1]);
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select a JPG image.');
    }
});

function detectModerationLabels(base64Image) {
    const moderationLabels = document.getElementById('moderationLabels');

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
        moderationLabels.innerHTML = `
            <p class="text-red-500">Error detecting moderation labels</p>
        `;
    });
}

function displayModerationLabels(labels) {
    const moderationLabelsDiv = document.getElementById('moderationLabels');
    
    if (labels.length === 0) {
        moderationLabelsDiv.innerHTML = `
            <p class="text-green-500">No moderation labels detected</p>
        `;
        return;
    }

    const labelsList = labels.map(label => 
        `<li class="bg-white rounded-md p-2 my-1 shadow-sm">
            ${label.Name}
        </li>`
    ).join('');

    moderationLabelsDiv.innerHTML = `
        <div>
            <h3 class="text-lg font-semibold mb-2 text-gray-700">Detected Labels:</h3>
            <ul class="space-y-2">${labelsList}</ul>
        </div>
    `;
}