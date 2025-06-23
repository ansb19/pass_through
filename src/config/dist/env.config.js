"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EnvConfig = exports.DBType = void 0;
var common_1 = require("@nestjs/common");
var env_error_1 = require("../common/exceptions/env.error");
var DBType;
(function (DBType) {
    DBType["POSTGRES"] = "postgres";
    DBType["MYSQL"] = "mysql";
})(DBType = exports.DBType || (exports.DBType = {}));
var EnvConfig = /** @class */ (function () {
    function EnvConfig(configService) {
        this.configService = configService;
        // 필수 환경 변수 검증
        console.log('Initializing EnvConfig...');
    }
    // ====== 공통 getter 메서드 ======
    EnvConfig.prototype.getString = function (key) {
        var value = this.configService.get(key);
        if (value === undefined || value === null || value === '') {
            throw new env_error_1.MissingEnvironmentVariableError(key);
        }
        return value;
    };
    EnvConfig.prototype.getNumber = function (key, defaultValue) {
        var raw = this.configService.get(key);
        var parsed = raw !== undefined ? parseInt(raw, 10) : defaultValue;
        if (isNaN(parsed)) {
            throw new env_error_1.InvalidEnvironmentVariableError(key, 'number');
        }
        return parsed;
    };
    Object.defineProperty(EnvConfig.prototype, "NODE_ENV", {
        // ====== General ======
        get: function () {
            return this.getString('NODE_ENV');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EnvConfig.prototype, "NODE_NETWORK", {
        get: function () {
            return this.getString('NODE_NETWORK');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EnvConfig.prototype, "PORT", {
        get: function () {
            return this.getNumber('PORT', 3000);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EnvConfig.prototype, "DB_TYPE", {
        //* database
        get: function () {
            return this.getString('DB_TYPE');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EnvConfig.prototype, "DB_HOST", {
        get: function () {
            return this.getString('DB_HOST');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EnvConfig.prototype, "DB_PORT", {
        get: function () {
            return this.getNumber('DB_PORT');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EnvConfig.prototype, "DB_USERNAME", {
        get: function () {
            return this.getString('DB_USERNAME');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EnvConfig.prototype, "DB_PASSWORD", {
        get: function () {
            return this.getString('DB_PASSWORD');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EnvConfig.prototype, "DB_NAME", {
        get: function () {
            return this.getString('DB_NAME');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EnvConfig.prototype, "REDIS_REMOTE", {
        get: function () {
            return this.getString('REDIS_REMOTE');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EnvConfig.prototype, "REDIS_LOCAL", {
        get: function () {
            return this.getString('REDIS_LOCAL');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EnvConfig.prototype, "REDIS_PORT", {
        get: function () {
            return this.getNumber('REDIS_PORT');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EnvConfig.prototype, "REDIS_PASSWORD", {
        get: function () {
            return this.getString('REDIS_PASSWORD');
        },
        enumerable: false,
        configurable: true
    });
    EnvConfig = __decorate([
        common_1.Injectable()
    ], EnvConfig);
    return EnvConfig;
}());
exports.EnvConfig = EnvConfig;
