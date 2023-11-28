import axios from 'axios';
import axiosClient from './axiosClient';

export async function login({ email, password }) {
    try {
        let data = JSON.stringify({
            email: email,
            password: password,
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:3000/api/v1/users/login',
            headers: {
                'Content-Type': 'application/json',
            },
            data: data,
        };

        const response = await axios.request(config);
        localStorage.setItem('token', response.data.token);

        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function getCurrentUser() {
    const { data: session } = await axiosClient.get('auth/session', {
        params: {},
    });

    if (!session.session) return null;

    return session.session?.user;
}

export async function logout() {
    localStorage.removeItem('token');
}

export async function updateCurrentUser(user) {
    // Filter out key-value pairs where the value is truthy (not falsy)
    const filteredData = Object.fromEntries(
        Object.entries(user).filter(([key, value]) => value)
    );

    let data;
    if (filteredData.name) {
        const response = await axiosClient.patch(
            'users/updateMe',
            filteredData
        );
        data = response.data;
    } else if (filteredData.password) {
        const response = await axiosClient.patch(
            'users/updateMyPassword',
            filteredData
        );
        localStorage.setItem('token', response.data.token);
        data = response.data;
    }

    return data;
    // 1. Update password OR fullName
    // let updateData;
    // if (password) updateData = { password };
    // if (fullName) updateData = { data: { fullName } };

    // const { data, error } = await supabase.auth.updateUser(updateData);

    // if (error) throw new Error(error.message);
    // if (!avatar) return data;

    // // 2. Upload the avatar image
    // const fileName = `avatar-${data.user.id}-${Math.random()}`;

    // const { error: storageError } = await supabase.storage
    //     .from('avatars')
    //     .upload(fileName, avatar);

    // if (storageError) throw new Error(storageError.message);

    // // 3. Update avatar in the user
    // const { data: updatedUser, error: error2 } = await supabase.auth.updateUser(
    //     {
    //         data: {
    //             avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
    //         },
    //     }
    // );

    // if (error2) throw new Error(error2.message);
    // return updatedUser;
}
