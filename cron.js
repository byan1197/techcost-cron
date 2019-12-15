const scheduler = require('node-schedule')
const mongoose = require('mongoose')
const CronRequest = require('@bonyaa/techcost-commons/models/CronRequest')
const Axios = require('axios')

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })

//runs once every day at 11:30 PM UTC
scheduler.scheduleJob('30 23 * * * *', () => {
    CronRequest.find({ isDeleted: false }).then(crArr => crArr.map(cr =>
        Axios.post(process.env.API_URL, {
            user_id: cr.user,
            scrape_type: cr.type,
            item_name: cr.item
        })
    )).then(axiosArr => {
        Promise.all(axiosArr)
        .then(responseArr => {
            responseArr.forEach(res => {
                console.log('saved', res.data)
            })
        })
    })
        .catch(e => {
            console.error(e)
        })
});

// // test function that should run once every minute
// scheduler.scheduleJob('* * * * *', () => {
//     var axiosArr = [];
//     for (var i = 0; i < 10; i++) {
//         axiosArr.push(Axios.get('https://cat-fact.herokuapp.com/facts'))
//     }

//     Promise.all(axiosArr).then(args => {
//         console.log('1', args[0].data.all[0])
//         console.log('2', args[1].data.all[1])
//     })

//     console.log('do you see me!')
// })