import { parse, addDays } from 'date-fns';

import axiosClient from './axiosClient';
import { getCurrentUser } from './apiAuth';

export async function getSubjects() {
    try {
        const data = await getCurrentUser();

        const teacherId = data.teacherId;
        if (!teacherId) return new Error('You are not a teacher!');

        const {
            data: { subjects },
        } = await axiosClient.get(`subjects/teacherSubjects/${teacherId}`);

        return subjects;
    } catch (e) {
        throw new Error('Subjects could not be loaded!');
    }
}

export async function createStudent(newStudent) {
    // Filter out key-value pairs where the value is truthy (not falsy)
    const filteredData = Object.fromEntries(
        Object.entries(newStudent).filter(([key, value]) => value)
    );

    const birthdayDate = parse(newStudent.birthday, 'dd/MM/yyyy', new Date());
    if (isNaN(birthdayDate)) {
        console.error('Invalid date format');
        return;
    }
    const formattedBirthday = addDays(birthdayDate, 1).toISOString();

    const data = await axiosClient.post('students', {
        ...filteredData,
        birthday: formattedBirthday,
    });

    return data;
}

export async function getStudents(subjectId, classId, sortBy, filter) {
    try {
        let params = '';

        // FILTER
        if (filter) params += `${filter.field}=${filter.value}&`;
        // Sample: status=active&

        // SORT
        if (sortBy)
            params += `sort=${sortBy.direction === 'asc' ? '' : '-'}${
                sortBy.field === 'name' ? 'fullName' : sortBy.field
            }&`;
        // Sample: sort=-fullName&

        const { data } = await axiosClient.get(
            `students?${params}fields=id,photo,fullName,phoneNumber,status&classId=${classId}`
        );

        const summaryPromises = data.students.map(async (student) => {
            const { data } = await axiosClient.get('attendance/summary', {
                params: {
                    studentId: student.id,
                    subjectId: subjectId,
                },
            });
            const attendances = data.attendance?.totalAttendance || 0;

            return { ...student, attendances };
        });

        const newStudents = await Promise.all(summaryPromises);

        return newStudents;
    } catch {
        throw new Error('Students could not be loaded!');
    }
}
