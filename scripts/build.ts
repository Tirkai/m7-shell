/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
import chalk from "chalk";
import { exec } from "child_process";
import moment from "moment";
import { version } from "../package.json";
import { loaderData } from "./loader.json";

class Loader {
    interval: NodeJS.Timeout | null = null;
    index: number = 0;
    text: string = "";
    start(text: string) {
        this.text = text;

        this.interval = setInterval(() => {
            const data = loaderData;

            process.stdout.write(
                `\r${this.text} ${chalk.blueBright(data[this.index])} `,
            );

            if (this.index < data.length - 1) {
                this.index++;
            } else {
                this.index = 0;
            }
        }, 300);
    }

    stop() {
        if (this.interval) {
            this.index = 0;
            clearInterval(this.interval);
            console.clear();
        }
    }
}

const loader = new Loader();

const execCommand = async <T>(command: string) =>
    new Promise<T>((resolve) => {
        exec(command, (error, stdout, stderror) => {
            if (error) {
                console.error(error);
            }
            if (stderror) {
                console.error(stderror);
            }
            const out = (stdout as unknown) as T;
            resolve(out);
        });
    });

const escape = (value: string) => value.replace("\n", "");

const init = async () => {
    console.log(chalk.gray("============"));
    console.log(
        chalk.yellow("Assembly starts. Please wait a moment (* ^ ω ^)"),
    );

    const date = moment().format();
    const branch = escape(
        await execCommand<string>("git rev-parse --abbrev-ref HEAD"),
    );

    const commit = escape(
        await execCommand<string>("git rev-parse --short HEAD"),
    );

    const author = escape(
        await execCommand<string>("git log -1 --pretty=format:'%an'"),
    );

    const email = escape(
        await execCommand<string>("git log -1 --pretty=format:'%ae'"),
    );

    const envArgs = `REACT_APP_DATE=${date} REACT_APP_BRANCH=${branch} REACT_APP_COMMIT=${commit} REACT_APP_VERSION=${version} REACT_APP_AUTHOR=${author} REACT_APP_EMAIL=${email}`;

    loader.start("Assembling");
    await execCommand(`cd ../ && npx cross-env ${envArgs} npm run build`);
    loader.stop();
    console.log(chalk.blue("============"));
    console.log(chalk.yellow("Assembly succesfull! 	(´｡• ω •｡`)"));
    console.log(chalk.blue("============"));
};

init();
