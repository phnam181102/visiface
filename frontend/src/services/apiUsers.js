import axiosClient from './axiosClient';
import { ITEM_PER_PAGE } from '../utils/constants';

export async function getUsers({ filter, sortBy, page }) {
    try {
        let params = '';

        // FILTER
        if (filter) params += `${filter.field}=${filter.value}&`;

        // SORT
        if (sortBy)
            params += `sort=${sortBy.direction === 'asc' ? '' : '-'}name&`;

        if (page) {
            params += `limit=${ITEM_PER_PAGE}&page=${page}&`;
        }

        const users = await axiosClient.get(
            `users?${params}fields=role,teacherId,status,name,email,phoneNumber,photo`
        );

        return { data: users.data.users, count: users.count };
    } catch {
        throw new Error('Users could not be loaded');
    }
}

export async function createEditUser(newUser, id) {
    // Filter out key-value pairs where the value is truthy (not falsy)
    const filteredData = Object.fromEntries(
        Object.entries(newUser).filter(([key, value]) => value)
    );

    let user;
    // CREATE
    if (!id) {
        const response = await axiosClient.post('users/signup', filteredData);

        user = response.user;
    }
    // EDIT
    if (id) {
        const response = await axiosClient.patch(`users/${id}`, filteredData);
        user = response.user;
    }

    return user;
}

export async function deleteUser(id) {
    // REMEMBER RLS POLICIES
    const data = await axiosClient.delete(`users/${id}`);
    return data;
}
