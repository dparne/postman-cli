#!/usr/bin/env node

import * as newman from 'newman';
import * as readline from 'readline';
import program from 'commander';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (question: string) => {
    return new Promise<string>((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
};

program
    .version('0.1.0')
    .action(() => {
        console.log('hello');
        process.exit(0);
    })
    .parse(process.argv);