import cv2
import numpy as np
import pyfastnoisesimd as fns

height = 150


with open("data.txt", "r") as file:
	txt = file.readline()
	lst = eval(txt)
	print(type(lst))

print(np.min(np.array(lst)))
print(np.max(np.array(lst)))

time = len(lst)
width = len(lst[0])

shape = [time,height,width]
seed = np.random.randint(2**31)
N_threads = 4

perlin = fns.Noise(seed=seed, numWorkers=N_threads)
perlin.frequency = 0.02
perlin.noiseType = fns.NoiseType.Perlin
perlin.fractal.octaves = 4
perlin.fractal.lacunarity = 2.1
perlin.fractal.gain = 0.45
result = perlin.genAsGrid(shape)

result = (((result - np.min(result)) * (1 - 0.4)) / (np.max(result) - np.min(result))) + 0.4

# result = result - np.min(result) / (np.max(result) + np.min(result)) 
# print(np.max(result))
# print(np.min(result))









for c, i in enumerate(lst):
	windows = cv2.cvtColor(result[c], cv2.COLOR_GRAY2BGR)/255

	bars_hsv = np.zeros((height, width, 3))


	for c1, e in enumerate(i):
		OldValue = e
		OldMin = -90
		OldMax = 60
		NewMin = 0
		NewMax = height
		new_height = int((((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin)
		OldValue = c1
		OldMin = 0
		OldMax = width
		NewMin = 0
		NewMax = 150
		h_color = int((((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin)
		# print(h_color)

		bars_hsv = cv2.line(bars_hsv, (c1,new_height), (c1, height), (h_color, 255, 255), 1)
		
	bars_bgr = cv2.cvtColor(np.uint8(bars_hsv), cv2.COLOR_HSV2BGR)
	final = bars_bgr * windows
	print(np.min(windows))
	print(np.max(windows))


	# final = bars_bgr * windows

	cv2.imshow("win",final)
	cv2.waitKey(1)

cv2.destroyAllWindows()