/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const path = require("path");
const SftpClient = require("ssh2-sftp-client");
const dotenv = require("dotenv");

dotenv.config();

const config = {
    host: process.env.SFTP_SERVER_NAME,
    username: process.env.SFTP_USER,
    password: process.env.SFTP_PASSWORD,
    port: 22,
};

async function main() {
    if (
        config.password?.length &&
        config.username?.length &&
        config.host?.length
    ) {
        const client = new SftpClient();
        const src = path.join(__dirname, "../build");
        const dest = process.env.SFTP_STATIC_PATH ?? "/opt";

        try {
            await client.connect(config);
            client.on("upload", (info: { source: string }) => {
                console.log(`Listener: Uploaded ${info.source}`);
            });
            const result = await client.uploadDir(src, dest);
            return result;
        } finally {
            client.end();
        }
    } else {
        console.log(
            "Pleace create ENV variables (SFTP_SERVER_NAME, SFTP_USER, SFTP_STATIC_PATH, SFTP_PASSWORD)",
        );
    }
}

main()
    .then((msg) => {
        console.log(msg);
    })
    .catch((err) => {
        console.log(`main error: ${err.message}`);
    });

export {};
