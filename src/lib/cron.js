import cron from 'cron';
import "dotenv/config";
import https from 'https';

const job = new cron.CronJob('*/14 * * * *', function ()  {
    https.get(process.env.API_URL,(res) => {
            if(res.statusCode === 200) console.log('GET req executed successfully!');
            else console.log("Get req failed!", res.statusCode);
        })
        .on('error', (e) => console.error(e));
});

export default job;