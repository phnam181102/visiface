import sys
import cv2
from tkinter import messagebox
from plyer import notification
from PIL import Image, ImageTk
import numpy as np
import urllib.request
import os
import gc
import faces_recognizer
import student_membership_checker
import customtkinter
from os.path import join, dirname
from dotenv import load_dotenv
import fetch_api

if not os.path.isfile(".env"):
    messagebox.showerror("File Not Found", "The file .env is missing.")
    sys.exit() 

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

ESP32_URL = os.environ.get("ESP32_CAM_URL")
ROOM_ID = os.environ.get("ROOM_ID")
    
IS_UPDATE = True
CAM_VIEW_WIDTH = 640
CAM_VIEW_HEIGHT = 480

def enter_pin():
    global IS_UPDATE
    IS_UPDATE = False

    numFaces = faces_recognizer.NUM_FACES_DETECTED

    if numFaces == 0:
        messagebox.showinfo("No Faces Detected", "There are no faces in the frame!")
    elif numFaces == 1:
        id = faces_recognizer.ID_DETECTED
        check = student_membership_checker.check_student_membership_in_current_class(ROOM_ID, id)
        result = check["result"]
        subjectId = check["subjectId"]
        
        if(result):
            dialog = customtkinter.CTkInputDialog(title="Enter PIN", text="Enter your PIN:")
            pin_code_input = dialog.get_input()
    
            if pin_code_input is not None: 
                if pin_code_input == faces_recognizer.PIN_CODE: 
                    fetch_api.fetch("attendance", method="POST", data={
                        "studentId": f"{id}",
                        "subjectId": f"{subjectId}"
                    })
                    notification.notify(
                        title="Successfully!",
                        message=f'Attendance recorded successfully - {id}',
                        app_icon=r'icons/success.ico',
                        timeout=5
                    )
                    print(f'Attendance recorded successfully - {id}')
                elif pin_code_input:
                    notification.notify(
                        title="Failure!",
                        message=f'Attendance recorded failed - {id}',
                        app_icon=r'icons/error.ico',
                        timeout=5
                    )
                    print(f'Attendance recorded failed - {id}')
        else:
            messagebox.showinfo("Class Status", "You are not a member of this class or there is no class at this time.")
    elif numFaces > 1:
        messagebox.showinfo("Multiple Faces Detected", "There is more than one face in the frame!")

    IS_UPDATE = True
    update_frame()

def convert_to_image(frame):
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    image = Image.fromarray(frame)
    return image

def update_frame():
    global image, IS_UPDATE

    if IS_UPDATE:    
        try:
            img_resp = urllib.request.urlopen(ESP32_URL)
            img_bytes = np.array(bytearray(img_resp.read()), dtype=np.uint8)

            # Convert data to image OpenCV
            frame = cv2.imdecode(img_bytes, -1)

            frame = faces_recognizer.identify_faces(frame)

            image = convert_to_image(frame)
            photo.paste(image)
            root.after(10, update_frame)

        except Exception as e:
            print("Error:", str(e))
            root.after(1000, update_frame)

# Initialize the GUI window
root = customtkinter.CTk()
root.title("Timekeeper")
root.geometry("515x390")
root.configure(bg="#131113")

# Create a canvas to display the camera image
canvas = customtkinter.CTkCanvas(root, width=CAM_VIEW_WIDTH, height=CAM_VIEW_HEIGHT, bg="black")
canvas.place(x=0, y=0)

# Create an image and display it
img_resp = urllib.request.urlopen(ESP32_URL)
img_bytes = np.array(bytearray(img_resp.read()), dtype=np.uint8)

# Convert data to image OpenCV
frame = cv2.imdecode(img_bytes, -1)

image = convert_to_image(frame)
photo = ImageTk.PhotoImage(image=image)
canvas.create_image(CAM_VIEW_WIDTH, CAM_VIEW_HEIGHT, image=photo, anchor="se")

# Create a frame to contain the "attendance button"
frameButton = customtkinter.CTkFrame(root)
frameButton.place(x=515 - 150, y=340)

image_path = "icons/icons8-face-id-32.png"
image = Image.open(image_path)
logo = customtkinter.CTkImage(image)

# Create the attendance button
attendance_button = customtkinter.CTkButton(frameButton, text="Shoot & Enter pin", width=140 , border_width=2, border_color="white",
                                            text_color=("white", "#DCE4EE"), image=logo, command=enter_pin)
attendance_button.pack(side="right")

# Start updating the frame
update_frame()

# Run the application
root.mainloop()

gc.collect()
