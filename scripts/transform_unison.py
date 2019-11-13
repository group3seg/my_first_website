import cv2
import numpy as np
import imutils

img = cv2.imread('UNISONScreenshot.png')

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

gray = imutils.resize(gray, width=100)
(T, threshInv) = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)

threshInv = threshInv / 255

cv2.imshow('img', threshInv)
print(threshInv.shape)


cv2.waitKey(0)
cv2.destroyAllWindows()

with open('data.txt', 'w') as file:
	for e in threshInv:
		file.write("[")
		for i in range(len(e)):
			file.write(str(e[i]))
			if i != len(e)-1:
				file.write(", ")
		file.write("], ")