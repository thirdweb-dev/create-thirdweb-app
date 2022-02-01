import examples from "./examples";
import path from "path";
import { execSync } from "child_process";

export async function handler(
  lang: string,
  module: string,
  example: string,
  name: string
) {
  const pathname = `${path.resolve("./")}/${name}`;
  execSync(
    `git clone ${examples[lang][module][example].repo}.git ${pathname} `,
    {
      stdio: [0, 1, 2],
    }
  );
  execSync(`cd ${pathname} && ${examples[lang][module][example].install}`, {
    stdio: [0, 1, 2],
  });
}
