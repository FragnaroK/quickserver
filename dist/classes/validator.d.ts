export default class Validator {
    static isEmail(email: string): boolean;
    static isForbiddenCharacter(str: string): boolean;
    static isEmpty(str: string): boolean;
    static isValidDate(date: string): boolean;
    static isStrongPassword(password: string): boolean;
    static isUsername(username: string): boolean;
}
