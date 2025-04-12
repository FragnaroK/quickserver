export default class Validator {
    static isEmail(email: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static isForbiddenCharacter(str: string): boolean {
        const forbiddenChars = /[<>]/;
        return forbiddenChars.test(str);
    }

    static isEmpty(str: string): boolean {
        return str.trim() === '';
    }

    static isValidDate(date: string): boolean {
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime());
    }
    
    static isStrongPassword(password: string): boolean {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    }

    static isUsername(username: string): boolean {
        const regex = /^[a-zA-Z0-9_]{3,16}$/;
        return regex.test(username);
    }
}