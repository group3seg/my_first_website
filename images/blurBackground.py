import cv2

img = cv2.imread("/home/sebastien/Documents/my_first_website/output-onlinepngtools.png")
img = cv2.GaussianBlur(img, (31, 31), 5)

cv2.imshow("img", img)
cv2.waitKey(0)
cv2.destroyAllWindows()