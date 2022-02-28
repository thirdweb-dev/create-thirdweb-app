#! /usr/bin/env node

"use strict";
import inquirer from "inquirer";
import fs from "fs";
import fetch from "node-fetch";
import { handler } from "./handler";
import path from "path";
import chalk from "chalk";
import { exit } from "process";
var generate = require("project-name-generator");
const args = process.argv.slice(2);
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);
const supportedCommands: string[] = ["-v", "--version", "-h", "--help"];
console.clear();
let examples: any;
fetch(
  "https://raw.githubusercontent.com/thirdweb-dev/create-thirdweb-app/main/lib/examples.json"
).then(async (res) => {
  fs.writeFile(
    path.resolve(__dirname, "examples.json"),
    await res.text(),
    (err) => {
      examples = require(path.resolve(__dirname, "examples.json"));
      switch (args.length) {
        case 0:
          let languageName: string;
          let moduleName: string;
          inquirer
            .prompt([
              {
                type: "list",
                name: "answer",
                message: "Language?",
                choices: Object.keys(examples),
              },
            ])
            .then((language) => {
              languageName = language.answer;
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "answer",
                    message: "Module?",
                    choices: Object.keys(examples[languageName]),
                  },
                ])
                .then((module) => {
                  moduleName = module.answer;
                  inquirer
                    .prompt([
                      {
                        type: "list",
                        name: "answer",
                        message: "Example?",
                        choices: Object.keys(
                          examples[languageName][moduleName]
                        ),
                      },
                      {
                        type: "input",
                        name: "name",
                        message: "Name of the app?",
                        default: generate().dashed,
                      },
                    ])
                    .then(async (example) => {
                      console.clear();
                      await handler(
                        languageName,
                        moduleName,
                        example.answer,
                        example.name
                      );
                    })
                    .catch((err) => {
                      console.clear();
                      if (err.command) {
                        console.log(`  ${chalk.cyan(err.command)} has failed.`);
                      } else {
                        console.log(
                          chalk.red(
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
          if (args.filter((x) => !supportedCommands.includes(x)).length > 0) {
            console.log(chalk.red("Unexpected flag(s) :", args.join(" ")));
            exit(1);
          } else {
          }
          if (args.includes("-h") || args.includes("--help")) {
            console.log(
              `Please visit  ${chalk.cyan(
                "https://github.com/thirdweb-dev/create-thirdweb-app#readme"
              )} to know more about the usage of this package.`
            );
          }
          if (args.includes("-v") || args.includes("--version")) {
            console.log(
              `${chalk.cyan("create-thirdweb-app")} ${chalk.green(
                require(path.resolve(__dirname, "../package.json")).version
              )}`
            );
          }
      }
    }
  );
});
