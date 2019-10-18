const got = require('got')
const { CookieJar } = require('tough-cookie')

const videoId = 'Z2qi_pivYSM'

const cookieJar = new CookieJar()

got(`https://www.youtube.com/watch?v=${videoId}`, { cookieJar }).then(res => {
  console.log(res.body)
})
