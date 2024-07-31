import { v4 as uuidv4 } from 'uuid';

export function beautifulDate(timestamp: number) {
    const date = new Date(timestamp);

    return (
        `${date.getHours()}`.padStart(2, '0') +
        `:` +
        `${date.getMinutes()}`.padStart(2, '0') +
        `  ` +
        `${date.getDate()}`.padStart(2, '0') +
        `.` +
        `${date.getMonth() + 1}`.padStart(2, '0') +
        `.` +
        `${date.getFullYear()}`
    );
}

export function generateUUID(): string {
    const uuid = uuidv4();
    return uuid;
}
