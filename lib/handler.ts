import path from "path";
import { execSync } from "child_process";
import inquirer from "inquirer";
import chalk from "chalk";

export async function handler(
  lang: string,
  module: string,
  example: string,
  name: string
) {
  const examples = require(path.resolve(__dirname, "examples.json"));

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
        const ex = examples[lang][module][example];
        execSync(`git clone ${ex.repo}.git ${pathname} `, {
          stdio: [1],
        });
        execSync(`cd ${pathname} && ${ex.install}`, {
          stdio: [1],
        });
        console.clear();
        console.log(
          `Done in ${(new Date().getTime() - start.getTime()) / 1000}s ✨ `
        );
        const startCommand = ex.start;
        console.log(
          "run `" +
            chalk.green(
              `cd ${name}${startCommand ? " && " + startCommand : ""}`
            ) +
            "` to get started"
        );
        console.log(`Find accompanying tutorial at ${chalk.green(ex.guide)}`);
        console.log(
          "Stuck somewhere? Join our discord at " +
            chalk.green(`https://discord.gg/thirdweb`)
        );
      } else {
        console.log(chalk.red("Operation cancelled by user"));
      }
    });
}
