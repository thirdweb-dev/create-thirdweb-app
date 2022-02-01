import examples from "./examples";
import path from "path";
import { exec, execSync } from "child_process";
import inquirer from "inquirer";
import chalk from "chalk";

export async function handler(
  lang: string,
  module: string,
  example: string,
  name: string
) {
  console.log(chalk.gray("Language: "), chalk.green(lang));
  console.log(chalk.gray("Folder name: "), chalk.green(name));
  console.log(chalk.gray("Example: "), chalk.green(example));
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "confirm",
        message: "Does this look good?",
        default: true,
      },
    ])
    .then(async (answers) => {
      if (answers.confirm) {
        console.clear();
        console.log(chalk.gray("Setting up..."));

        var start = new Date();
        const pathname = `${path.resolve("./")}/${name}`;
        execSync(
          `git clone ${examples[lang][module][example].repo}.git ${pathname} `,
          {
            stdio: [1],
          }
        );
        execSync(
          `cd ${pathname} && ${examples[lang][module][example].install}`,
          {
            stdio: [1],
          }
        );
        console.clear();
        console.log(
          `Done in ${(new Date().getTime() - start.getTime()) / 1000}s ✨ `
        );
        console.log(
          "run `" +
            chalk.green(
              `cd ${name}${
                examples[lang][module][example].start
                  ? " && " + examples[lang][module][example].start
                  : ""
              }`
            ) +
            "` to get started"
        );
        console.log(
          `Find accompanying tutorial at ${chalk.green(
            examples[lang][module][example].guide
          )}`
        );
        console.log(
          "Stuck somewhere? Join our discord at " +
            chalk.green(`https://discord.gg/thirdweb`)
        );
      } else {
        console.log(chalk.red("Operation cancelled by user"));
      }
    });
}
