import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
    /**
     * Generate random string
     * @param length
     * @param input
     * @returns
     */
    generateRandomString(
        length: number,
        input: string = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789',
    ): string {
        let result = '';
        const inputLength = input.length;

        for (let i = 0; i < length; i++) {
            result += input.charAt(Math.floor(Math.random() * inputLength));
        }

        return result;
    }

    /**
     * remove karakter in on string
     * @param inputString
     * @param charactersToRemove
     * @returns
     */

    removeSpacesAndCharacters(
        inputString,
        charactersToRemove = " ,.!#$%^&*()?:;'/|",
    ) {
        // Menghapus spasi
        const stringWithoutSpaces = inputString.replace(/\s/g, '');

        // Menghapus karakter yang ditentukan
        const regex = new RegExp(`[${charactersToRemove}]`, 'g');
        const stringWithoutCharacters = stringWithoutSpaces.replace(regex, '');

        return stringWithoutCharacters;
    }

    /**
     * Validate email format
     * @param email email
     * @returns boolean
     */
    validEmail(email: string) {
        const regex =
            /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        return regex.test(email);
    }

    /**
     * validasi date of string
     * @param dateString
     * @returns boolean
     */
    isValidDateString(dateString) {
        // Menggunakan regular expression untuk memeriksa format tanggal
        const regex = /^\d{4}-\d{2}-\d{2}$/;

        // Memeriksa apakah format sesuai dengan regex
        if (!regex.test(dateString)) {
            return false;
        }

        // Memeriksa apakah tanggal yang dimasukkan valid
        const year = parseInt(dateString.substring(0, 4), 10);
        const month = parseInt(dateString.substring(5, 7), 10);
        const day = parseInt(dateString.substring(8, 10), 10);

        const isValidYear = year >= 1000 && year <= 9999;
        const isValidMonth = month >= 1 && month <= 12;
        const isValidDay = day >= 1 && day <= 31;

        // Memeriksa apakah bulan dan tanggal sesuai
        if (
            (month === 4 || month === 6 || month === 9 || month === 11) &&
            day > 30
        ) {
            return false; // Bulan dengan 30 hari
        } else if (month === 2) {
            const isLeapYear =
                (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
            if ((isLeapYear && day > 29) || (!isLeapYear && day > 28)) {
                return false; // Februari, periksa tahun kabisat
            }
        }

        return isValidYear && isValidMonth && isValidDay;
    }

    /**
     * verifikasi phone number
     * @param phoneNumber string
     * @returns
     */
    verifyPhoneNumber(phoneNumber: string) {
        // Pengecekan panjang nomor telepon
        if (phoneNumber.length < 10 || phoneNumber.length > 13) {
            return false;
        }

        // Pengecekan awalan nomor telepon
        if (!phoneNumber.startsWith('628')) {
            return false;
        }

        // Pengecekan karakter nomor telepon
        if (!/^[0-9]+$/.test(phoneNumber)) {
            return false;
        }

        return true;
    }
}
