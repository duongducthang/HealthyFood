"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaloriesController = void 0;
const common_1 = require("@nestjs/common");
const calories_service_1 = require("./calories.service");
const create_calorie_log_dto_1 = require("./dto/create-calorie-log.dto");
const update_calorie_log_dto_1 = require("./dto/update-calorie-log.dto");
let CaloriesController = class CaloriesController {
    service;
    constructor(service) {
        this.service = service;
    }
    list(query) {
        return this.service.list(query);
    }
    getOne(id) {
        return this.service.findOne(id);
    }
    create(dto) {
        return this.service.create(dto);
    }
    updateFull(id, dto) {
        return this.service.update(id, dto);
    }
    updatePartial(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.CaloriesController = CaloriesController;
__decorate([
    (0, common_1.Get)('logs'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CaloriesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('logs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CaloriesController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)('logs'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_calorie_log_dto_1.CreateCalorieLogDto]),
    __metadata("design:returntype", void 0)
], CaloriesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('logs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_calorie_log_dto_1.UpdateCalorieLogDto]),
    __metadata("design:returntype", void 0)
], CaloriesController.prototype, "updateFull", null);
__decorate([
    (0, common_1.Patch)('logs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_calorie_log_dto_1.UpdateCalorieLogDto]),
    __metadata("design:returntype", void 0)
], CaloriesController.prototype, "updatePartial", null);
__decorate([
    (0, common_1.Delete)('logs/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CaloriesController.prototype, "remove", null);
exports.CaloriesController = CaloriesController = __decorate([
    (0, common_1.Controller)('calories'),
    __metadata("design:paramtypes", [calories_service_1.CaloriesService])
], CaloriesController);
//# sourceMappingURL=calories.controller.js.map