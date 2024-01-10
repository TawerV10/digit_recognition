import tensorflow as tf
from PIL import Image
import matplotlib.pyplot as plt
import numpy as np

model = tf.keras.models.load_model('digits/digit_recognizer.h5')

img = Image.open('image.png')
img = img.convert('L')
img = img.resize((28, 28))

data = np.asarray(img)
data = np.abs(255 - data)
data = data.reshape((28, 28, 1)) / 255

probs = model.predict(np.array([data])[:1])
print(f'This is {np.argmax(probs)} with prob {probs.max()}')

plt.imshow(data, cmap='gray')
plt.show()
