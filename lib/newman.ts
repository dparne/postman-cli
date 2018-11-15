import newman from 'newman';

export const runNewman = async (collection: any, environment: any) => {
    await new Promise<any>((resolve, reject) => {
        newman.run({
            collection: collection,
            environment: environment,
            reporters: 'cli'
        }, function (err) {
            if (err) reject(err);
            resolve();
        });
    });
}