
export class EnvError extends Error {
    public status_code: number;
    public cause?: Error;

    constructor(message: string, status_code: number, cause?: Error) {
        super(message);
        this.name = this.constructor.name;
        this.status_code = status_code;
        this.cause = cause;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class MissingEnvironmentVariableError extends EnvError {
    constructor(variable_name: string, cause?: Error) {
        super(`환경 변수 "${variable_name}"을 찾을 수 없습니다.`, 404, cause);
    }
}

export class InvalidEnvironmentVariableError extends EnvError {
    constructor(variable_name: string, expectedType: string, cause?: Error) {
        super(`환경 변수 "${variable_name}"은 ${expectedType}타입이여야 합니다.`, 404, cause);
    }
}