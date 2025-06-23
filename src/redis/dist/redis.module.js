"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RedisModule = void 0;
var common_1 = require("@nestjs/common");
var ioredis_1 = require("@nestjs-modules/ioredis");
var env_config_1 = require("../config/env.config");
var RedisModule = /** @class */ (function () {
    function RedisModule() {
    }
    RedisModule = __decorate([
        common_1.Module({
            imports: [
                ioredis_1.RedisModule.forRootAsync({
                    inject: [env_config_1.EnvConfig],
                    useFactory: function (config) { return ({
                        type: 'single',
                        options: {
                            host: config.NODE_NETWORK === 'localhost'
                                ? config.REDIS_LOCAL
                                : config.REDIS_REMOTE,
                            port: config.REDIS_PORT,
                            password: config.REDIS_PASSWORD
                        }
                    }); }
                })
            ],
            exports: [ioredis_1.RedisModule]
        })
    ], RedisModule);
    return RedisModule;
}());
exports.RedisModule = RedisModule;
