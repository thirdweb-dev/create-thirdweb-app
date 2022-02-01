import examples from "./examples";
import path from "path";
import { execSync } from "child_process";

export async function handler(
  lang: string,
  module: string,
  example: string,
  name: string
) {
  var start = new Date();
  const pathname = `${path.resolve("./")}/${name}`;
  execSync(
    `git clone ${examples[lang][module][example].repo}.git ${pathname} `,
    {
      stdio: [0],
    }
  );
  execSync(`cd ${pathname} && ${examples[lang][module][example].install}`, {
    stdio: [0],
  });
  console.log(`Done in ${new Date().getTime() - start.getTime()}ms ✨ `);
  console.log(`Find accompanying tutorial here: ${examples[lang][module][example].guide}`);
}
