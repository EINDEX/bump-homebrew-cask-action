"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setGitUser = exports.isMacOs = void 0;
const exec_1 = require("@actions/exec");
function getUnameInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const execOutput = yield exec_1.getExecOutput('uname');
        if (execOutput.exitCode !== 0) {
            throw new Error('Command `uname` is not support in this system.');
        }
        return execOutput.stdout.toString().trim();
    });
}
function isMacOs() {
    return __awaiter(this, void 0, void 0, function* () {
        const unameInfo = yield getUnameInfo();
        return unameInfo.toLowerCase() === 'darwin';
    });
}
exports.isMacOs = isMacOs;
function setGitUser(name, email) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exec_1.exec('git', ['config', '--global', 'user.name', name]);
        yield exec_1.exec('git', ['config', '--global', 'user.email', email]);
    });
}
exports.setGitUser = setGitUser;
