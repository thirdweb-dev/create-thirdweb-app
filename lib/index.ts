#! /usr/bin/env node

"use strict";
import inquirer from "inquirer";
import fs from "fs";
import fetch from "node-fetch";
import { handler } from "./handler";
import path from "path";
var generate = require("project-name-generator");
const args = process.argv.slice(2);
console.clear();
let examples: any;
fetch("https://gist.githubusercontent.com/ayshptk/c0244844556fa43e8eacf737a678245f/raw/9d98239d65c552c0295066094df56eb9976891fa/test.json").then(async (res) => {
  fs.writeFile(
    path.resolve(__dirname, "examples.json"),
    await res.text(),
    (err) => {
      examples = require(path.resolve(__dirname, "examples.json"));
      switch (args[0]) {
        case undefined:
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
                    });
                });
            });
          break;
      }
    }
  );
});
