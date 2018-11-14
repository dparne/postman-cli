#!/usr/bin/env node

import newman from 'newman';
import readline from 'readline';
import program from 'commander';
import inquirer from 'inquirer';
import axios from 'axios';
import fs from 'fs';

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
    .version('0.0.1')
    .action(async () => {
        try {
            const postmanConfig: any = {
                apiKey: process.env.POSTMAN_API_KEY
            };
            if (!process.env.POSTMAN_API_KEY) {
                postmanConfig.apiKey = await askQuestion('please enter your postman api key -> ');
            }
            let collectionsResponse: any = await axios.get('https://api.getpostman.com/collections', {
                headers: {
                    'X-Api-Key': postmanConfig.apiKey
                }
            });
            let choices = collectionsResponse.data.collections.map((choice: any) => {
                return { name: choice.name, value: choice.uid }
            })
            console.log(choices);
            let collectionAnswer = await inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'collection',
                        message: 'Pick the collection -> ',
                        choices: choices
                    }
                ]);
            let environmentsResponse: any = await axios.get('https://api.getpostman.com/environments', {
                headers: {
                    'X-Api-Key': postmanConfig.apiKey
                }
            });
            let environments = environmentsResponse.data.environments.map((environment: any) => {
                return { name: environment.name, value: environment.uid }
            })
            console.log(environments);
            let environmentAnswer = await inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'environment',
                        message: 'Pick the environment -> ',
                        choices: environments
                    }
                ]);
            process.exit(0);
        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    })
    .parse(process.argv);