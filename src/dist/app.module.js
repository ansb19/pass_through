"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var typeorm_1 = require("@nestjs/typeorm");
var config_module_1 = require("./config/config.module");
var env_config_1 = require("./config/env.config");
var redis_module_1 = require("./redis/redis.module");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        common_1.Module({
            imports: [
                config_module_1.ConfigModule,
                redis_module_1.RedisModule,
                typeorm_1.TypeOrmModule.forRootAsync({
                    inject: [env_config_1.EnvConfig],
                    useFactory: function (config) { return ({
                        type: config.DB_TYPE,
                        host: config.DB_HOST,
                        port: config.DB_PORT,
                        username: config.DB_USERNAME,
                        password: config.DB_PASSWORD,
                        database: config.DB_NAME,
                        synchronize: config.NODE_ENV !== 'production',
                        logging: config.NODE_ENV !== 'production',
                        autoLoadEntities: true
                    }); }
                }),
            ],
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
