#! /usr/bin/env node
"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var inquirer_1 = __importDefault(require("inquirer"));
var fs_1 = __importDefault(require("fs"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var handler_1 = require("./handler");
var path_1 = __importDefault(require("path"));
var chalk_1 = __importDefault(require("chalk"));
var process_1 = require("process");
var generate = require("project-name-generator");
var args = process.argv.slice(2);
inquirer_1.default.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);
var supportedCommands = ["-v", "--version", "-h", "--help"];
console.clear();
var examples;
(0, node_fetch_1.default)(
  "https://raw.githubusercontent.com/thirdweb-dev/cli/main/lib/examples.json"
).then(function (res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          _b = (_a = fs_1.default).writeFile;
          _c = [path_1.default.resolve(__dirname, "examples.json")];
          return [4 /*yield*/, res.text()];
        case 1:
          _b.apply(
            _a,
            _c.concat([
              _d.sent(),
              function (err) {
                examples = require(path_1.default.resolve(
                  __dirname,
                  "examples.json"
                ));
                switch (args.length) {
                  case 0:
                    var languageName_1;
                    var moduleName_1;
                    inquirer_1.default
                      .prompt([
                        {
                          type: "list",
                          name: "answer",
                          message: "Language?",
                          choices: Object.keys(examples),
                        },
                      ])
                      .then(function (language) {
                        languageName_1 = language.answer;
                        inquirer_1.default
                          .prompt([
                            {
                              type: "list",
                              name: "answer",
                              message: "Module?",
                              choices: Object.keys(examples[languageName_1]),
                            },
                          ])
                          .then(function (module) {
                            moduleName_1 = module.answer;
                            inquirer_1.default
                              .prompt([
                                {
                                  type: "list",
                                  name: "answer",
                                  message: "Example?",
                                  choices: Object.keys(
                                    examples[languageName_1][moduleName_1]
                                  ),
                                },
                                {
                                  type: "input",
                                  name: "name",
                                  message: "Name of the app?",
                                  default: generate().dashed,
                                },
                              ])
                              .then(function (example) {
                                return __awaiter(
                                  void 0,
                                  void 0,
                                  void 0,
                                  function () {
                                    return __generator(this, function (_a) {
                                      switch (_a.label) {
                                        case 0:
                                          console.clear();
                                          return [
                                            4 /*yield*/,
                                            (0, handler_1.handler)(
                                              languageName_1,
                                              moduleName_1,
                                              example.answer,
                                              example.name
                                            ),
                                          ];
                                        case 1:
                                          _a.sent();
                                          return [2 /*return*/];
                                      }
                                    });
                                  }
                                );
                              })
                              .catch(function (err) {
                                console.clear();
                                if (err.command) {
                                  console.log(
                                    "  ".concat(
                                      chalk_1.default.cyan(err.command),
                                      " has failed."
                                    )
                                  );
                                } else {
                                  console.log(
                                    chalk_1.default.red(
                                      "Unexpected error. Please report it as a bug:"
                                    )
                                  );
                                  console.log(err);
                                }
                              });
                          });
                      });
                    break;
                  default:
                    if (
                      args.filter(function (x) {
                        return !supportedCommands.includes(x);
                      }).length > 0
                    ) {
                      console.log(
                        chalk_1.default.red(
                          "Unexpected flag(s) :",
                          args.join(" ")
                        )
                      );
                      (0, process_1.exit)(1);
                    } else {
                    }
                    if (args.includes("-h") || args.includes("--help")) {
                      console.log(
                        "Please visit  ".concat(
                          chalk_1.default.cyan(
                            "https://github.com/thirdweb-dev/create-thirdweb-app#readme"
                          ),
                          " to know more about the usage of this package."
                        )
                      );
                    }
                    if (args.includes("-v") || args.includes("--version")) {
                      console.log(
                        ""
                          .concat(chalk_1.default.cyan("@3rdweb/cli"), " ")
                          .concat(
                            chalk_1.default.green(
                              require(path_1.default.resolve(
                                __dirname,
                                "../package.json"
                              )).version
                            )
                          )
                      );
                    }
                }
              },
            ])
          );
          return [2 /*return*/];
      }
    });
  });
});
