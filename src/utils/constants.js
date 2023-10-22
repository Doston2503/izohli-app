export const PATH_NAME = 'http://185.196.213.141:8003/';

export function formatDate(inputDate) {
    const date = new Date(inputDate);
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    return date.toLocaleDateString('en-US', options);
}

export function formatDateWithoutYear(inputDate) {
    const date = new Date(inputDate);
    const options = {month: 'long', day: 'numeric'};
    return date.toLocaleDateString('en-US', options);
}

// export const AUTH_DATA = {
//     headers: {
//         'Accept': 'application/json',
//         'Authorization': `Bearer ${localStorage?.getItem('accessToken')}`
//     },
// };