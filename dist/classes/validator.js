export default class Validator {
    static isEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    static isForbiddenCharacter(str) {
        const forbiddenChars = /[<>]/;
        return forbiddenChars.test(str);
    }
    static isEmpty(str) {
        return str.trim() === '';
    }
    static isValidDate(date) {
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime());
    }
    static isStrongPassword(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    }
    static isUsername(username) {
        const regex = /^[a-zA-Z0-9_]{3,16}$/;
        return regex.test(username);
    }
}
