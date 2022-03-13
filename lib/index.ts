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
const supportedCommands: string[] = ["-v", "--version", "-h", "--help", "init"];
console.clear();
let examples: any = {};
fetch(
  "https://raw.githubusercontent.com/thirdweb-dev/create-thirdweb-app/new/examples.json"
).then(async (res) => {
  fs.writeFile(
    path.resolve(__dirname, "examples.json"),
    await res.text(),
    async (err) => {
      examples = require(path.resolve(__dirname, "examples.json"));
      switch (args.length) {
        case 0:
          let languageName: string;
          inquirer
            .prompt([
              {
                type: "list",
                name: "language",
                message: "Choose example",
                choices: Object.keys(examples),
              },
            ])
            .then((answer) => {
              languageName = answer.language;
              chooseName()
                .then(async (answer) => {
                  await handler(languageName, answer);
                })
                .catch((err) => {
                  console.clear();
                  if (err.command) {
                    console.log(`${chalk.cyan(err.command)} has failed.`);
                  } else {
                    console.log(
                      chalk.red("Unexpected error. Please report it as a bug:")
                    );
                    console.log(err);
                  }
                });
            });
          break;
        case 1:
          if (Object.keys(examples).includes(args[0])) {
            let name: string;

            chooseName().then(async (answer) => {
              await handler(args[0], answer);
            });
          } else {
            flags(args[0]);
          }
          break;
        case 2:
          if (Object.keys(examples).includes(args[0])) {
            await handler(args[0], args[1]);
          } else {
            flags(args[0]);
          }
          break;
        default:
          if (args.filter((x) => !supportedCommands.includes(x)).length > 0) {
            console.log(chalk.red("Unexpected flag(s) :", args.join(" ")));
            exit(1);
          }

          if (args.includes("-v") || args.includes("--version")) {
          }
      }
    }
  );
});

function flags(flag: string) {
  switch (flag) {
    case "-h" || "--help":
      console.log(
        `Please visit  ${chalk.cyan(
          "https://github.com/thirdweb-dev/create-thirdweb-app#readme"
        )} to know more about the usage of this package.`
      );
      break;

    case "-v" || "--version":
      console.log(
        `${chalk.cyan("create-thirdweb-app")} ${chalk.green(
          require(path.resolve(__dirname, "../package.json")).version
        )}`
      );
      break;
    default:
      console.log(chalk.red("Unexpected flag:", flag));
      exit(1);
  }
}

async function chooseName() {
  return await inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Name of the app?",
        default: generate().dashed,
      },
    ])
    .then((answer) => {
      return answer.name;
    });
}
