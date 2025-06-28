export class CustomError extends Error {
    constructor(message, errMsg) {
        super(message);
        this.name = 'CustomError';
        this.errMsg = errMsg;
    }
}