"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.AuthController = void 0;
var common_1 = require("@nestjs/common");
var AuthController = /** @class */ (function () {
    function AuthController(auth_service) {
        this.auth_service = auth_service;
    }
    AuthController.prototype.login = function (req, res) {
        req.session.user = {
            id: 1,
            email: 'user@example.com'
        };
        res.send('로그인 성공');
    };
    AuthController.prototype.logout = function (req, res) {
        req.session.destroy(function (err) {
            if (err)
                console.error('세션 제거 실패:', err);
            res.send('로그아웃 성공');
        });
    };
    AuthController.prototype.signup = function (dto) {
        return this.auth_service.signup(dto);
    };
    __decorate([
        common_1.Post('login'),
        __param(0, common_1.Req()), __param(1, common_1.Res())
    ], AuthController.prototype, "login");
    __decorate([
        common_1.Post('logout'),
        __param(0, common_1.Req()), __param(1, common_1.Res())
    ], AuthController.prototype, "logout");
    __decorate([
        common_1.Post('signup'),
        __param(0, common_1.Body())
    ], AuthController.prototype, "signup");
    AuthController = __decorate([
        common_1.Controller('auth')
    ], AuthController);
    return AuthController;
}());
exports.AuthController = AuthController;
