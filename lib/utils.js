"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = __importDefault(require("readline"));
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
exports.createRandomId = () => {
    return crypto_1.default.randomBytes(20).toString('hex');
};
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
exports.askQuestion = (question) => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
};
exports.deleteFile = (file) => __awaiter(this, void 0, void 0, function* () {
    yield new Promise((resolve, reject) => {
        fs_1.default.unlink(file, (err) => {
            if (err)
                reject(err);
            else {
                resolve();
            }
        });
    });
});
exports.createFile = (file, content) => __awaiter(this, void 0, void 0, function* () {
    yield new Promise((resolve, reject) => {
        fs_1.default.writeFile(file, content, (err) => {
            if (err)
                reject(err);
            else {
                resolve();
            }
        });
    });
});
