import cv2
from tkinter import filedialog, messagebox
from plyer import notification
from PIL import Image, ImageTk
import gc
import faces_recognizer
import customtkinter

cap = cv2.VideoCapture(0)

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
        dialog = customtkinter.CTkInputDialog(title="Enter PIN", text="Enter your PIN:")
        id = faces_recognizer.ID_DETECTED
        pin_code_input = dialog.get_input()
        
        if pin_code_input is not None: 
            if pin_code_input == faces_recognizer.PIN_CODE:  # Sử dụng mã pin và id giả định
                notification.notify(
                    title="Successfully!",
                    message=f'Attendance recorded successfully - {id}',
                    app_icon=r'D:\Workspace\AIoT\Face-Recognition-GUI-Python-master\icons\success.ico',
                    timeout=5
                )
                print(f'Attendance recorded successfully - {id}')
            elif pin_code_input:
                notification.notify(
                    title="Failure!",
                    message=f'Attendance recorded failed - {id}',
                    app_icon=r'D:\Workspace\AIoT\Face-Recognition-GUI-Python-master\icons\error.ico',
                    timeout=5
                )
                print(f'Attendance recorded failed - {id}')
                
    elif numFaces > 1:
        messagebox.showinfo("Multiple Faces Detected", "There is more than one face in the frame!")

    IS_UPDATE = True
    update_frame()

def take_screenshot():
    try:
        IM = image
        SAVE_PATH = filedialog.asksaveasfilename(defaultextension=".png",
                                                filetypes=(("PNG Files", "*.png"), ("All Files", "*.*")))
        IM.save(SAVE_PATH)
    except:
        pass

def convert_to_image(frame):
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    image = Image.fromarray(frame)
    return image

def update_frame():
    global image, IS_UPDATE

    if IS_UPDATE:
        _, frame = cap.read()
        if frame is not None:
            frame = cv2.flip(frame, 1)
            frame = faces_recognizer.identify_faces(frame)
            image = convert_to_image(frame)
        photo.paste(image)
        root.after(10, update_frame)

# Khởi tạo cửa sổ giao diện
root = customtkinter.CTk()
root.title("Timekeeper")
root.geometry("515x390")
root.configure(bg="#131113")

# Tạo canvas để hiển thị hình ảnh từ camera
canvas = customtkinter.CTkCanvas(root, width=CAM_VIEW_WIDTH, height=CAM_VIEW_HEIGHT, bg="black")
canvas.place(x=0, y=0)

# Tạo image và hiển thị lên canvas
_, frame = cap.read()
if frame is not None:
    image = convert_to_image(frame)
    photo = ImageTk.PhotoImage(image=image)
    canvas.create_image(CAM_VIEW_WIDTH, CAM_VIEW_HEIGHT, image=photo, anchor="se")

# Tạo một frame để chứa nút attendance_button
frame = customtkinter.CTkFrame(root)
frame.place(x=515 - 150, y=340)

image_path = "D:\Workspace\AIoT\Face-Recognition-GUI-Python-master\icons\icons8-face-id-32.png"
image = Image.open(image_path)
logo = customtkinter.CTkImage(image)

# Tạo nút sidebar_button_click
attendance_button = customtkinter.CTkButton(frame, text="Shoot & Enter pin", width=140 , border_width=2, border_color="white",
                                            text_color=("white", "#DCE4EE"), image=logo, command=enter_pin)
attendance_button.pack(side="right")

# Bắt đầu cập nhật frame
update_frame()

# Chạy ứng dụng
root.mainloop()

cap.release()
gc.collect()
