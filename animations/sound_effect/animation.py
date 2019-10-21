import cv2
import numpy as np
import pyfastnoisesimd as fns



def image_resize(image, width = None, height = None, inter = cv2.INTER_AREA):
    # initialize the dimensions of the image to be resized and
    # grab the image size
    dim = None
    (h, w) = image.shape[:2]

    # if both the width and height are None, then return the
    # original image
    if width is None and height is None:
        return image

    # check to see if the width is None
    if width is None:
        # calculate the ratio of the height and construct the
        # dimensions
        r = height / float(h)
        dim = (int(w * r), height)

    # otherwise, the height is None
    else:
        # calculate the ratio of the width and construct the
        # dimensions
        r = width / float(w)
        dim = (width, int(h * r))

    # resize the image
    resized = cv2.resize(image, dim, interpolation = inter)

    # return the resized image
    return resized


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
perlin.frequency = 0.05
perlin.noiseType = fns.NoiseType.Perlin
perlin.fractal.octaves = 8
perlin.fractal.lacunarity = 2.1
perlin.fractal.gain = 0.2
result = perlin.genAsGrid(shape)

result = (((result - np.min(result)) * (1 - 0.4)) / (np.max(result) - np.min(result))) + 0.4

# result = result - np.min(result) / (np.max(result) + np.min(result)) 
# print(np.max(result))
# print(np.min(result))




img_array = []

fourcc = cv2.VideoWriter_fourcc('M','J','P','G')
out = cv2.VideoWriter('a.avi',fourcc, 24.0, (1000,579))


for c, i in enumerate(lst):
	windows = cv2.cvtColor(result[c], cv2.COLOR_GRAY2BGR)


	bars_hsv = np.zeros((height, width, 3), dtype='uint8')


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

		bars_hsv = cv2.line(bars_hsv, (c1,int(new_height*1.2)), (c1, height), (h_color, 255, 255), 1)
		
	bars_bgr = cv2.cvtColor(bars_hsv, cv2.COLOR_HSV2BGR)
	final = (np.float32(bars_bgr) * np.float32(windows))
	final = np.uint8(final)
	cv2.imshow("img", final)
	cv2.waitKey(1)

	# print(np.min(windows))
	# print(np.max(windows))


	final = cv2.GaussianBlur(image_resize(final, width=1000), (31, 31), 15)
	print(final.shape)
	# img_array.append(final)
	# img = final.astype('uint8')
	
	out.write(final)

	

# cv2.destroyAllWindows()
# print(final.shape)
# img_array += img_array [::-1]

# for img in img_array:
# 	img = np.float64(img)
# 	print(img.dtype)
# 	print(img.shape)
# 	cv2.imshow("win",img)
# 	cv2.waitKey(1)

# 	img = img.astype('uint8')
# 	out.write(img)
	
cv2.destroyAllWindows()
out.release()