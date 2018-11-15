import readline from 'readline';
import crypto from 'crypto';
import fs from 'fs';

export const createRandomId = () => {
    return crypto.randomBytes(20).toString('hex');
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export const askQuestion = (question: string) => {
    return new Promise<string>((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
};

export const deleteFile = async (file: string) => {
    await new Promise<any>((resolve, reject) => {
        fs.unlink(file, (err) => {
            if (err)
                reject(err);
            else {
                resolve();
            }
        });
    });
}

export const createFile = async (file: string, content: string) => {
    await new Promise<any>((resolve, reject) => {
        fs.writeFile(file, content, (err) => {
            if (err)
                reject(err);
            else {
                resolve();
            }
        });
    });
}
