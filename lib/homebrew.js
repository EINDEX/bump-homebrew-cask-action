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
exports.livecheckAndBumpingCaskPr = exports.brewTap = exports.brewUpdate = void 0;
const exec_1 = require("@actions/exec");
function livecheck(package_name) {
    return __awaiter(this, void 0, void 0, function* () {
        const livecheck_result = yield exec_1.getExecOutput('brew', [
            'livecheck',
            '--newer-only',
            '--casks',
            '--full-name',
            '--json',
            package_name,
        ]);
        if (livecheck_result.exitCode !== 0) {
            throw Error(`livecheck ${package_name} failed: ${livecheck_result.stderr}`);
        }
        const data = JSON.parse(livecheck_result.stdout.toString());
        if (data.length === 0) {
            return null;
        }
        return data[0].version.latest;
    });
}
function brewCaskPr(package_name, latest_version, token, message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.HOMEBREW_GITHUB_API_TOKEN) {
            process.env.HOMEBREW_GITHUB_API_TOKEN = token;
        }
        const cask_bumping_command = [
            'bump-cask-pr',
            '--verbose',
            '--online',
            '--no-browse',
        ];
        if (message) {
            cask_bumping_command.push('--message', message);
        }
        cask_bumping_command.push('--version', latest_version, package_name);
        const bump_cask_pr_result = yield exec_1.exec('brew', cask_bumping_command, {
            listeners: {
                stderr: () => process.stderr,
                stdout: () => process.stdout,
            },
        });
        if (bump_cask_pr_result !== 0) {
            throw Error(`bump-cask-pr ${package_name}:${latest_version} failed!`);
        }
    });
}
function brewUpdate() {
    return __awaiter(this, void 0, void 0, function* () {
        yield exec_1.exec('brew', ['update'], {
            listeners: {
                stderr: () => process.stderr,
                stdout: () => process.stdout,
            },
        });
    });
}
exports.brewUpdate = brewUpdate;
function brewTap(tap) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exec_1.exec('brew', ['tap', tap], {
            listeners: {
                stderr: () => process.stderr,
                stdout: () => process.stdout,
            },
        });
    });
}
exports.brewTap = brewTap;
function livecheckAndBumpingCaskPr(packageName, token, message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const package_latest_version = yield livecheck(packageName);
            if (package_latest_version === null) {
                return;
            }
            yield brewCaskPr(packageName, package_latest_version, token, message);
        }
        catch (error) {
            console.error(error.message);
        }
    });
}
exports.livecheckAndBumpingCaskPr = livecheckAndBumpingCaskPr;
