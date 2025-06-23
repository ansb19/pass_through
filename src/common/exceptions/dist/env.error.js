"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.InvalidEnvironmentVariableError = exports.MissingEnvironmentVariableError = exports.EnvError = void 0;
var EnvError = /** @class */ (function (_super) {
    __extends(EnvError, _super);
    function EnvError(message, status_code, cause) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        _this.status_code = status_code;
        _this.cause = cause;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return EnvError;
}(Error));
exports.EnvError = EnvError;
var MissingEnvironmentVariableError = /** @class */ (function (_super) {
    __extends(MissingEnvironmentVariableError, _super);
    function MissingEnvironmentVariableError(variable_name, cause) {
        return _super.call(this, "\uD658\uACBD \uBCC0\uC218 \"" + variable_name + "\"\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.", 404, cause) || this;
    }
    return MissingEnvironmentVariableError;
}(EnvError));
exports.MissingEnvironmentVariableError = MissingEnvironmentVariableError;
var InvalidEnvironmentVariableError = /** @class */ (function (_super) {
    __extends(InvalidEnvironmentVariableError, _super);
    function InvalidEnvironmentVariableError(variable_name, expectedType, cause) {
        return _super.call(this, "\uD658\uACBD \uBCC0\uC218 \"" + variable_name + "\"\uC740 " + expectedType + "\uD0C0\uC785\uC774\uC5EC\uC57C \uD569\uB2C8\uB2E4.", 404, cause) || this;
    }
    return InvalidEnvironmentVariableError;
}(EnvError));
exports.InvalidEnvironmentVariableError = InvalidEnvironmentVariableError;
