var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
System.register("src/homebrew", ["@actions/exec"], function (exports_1, context_1) {
    "use strict";
    var exec_1;
    var __moduleName = context_1 && context_1.id;
    function livecheck(package_name) {
        return __awaiter(this, void 0, void 0, function () {
            var livecheck_result, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exec_1.getExecOutput("brew", ["livecheck",
                            "--newer-only",
                            "--casks",
                            "--full-name",
                            "--json",
                            package_name
                        ])];
                    case 1:
                        livecheck_result = _a.sent();
                        if (livecheck_result.exitCode !== 0) {
                            throw Error("livecheck " + package_name + " failed: " + livecheck_result.stderr);
                        }
                        data = JSON.parse(livecheck_result.stdout.toString());
                        if (data.length === 0) {
                            return [2 /*return*/];
                        }
                        return [2 /*return*/, data[0].version.latest];
                }
            });
        });
    }
    function brew_cask_pr(package_name, latest_version, token, message) {
        return __awaiter(this, void 0, void 0, function () {
            var cask_bumping_command, bump_cask_pr_result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!process.env['HOMEBREW_GITHUB_API_TOKEN']) {
                            process.env['HOMEBREW_GITHUB_API_TOKEN'] = token;
                        }
                        cask_bumping_command = [
                            "bump-cask-pr",
                            "--verbose",
                            "--online",
                            "--no-browse",
                        ];
                        if (message) {
                            cask_bumping_command.concat(['--message', message]);
                        }
                        cask_bumping_command.concat(["--version", latest_version, package_name]);
                        return [4 /*yield*/, exec_1.exec("brew", cask_bumping_command, {
                                listeners: {
                                    stderr: function () { return process.stderr; },
                                    stdout: function () { return process.stdout; }
                                }
                            })];
                    case 1:
                        bump_cask_pr_result = _a.sent();
                        if (bump_cask_pr_result !== 0) {
                            throw Error("bump-cask-pr " + package_name + ":" + latest_version + " failed!");
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    function livecheck_and_bumping_cask_pr(package_name, token, message) {
        return __awaiter(this, void 0, void 0, function () {
            var package_latest_version, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, livecheck(package_name)];
                    case 1:
                        package_latest_version = _a.sent();
                        if (package_latest_version === null) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, brew_cask_pr(package_name, package_latest_version, token, message)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error(error_1.message);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    exports_1("livecheck_and_bumping_cask_pr", livecheck_and_bumping_cask_pr);
    return {
        setters: [
            function (exec_1_1) {
                exec_1 = exec_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("src/utils", ["@actions/exec"], function (exports_2, context_2) {
    "use strict";
    var exec_2;
    var __moduleName = context_2 && context_2.id;
    function getUnameInfo() {
        return __awaiter(this, void 0, void 0, function () {
            var execOutput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exec_2.getExecOutput('uname')];
                    case 1:
                        execOutput = _a.sent();
                        if (execOutput.exitCode != 0 || execOutput.stderr != null) {
                            throw new Error("Command `uname` is not support in this system.");
                        }
                        return [2 /*return*/, execOutput.stdout.toString().trim()];
                }
            });
        });
    }
    function isMacOs() {
        return __awaiter(this, void 0, void 0, function () {
            var unameInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getUnameInfo()];
                    case 1:
                        unameInfo = _a.sent();
                        return [2 /*return*/, unameInfo.toLowerCase() === "darwin"];
                }
            });
        });
    }
    exports_2("isMacOs", isMacOs);
    function set_git_user(name, email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // setting up git username and email
                    return [4 /*yield*/, exec_2.exec("git", ["config", "--global", "user.name", name])];
                    case 1:
                        // setting up git username and email
                        _a.sent();
                        return [4 /*yield*/, exec_2.exec("git", ["config", "--global", "user.email", email])];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    exports_2("set_git_user", set_git_user);
    return {
        setters: [
            function (exec_2_1) {
                exec_2 = exec_2_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("src/github", ["@actions/github"], function (exports_3, context_3) {
    "use strict";
    var github_1;
    var __moduleName = context_3 && context_3.id;
    function fetch_user_info(name, token) {
        return __awaiter(this, void 0, void 0, function () {
            var client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = github_1.getOctokit(token);
                        return [4 /*yield*/, client.rest.users.getByUsername({ username: name })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    exports_3("fetch_user_info", fetch_user_info);
    return {
        setters: [
            function (github_1_1) {
                github_1 = github_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("index", ["@actions/core", "@actions/github", "src/homebrew", "src/utils", "axios", "src/github"], function (exports_4, context_4) {
    "use strict";
    var core_1, github_2, homebrew_1, utils_1, axios_1, github_3;
    var __moduleName = context_4 && context_4.id;
    function package_process(package_name, bump_gist_raw_link) {
        return __awaiter(this, void 0, void 0, function () {
            var resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!bump_gist_raw_link) return [3 /*break*/, 2];
                        return [4 /*yield*/, axios_1["default"].get(bump_gist_raw_link)];
                    case 1:
                        resp = _a.sent();
                        return [2 /*return*/, Array.from(resp.data.split.map(function (item) { return item.trim(); }))];
                    case 2: return [2 /*return*/, [package_name]];
                }
            });
        });
    }
    function main() {
        return __awaiter(this, void 0, void 0, function () {
            var token, email, name, package_name, bump_gist_raw_link, message, user, git_name, git_email, _a, _b, _i, pkg, payload, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 9, , 10]);
                        token = core_1.getInput('token');
                        email = core_1.getInput('email');
                        name = core_1.getInput('name');
                        package_name = core_1.getInput('package');
                        bump_gist_raw_link = core_1.getInput('bump_gist_raw_link');
                        message = core_1.getInput('message');
                        return [4 /*yield*/, utils_1.isMacOs()];
                    case 1:
                        if (!(_c.sent())) {
                            throw Error("macOS for this action is needed!");
                        }
                        return [4 /*yield*/, github_3.fetch_user_info(name, token)];
                    case 2:
                        user = _c.sent();
                        git_name = String(name || user.data.name || user.data.login);
                        git_email = String(email || user.data.email || user.data.id + "+" + user.data.login + "@users.noreply.github.com");
                        return [4 /*yield*/, utils_1.set_git_user(git_name, git_email)];
                    case 3:
                        _c.sent();
                        _a = [];
                        return [4 /*yield*/, package_process(package_name, bump_gist_raw_link)];
                    case 4:
                        for (_b in _c.sent())
                            _a.push(_b);
                        _i = 0;
                        _c.label = 5;
                    case 5:
                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                        pkg = _a[_i];
                        if (pkg === null) {
                            return [3 /*break*/, 7];
                        }
                        return [4 /*yield*/, homebrew_1.livecheck_and_bumping_cask_pr(pkg, token, message)];
                    case 6:
                        _c.sent();
                        _c.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8:
                        payload = JSON.stringify(github_2.context.payload, undefined, 2);
                        console.log("The event payload: " + payload);
                        return [3 /*break*/, 10];
                    case 9:
                        error_2 = _c.sent();
                        core_1.setFailed(error_2.message);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    }
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (github_2_1) {
                github_2 = github_2_1;
            },
            function (homebrew_1_1) {
                homebrew_1 = homebrew_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (axios_1_1) {
                axios_1 = axios_1_1;
            },
            function (github_3_1) {
                github_3 = github_3_1;
            }
        ],
        execute: function () {
            main();
        }
    };
});
