document.addEventListener('DOMContentLoaded', async function () {
    const sliders = Array.from({ length: 10 }, (_, i) => document.getElementById(`digit-${i}`));
    const valueElements = Array.from({ length: 10 }, (_, i) => document.getElementById(`value${i}`));

    const canvas = document.getElementById('drawingCanvas');
    const context = canvas.getContext('2d');
    let drawing = false;

    canvas.addEventListener('mousedown', () => {
        drawing = true;
    });

    canvas.addEventListener('mouseup', () => {
        drawing = false;
        context.beginPath();
        predictDigit();
        clearCanvas();
    });

    canvas.addEventListener('mousemove', draw);

    function draw(e) {
        if (!drawing) return;

        context.lineWidth = 28;
        context.lineCap = 'round';
        context.strokeStyle = '#000';

        context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        context.stroke();
        context.beginPath();
        context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    }

    function clearCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    async function predictDigit() {
        const canvasData = canvas.toDataURL();
        const response = await fetch('/predict_digit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ canvasData }),
        });

        const result = await response.json();
        const predictedDigit = result.digit;
        const probabilities = result.probs;
        
        updateSliders(probabilities);
        highlightMaxValueSlider(predictedDigit);
        clearCanvas();
    }

    function updateSliders(probabilities) {
        sliders.forEach((slider, i) => {
            slider.value = probabilities[i].toFixed(2);
        });
    }

    function highlightMaxValueSlider(predictedDigit) {
        valueElements.forEach((valueElement, i) => {
            valueElement.classList.remove('max-value-element');
        });
        valueElements[predictedDigit].classList.add('max-value-element');
    }
});
