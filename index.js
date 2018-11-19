#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const inquirer_1 = __importDefault(require("inquirer"));
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("./lib/utils");
const newman_1 = require("./lib/newman");
commander_1.default
    .version('1.0.5')
    .option('-a, --all', 'Run all')
    .option('-c, --collection-uid [value]', 'Provide the collection uid')
    .option('-e, --environment-uid [value]', 'Provide the environment uid')
    .action(() => __awaiter(this, void 0, void 0, function* () {
    try {
        const randomId = utils_1.createRandomId();
        const collectionFileName = `postman_temp${randomId}collection.json`;
        const environmentFileName = `postman_temp${randomId}environment.json`;
        let postmanApiKey = process.env.POSTMAN_API_KEY;
        if (!process.env.POSTMAN_API_KEY) {
            postmanApiKey = yield utils_1.askQuestion('please enter your postman api key -> ');
        }
        /**
         * Get list of collections and download the one user selects
         */
        let collectionUid = commander_1.default.collectionUid;
        let environmentUid = commander_1.default.environmentUid;
        let runAll = commander_1.default.all;
        if (runAll) {
            let collectionsResponse = yield axios_1.default.get('https://api.getpostman.com/collections', {
                headers: {
                    'X-Api-Key': postmanApiKey
                }
            });
            let collections = collectionsResponse.data.collections.map((collection) => collection.uid);
            let environmentsResponse = yield axios_1.default.get('https://api.getpostman.com/environments', {
                headers: {
                    'X-Api-Key': postmanApiKey
                }
            });
            let environments = environmentsResponse.data.environments.map((environment) => environment.uid);
            for (let collection of collections) {
                const collectionFileName = `postman_temp${randomId}collection${collection}.json`;
                let collectionResponse = yield axios_1.default.get(`https://api.getpostman.com/collections/${collection}`, {
                    headers: {
                        'X-Api-Key': postmanApiKey
                    }
                });
                yield utils_1.createFile(collectionFileName, JSON.stringify(collectionResponse.data.collection));
                for (let environment of environments) {
                    const environmentFileName = `postman_temp${randomId}environment${environment}.json`;
                    let environmentResponse = yield axios_1.default.get(`https://api.getpostman.com/environments/${environment}`, {
                        headers: {
                            'X-Api-Key': postmanApiKey
                        }
                    });
                    yield utils_1.createFile(environmentFileName, JSON.stringify(environmentResponse.data.environment));
                    yield newman_1.runNewman(require(`${process.cwd()}/${collectionFileName}`), require(`${process.cwd()}/${environmentFileName}`));
                    yield utils_1.deleteFile(collectionFileName);
                    yield utils_1.deleteFile(environmentFileName);
                }
            }
        }
        else {
            if (!collectionUid) {
                let collectionsResponse = yield axios_1.default.get('https://api.getpostman.com/collections', {
                    headers: {
                        'X-Api-Key': postmanApiKey
                    }
                });
                let collections = collectionsResponse.data.collections.map((collection) => {
                    return { name: collection.name, value: collection.uid };
                });
                let collectionAnswer = yield inquirer_1.default
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
            let collectionResponse = yield axios_1.default.get(`https://api.getpostman.com/collections/${collectionUid}`, {
                headers: {
                    'X-Api-Key': postmanApiKey
                }
            });
            yield utils_1.createFile(collectionFileName, JSON.stringify(collectionResponse.data.collection));
            /**
             * Get list of environments and download the one user selects
             */
            if (!environmentUid) {
                let environmentsResponse = yield axios_1.default.get('https://api.getpostman.com/environments', {
                    headers: {
                        'X-Api-Key': postmanApiKey
                    }
                });
                let environments = environmentsResponse.data.environments.map((environment) => {
                    return { name: environment.name, value: environment.uid };
                });
                let environmentAnswer = yield inquirer_1.default
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
            let environmentResponse = yield axios_1.default.get(`https://api.getpostman.com/environments/${environmentUid}`, {
                headers: {
                    'X-Api-Key': postmanApiKey
                }
            });
            yield utils_1.createFile(environmentFileName, JSON.stringify(environmentResponse.data.environment));
            yield newman_1.runNewman(require(`${process.cwd()}/${collectionFileName}`), require(`${process.cwd()}/${environmentFileName}`));
            yield utils_1.deleteFile(collectionFileName);
            yield utils_1.deleteFile(environmentFileName);
        }
        process.exit(0);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
}))
    .parse(process.argv);
