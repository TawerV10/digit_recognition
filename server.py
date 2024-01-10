from flask import Flask, render_template, request, jsonify
import tensorflow as tf
from PIL import Image
import numpy as np
import base64
import io

app = Flask(__name__)

model = tf.keras.models.load_model('model/digit_recognizer.h5')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict_digit', methods=['POST'])
def predict_digit():
    data = request.get_json()
    canvas_data = data.get('canvasData')
    canvas_data = canvas_data.split(',')[1]

    image = Image.open(io.BytesIO(base64.b64decode(canvas_data)))
    alpha_channel = image.split()[-1]

    grayscale_img = Image.new("L", image.size, 255)
    grayscale_img.paste(image, mask=alpha_channel)
    grayscale_img = grayscale_img.resize((28, 28))

    data = np.asarray(grayscale_img)
    data = np.abs(255 - data)
    data = data.reshape((28, 28, 1)) / 255.0

    probs = model.predict(np.array([data]))[0]
    digit = np.argmax(probs)
    probs_list = probs.tolist()

    print(probs)
    print(f'This is {digit} with probability {probs.max()}')

    return jsonify({'digit': int(digit), 'probs': probs_list})

if __name__ == '__main__':
    app.run(debug=True)
