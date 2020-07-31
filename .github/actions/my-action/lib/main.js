"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
function run() {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const context = github.context;
            if (context.eventName !== 'pull_request') {
                core.setFailed('Not a Pull Request, this action only supports PRs');
            }
            const token = core.getInput('token');
            const client = github.getOctokit(token);
            const response = yield client.repos.compareCommits({
                head: (_b = (_a = context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.head) === null || _b === void 0 ? void 0 : _b.sha,
                base: (_d = (_c = context.payload.pull_request) === null || _c === void 0 ? void 0 : _c.base) === null || _d === void 0 ? void 0 : _d.sha,
                owner: context.repo.owner,
                repo: context.repo.repo
            });
            if (response.status !== 200) {
                core.setFailed(`The GitHub API returned an unexpected status ${response.status}`);
            }
            const modifiedModules = new Set();
            for (const file of response.data.files) {
                const filename = file.filename;
                const firstSlashIndex = filename.indexOf("/");
                if (firstSlashIndex !== -1) {
                    modifiedModules.add(filename.substring(0, firstSlashIndex));
                }
            }
            // Spreading into array, as JSON doesn't work well with Sets out of the box
            const modifiedModulesJSON = JSON.stringify([...modifiedModules]);
            console.log(`Setting output modified_modules to: ${modifiedModulesJSON}`);
            core.setOutput("modified_modules", modifiedModulesJSON);
        }
        catch (e) {
            core.setFailed(e.message);
        }
    });
}
run();
