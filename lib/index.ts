#! /usr/bin/env node

"use strict";
import inquirer from "inquirer";
import examples from "./examples";
import { handler } from "./handler";
var generate = require("project-name-generator");
const args = process.argv.slice(2);
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
                  choices: Object.keys(examples[languageName][moduleName]),
                },
                {
                  type: "input",
                  name: "name",
                  message: "Name of the app?",
                  default: generate().dashed,
                },
              ])
              .then(async (example) => {
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
