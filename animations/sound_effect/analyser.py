from scipy.io import wavfile # scipy library to read wav files
import numpy as np

AudioName = "/home/sebastien/Documents/my_first_website/animations/sound_effect/vignesh.wav" # Audio File
fs, Audiodata = wavfile.read(AudioName)
print(len(Audiodata))
# Plot the audio signal in time
import matplotlib.pyplot as plt
# plt.plot(Audiodata)
# plt.title('Audio signal in time',size=16)

# # spectrum
# from scipy.fftpack import fft # fourier transform
# n = len(Audiodata) 
# AudioFreq = fft(Audiodata)
# AudioFreq = AudioFreq[0:int(np.ceil((n+1)/2.0))] #Half of the spectrum
# MagFreq = np.abs(AudioFreq) # Magnitude
# MagFreq = MagFreq / float(n)
# # power spectrum
# MagFreq = MagFreq**2
# if n % 2 > 0: # ffte odd 
#     MagFreq[1:len(MagFreq)] = MagFreq[1:len(MagFreq)] * 2
# else:# fft even
#     MagFreq[1:len(MagFreq) -1] = MagFreq[1:len(MagFreq) - 1] * 2 

# plt.figure()
# freqAxis = np.arange(0,int(np.ceil((n+1)/2.0)), 1.0) * (fs / n);
# plt.plot(freqAxis/1000.0, 10*np.log10(MagFreq)) #Power spectrum
# plt.xlabel('Frequency (kHz)'); plt.ylabel('Power spectrum (dB)');


#Spectrogram
# class element:
# 	def __init__(self):
# 		self.arr = []

# 	def add_element(e):
# 		self.arr.append(e)
# 	def get_arr():
# 		return str(self.arr)

# def get_array(arr):
# 	for e in arr:
# 		if len(e) > 1:




from scipy import signal
N = 516 #Number of point in the fft
# f, t, Sxx = signal.spectrogram(Audiodata, fs,window = signal.blackman(N),nfft=N)
# print(signal.blackman(N))
print(len(signal.blackman(N)))
f, t, Sxx = signal.spectrogram(Audiodata, fs,window = signal.blackman(N),nfft=N)

plt.figure()
Sxx = 10*np.log10(Sxx)
# Sxx = np.around(Sxx.astype('float16'), decimals=5)
Sxx = Sxx.transpose()
arr = Sxx.tolist()
with open("data.txt", "w") as file:
	file.write(str(arr))

print(np.max(Sxx))
print(np.min(Sxx))

# print(str(arr))
print(Sxx.shape)
print(t.shape)
print(f.shape)
print(len(arr))
print(len(arr[0]))
plt.pcolormesh(f, t,Sxx) # dB spectrogram
#plt.pcolormesh(t, f,Sxx) # Lineal spectrogram
plt.ylabel('Frequency [Hz]')
plt.xlabel('Time [seg]')
plt.title('Spectrogram',size=16);

plt.show()