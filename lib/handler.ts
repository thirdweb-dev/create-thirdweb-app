import path from "path";
import { execSync } from "child_process";
import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs";
import fetch from "node-fetch";
import zipper from "node-stream-zip";

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
        console.log(ex.subfolder);
        await download(`create-thirdweb-app-main/${ex.subfolder}`, pathname);
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
async function download(url: string, path: string) {
  const res = (await fetch(
    `https://codeload.github.com/nftlabs/create-thirdweb-app/zip/refs/heads/main`
  )) as any;
  const fileStream = fs.createWriteStream(`${__dirname}/temp.zip`);
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on("error", reject);
    fileStream.on("finish", resolve);
  });
  fs.mkdirSync(path);
  const zip = new zipper.async({ file: `${__dirname}/temp.zip` });
  await zip.extract(url, path);
  await zip.close();
}
