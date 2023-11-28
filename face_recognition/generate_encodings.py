import pybase64
import cv2
import numpy as np
import pandas as pd
import face_recognition
import pickle
import os
import fetch_api


data_directory = "data"
if not os.path.exists(data_directory):
    os.makedirs(data_directory)
    
face_encodings_file = os.path.join(data_directory, 'face_encodings.pkl')
if os.path.exists(face_encodings_file):
    with open(face_encodings_file, 'rb') as f:
        encodeListKnown = pickle.load(f)
else:
    encodeListKnown = []  # List of face encodings (initially empty)

register_df_file = os.path.join(data_directory, 'register_data.csv')
if os.path.exists(register_df_file):
    register_df = pd.read_csv(register_df_file)
else:
    register_df = pd.DataFrame(columns=['ID', 'Full Name', 'Pin Code'])

# ===================================

data = fetch_api.fetch("students?trained=false&status=active&&fields=id,pinCode,photo,fullName")

students = data["data"]["students"]
total_students = len(students)
encoded_students = 0

for student in students:
    id = student["id"]
    fullName = student["fullName"]
    pinCode = student["pinCode"]
    photo_base64 = student["photo"]

    # Decode base64 string to image
    photo_data = pybase64.b64decode(photo_base64)
            
    # Add data to CSV
    new_data = {'ID': id, 'Full Name': fullName, 'Pin Code': pinCode}
    register_df = pd.concat([register_df, pd.DataFrame(new_data, index=[0])], ignore_index=True)
    register_df.to_csv(register_df_file, index=False)

    # Encoding face image 
    img_rgb = cv2.imdecode(np.frombuffer(photo_data, np.uint8), cv2.IMREAD_COLOR) 
    face_encoding = face_recognition.face_encodings(img_rgb)[0]

    # Save to face_encodings.pkl 
    encodeListKnown.append(face_encoding)
    with open(face_encodings_file, 'wb') as f:
        pickle.dump(encodeListKnown, f)
        
    encoded_students += 1
    print(f"{encoded_students}/{total_students} Encoding successful! ({id} - {fullName})")
    
    # Send a PATCH request to update "trained" status the student
    fetch_api.fetch(f"students/{id}/train", method="PATCH")
        
print("ALL TASKS COMPLETED SUCCESSFULLY.")

