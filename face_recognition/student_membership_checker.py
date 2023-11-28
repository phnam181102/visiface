from datetime import datetime, time
import fetch_api


def get_current_day_and_class_shift():
    days_of_week = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    now = datetime.now()
    current_day = days_of_week[now.weekday()]
    
    class_shifts = [
        {'start': time(7, 0), 'end': time(9, 15), 'classShift': 1},
        {'start': time(9, 45), 'end': time(12, 0), 'classShift': 2},
        {'start': time(13, 0), 'end': time(15, 15), 'classShift': 3},
        {'start': time(15, 45), 'end': time(17, 0), 'classShift': 4},
        {'start': time(18, 0), 'end': time(20, 15), 'classShift': 5},
        #{'start': time(17, 30), 'end': time(23, 59), 'classShift': 5},
    ]

    current_time = now.time()
    
    for shift in class_shifts:
        if shift['start'] <= current_time <= shift['end']:
            return {'day': current_day, 'classShift': shift['classShift']}

    return None

def check_student_membership_in_current_class(roomclassId,studentId):
    current_schedule = get_current_day_and_class_shift()

    if current_schedule:
        weekday = current_schedule['day']
        print(f"Real weekday: {weekday}")
        weekday = 'monday'
        
        classShift = current_schedule['classShift']
        print(f"Real classShift: {classShift}")
        classShift = 1

        data = fetch_api.fetch(f"classroom-schedule/{roomclassId}/{weekday}")
        print(data)
        if weekday in data["data"]:
            schedule = data["data"][weekday]
    
            if schedule:
                for item in schedule:
                    if item['classShift'] == classShift:
                        result = item
                        break
                if result:
                    subjectId = result["subjectId"]
                    classId = result["classId"]
    
                    data = fetch_api.fetch(f"students?status=active&classId={classId}&id={studentId}&fields=id,fullName")
                  
                    students = data["data"]["students"]
                    
                    if len(students) == 1:
                        return {'result': True, 'subjectId': subjectId}
                    
    return {'result': False, 'subjectId': None}
