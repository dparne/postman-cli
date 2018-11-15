#!/usr/bin/env node

import program from 'commander';
import inquirer from 'inquirer';
import axios from 'axios';
import { askQuestion, deleteFile, createFile, createRandomId } from './lib/utils';
import { runNewman } from './lib/newman';

program
    .version('0.0.1')
    .option('-c, --collection-uid [value]', 'Provide the collection uid')
    .option('-e, --environment-uid [value]', 'Provide the environment uid')
    .action(async () => {
        try {

            const randomId = createRandomId();
            const collectionFileName = `postman_temp${randomId}collection.json`;
            const environmentFileName = `postman_temp${randomId}environment.json`;

            let postmanApiKey = process.env.POSTMAN_API_KEY
            if (!process.env.POSTMAN_API_KEY) {
                postmanApiKey = await askQuestion('please enter your postman api key -> ');
            }

            /**
             * Get list of collections and download the one user selects
             */
            let collectionUid = program.collectionUid;
            let environmentUid = program.environmentUid;
            if (!collectionUid) {
                console.log('Came in here');
                let collectionsResponse: any = await axios.get('https://api.getpostman.com/collections', {
                    headers: {
                        'X-Api-Key': postmanApiKey
                    }
                });
                let collections = collectionsResponse.data.collections.map((collection: any) => {
                    return { name: collection.name, value: collection.uid }
                });
                let collectionAnswer: any = await inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'collection',
                            message: 'Pick the collection -> ',
                            choices: collections
                        }
                    ]);
                collectionUid = collectionAnswer.collection;
            }
            let collectionResponse: any = await axios.get(`https://api.getpostman.com/collections/${collectionUid}`, {
                headers: {
                    'X-Api-Key': postmanApiKey
                }
            });
            await createFile(collectionFileName, JSON.stringify(collectionResponse.data.collection));


            /**
             * Get list of environments and download the one user selects
             */
            if (!environmentUid) {
                let environmentsResponse: any = await axios.get('https://api.getpostman.com/environments', {
                    headers: {
                        'X-Api-Key': postmanApiKey
                    }
                });
                let environments = environmentsResponse.data.environments.map((environment: any) => {
                    return { name: environment.name, value: environment.uid }
                })
                let environmentAnswer: any = await inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'environment',
                            message: 'Pick the environment -> ',
                            choices: environments
                        }
                    ]);
                environmentUid = environmentAnswer.environment;
            }
            let environmentResponse: any = await axios.get(`https://api.getpostman.com/environments/${environmentUid}`, {
                headers: {
                    'X-Api-Key': postmanApiKey
                }
            });
            await createFile(environmentFileName, JSON.stringify(environmentResponse.data.environment));

            await runNewman(require(`${process.cwd()}/${collectionFileName}`), require(`${process.cwd()}/${environmentFileName}`));
            await deleteFile(collectionFileName);
            await deleteFile(environmentFileName);

            process.exit(0);
        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    })
    .parse(process.argv);