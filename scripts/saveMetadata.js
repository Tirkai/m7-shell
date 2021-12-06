import { exec } from "child_process";
import fs from "fs-extra";
import { v4 } from "uuid";

const escape = (value) => value.replace("\n", "");

const execCommand = async (command) =>
    new Promise((resolve) => {
        exec(command, (error, stdout, stderror) => {
            if (error) {
                console.error(error);
            }
            if (stderror) {
                console.error(stderror);
            }
            const out = stdout;
            resolve(out);
        });
    });

const bootstrap = async () => {
    const assemblyId = v4();
    const branch = escape(await execCommand("git rev-parse --abbrev-ref HEAD"));
    const commit = `https://192.168.0.3/m7/frontend/m7-shell/-/commit/${escape(
        await execCommand("git rev-parse HEAD"),
    )}`;
    const author = escape(
        await execCommand("git log -1 --pretty=format:'%ae'"),
    );

    const result = {
        assemblyId,
        branch,
        commit,
        author,
    };

    await fs.writeJSON("./build/metadata.json", result);
};
bootstrap();
