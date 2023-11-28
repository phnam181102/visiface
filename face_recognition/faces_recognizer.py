import face_recognition
import numpy as np
import cv2
import pickle
import os
import pandas as pd

MODEL = "hog"  # Can be "hog" or "cnn"
data_directory = "data"

register_df_file = os.path.join(data_directory, 'register_data.csv')
face_encodings_file = os.path.join(data_directory, 'face_encodings.pkl')

# Read the list of face encodings from the face_encodings.pkl file
if os.path.exists(face_encodings_file):
    with open(face_encodings_file, 'rb') as f:
        encodeListKnown = pickle.load(f)
else:
    encodeListKnown = []

if os.path.exists(register_df_file):
    register_df = pd.read_csv(register_df_file)
else:
    register_df = pd.DataFrame(columns=['ID', 'Full Name', 'Pin Code'])
    register_df.to_csv(register_df_file, index=False)

TOLERANCE = 0.4
FONT = cv2.FONT_HERSHEY_DUPLEX
FONT_SIZE = 0.8
FONT_THICKNESS = 1
FRAME_THICKNESS = 2
SCALER = 4

ID_DETECTED = None
PIN_CODE = None
NUM_FACES_DETECTED = 0

def identify_faces(frame):
    global ID_DETECTED, NUM_FACES_DETECTED, PIN_CODE

    resized_image = cv2.resize(frame, (0, 0), None, 0.25, 0.25)
    resized_image = cv2.cvtColor(resized_image, cv2.COLOR_BGR2RGB)

    facesCurFrame = face_recognition.face_locations(resized_image, model=MODEL)
    encodesCurFrame = face_recognition.face_encodings(resized_image, facesCurFrame)

    NUM_FACES_DETECTED = 0
    for encodeFace, faceLoc in zip(encodesCurFrame, facesCurFrame):
        text = "Unrecognized"
        color = (0, 0, 255)

        if encodeFace.shape == (128,):  # Check the size of face_encoding
            matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
            faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)

            matchIndex = np.argmin(faceDis)

            if matchIndex is not None and 0 <= matchIndex < len(register_df) and matches[matchIndex]:
                NUM_FACES_DETECTED = NUM_FACES_DETECTED + 1
                ID = register_df.iloc[matchIndex]['ID']
                PIN_CODE = str(register_df.iloc[matchIndex]['Pin Code'])
                text = register_df.iloc[matchIndex]['Full Name'].upper()
                color = (255, 151, 51)

                if ID != ID_DETECTED:
                    ID_DETECTED = ID

            y1, x2, y2, x1 = faceLoc
            top_left = (x1 * SCALER , y1 * SCALER - 30)
            bottom_right = (x2 * SCALER, y2 * SCALER)
            height = (x2 * SCALER, max(30, y1 * SCALER + int(abs(y2 - y1)) - 45))

            cv2.rectangle(frame, top_left, bottom_right, color, FRAME_THICKNESS)
            cv2.rectangle(frame, top_left, height , color, cv2.FILLED)

            cv2.putText(frame, text,
                            (5+x1*SCALER, SCALER*(y1+int(abs(x2-x1)/9.5) - 6)),
                            FONT, min(FONT_SIZE, abs(x1-x2)*SCALER/250),
                            (255,255,255), FONT_THICKNESS)
        else:
            print(f"Invalid face encoding size: {encodeFace.shape}")

    return frame
