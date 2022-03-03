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
const supportedCommands: string[] = ["-v", "--version", "-h", "--help", "init"];
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
                message: "Language / Framework?",
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
                    message: "Contract / Module?",
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
          if (args[0] === "init") {
            if (args.length === 1) {
              console.log(
                chalk.red(
                  "Please provide the name of the template or simply run `create-thirdweb-app`"
                )
              );
              exit(1);
            }
            if (args.length > 3) {
              console.log(
                chalk.red(
                  "`create-thirdweb-app init` takes only two arguments. Please try again."
                )
              );
              exit(1);
            }
            fetch(
              "https://raw.githubusercontent.com/thirdweb-dev/create-thirdweb-app/main/lib/slugs.json"
            )
              .then(async (res) => {
                if (res.status !== 200) {
                  console.log(chalk.red("Error fetching slugs"));
                  exit(1);
                }
                return await res.json();
              })
              .catch((err) => {
                console.log(chalk.red("Error fetching slugs:", err.message));
                exit(1);
              })
              .then(async (slugs) => {
                if (!slugs[args[1]]) {
                  console.log(chalk.red("Invalid slug"));
                  exit(1);
                }
                const slugMetadata = slugs[args[1]];
                let name: string;
                if (args.length === 3) {
                  name = args[2];
                } else {
                  name = await inquirer
                    .prompt([
                      {
                        type: "input",
                        name: "name",
                        message: "Name of the app?",
                        default: generate().dashed,
                      },
                    ])
                    .then((example) => {
                      return example.name;
                    });
                }
                await handler(
                  slugMetadata.language,
                  slugMetadata.module,
                  slugMetadata.example,
                  name
                );
              });
          } else {
            if (args.filter((x) => !supportedCommands.includes(x)).length > 0) {
              console.log(chalk.red("Unexpected flag(s) :", args.join(" ")));
              exit(1);
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
    }
  );
});
