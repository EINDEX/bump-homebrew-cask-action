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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const axios_1 = __importDefault(require("axios"));
const homebrew_1 = require("./homebrew");
const utils_1 = require("./utils");
const github_2 = require("./github");
function packageProcess(package_name, bump_gist_raw_link) {
    return __awaiter(this, void 0, void 0, function* () {
        if (bump_gist_raw_link) {
            const resp = yield axios_1.default.get(bump_gist_raw_link);
            return Array.from(resp.data
                .toString()
                .split('\n')
                .map((item) => item.trim()));
        }
        return [package_name];
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = core_1.getInput('token');
            const email = core_1.getInput('email');
            const name = core_1.getInput('name');
            const tap = core_1.getInput('tap');
            const packageName = core_1.getInput('package');
            const bumpGistRawLink = core_1.getInput('bump-gist-raw-link');
            const message = core_1.getInput('message');
            if (!(yield utils_1.isMacOs())) {
                throw Error('macOS for this action is needed!');
            }
            const user = yield github_2.fetchUserInfo(name, token);
            const gitName = String(name || user.data.name || user.data.login);
            const gitEmail = String(email ||
                user.data.email ||
                `${user.data.id}+${user.data.login}@users.noreply.github.com`);
            yield utils_1.setGitUser(gitName, gitEmail);
            yield homebrew_1.brewUpdate();
            if (tap) {
                yield homebrew_1.brewTap(tap);
            }
            for (const pkg of yield packageProcess(packageName, bumpGistRawLink)) {
                if (pkg !== null && typeof pkg === 'string') {
                    yield homebrew_1.livecheckAndBumpingCaskPr(pkg, token, message);
                }
            }
            const payload = JSON.stringify(github_1.context.payload, undefined, 2);
            console.log(`The event payload: ${payload}.`);
        }
        catch (error) {
            core_1.setFailed(error.message);
        }
    });
}
main();
