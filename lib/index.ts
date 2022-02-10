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
// TODO: change url to https://raw.githubusercontent.com/nftlabs/cli/main/lib/examples.json when repo is made public
fetch(
  "https://gist.githubusercontent.com/ayshptk/c0244844556fa43e8eacf737a678245f/raw/681932d1fd49a56c8ab57300e9f21d23154c24fe/create-thirdweb-app.json"
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
                "https://github.com/nftlabs/create-thirdweb-app#readme"
              )} to know more about the usage of this package.`
            );
          }
          if (args.includes("-v") || args.includes("--version")) {
            console.log(
              `${chalk.cyan("@3rdweb/cli")} ${chalk.green(
                require(path.resolve(__dirname, "../package.json")).version
              )}`
            );
          }
      }
    }
  );
});
