const got = require('got')
const { CookieJar } = require('tough-cookie')
const FormData = require('form-data')

const videoId = 'Z2qi_pivYSM'

const cookieJar = new CookieJar()

got(`https://www.youtube.com/watch?v=${videoId}`, { cookieJar })
  .then(res => {
    const configScriptMatch = /<script[^>]*>(?:\n|\s)*(yt\.setConfig\({[\n\s]*'VIDEO_ID':(?:.|\n|\s)+?)<\/script\s*>/i.exec(
      res.body
    )

    if (!configScriptMatch || !configScriptMatch[1]) {
      throw new Error('Unable to find config script element on video page.')
    }

    const configScript = configScriptMatch[1]

    const continuationM = /\\"continuation\\":\\"([^\\"]+).+\\"comment-item-section\\"/i.exec(
      configScript
    )
    const clickTrackingM = /\\"clickTrackingParams\\":\\"([^\\"]+).+\\"comment-item-section\\"/i.exec(
      configScript
    )

    if (!continuationM || !continuationM[1]) {
      throw new Error('Unable to extract continuation token from video page.')
    }

    if (!clickTrackingM || !clickTrackingM[1]) {
      throw new Error(
        'Unable to extract clickTrackingParams token from video page.'
      )
    }

    const sessionM = /XSRF_TOKEN':[\s\n]*"([^"]+)"/i.exec(res.body)

    if (!sessionM || !sessionM[1]) {
      throw new Error('Unable to extract session token from video page.')
    }

    return {
      continuation: continuationM[1],
      itct: clickTrackingM[1],
      sessionToken: sessionM[1]
    }
  })
  .then(({ continuation, itct, sessionToken }) => {
    const params = {
      action_get_comments: 1,
      pbj: 1,
      ctoken: continuation,
      continuation,
      itct
    }

    const form = new FormData()
    form.append('session_token', sessionToken)

    console.error(form)

    const headers = {
      Host: ' www.youtube.com',
      'User-Agent':
        'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:69.0) Gecko/20100101 Firefox/69.0',
      Accept: '*/*',
      'Accept-Language': 'en-CA,en-US;q=0.7,en;q=0.3',
      'Accept-Encoding': 'gzip, deflate, br',
      Referer: 'https://www.youtube.com/watch?v=Z2qi_pivYSM',
      'X-YouTube-Client-Name': 1,
      'X-YouTube-Client-Version': '2.20191017.04.00',
      'X-YouTube-Page-CL': 275134860,
      'X-YouTube-Page-Label': 'youtube.ytfe.desktop_20191016_4_RC0',
      'X-YouTube-Variants-Checksum': '06cac2fe9602b1223148e475d9b658ce',
      'X-YouTube-Utc-Offset': -240,
      'X-YouTube-Ad-Signals':
        'dt=1571497349591&flash=0&frm&u_tz=-240&u_his=4&u_java&u_h=768&u_w=1366&u_ah=743&u_aw=1366&u_cd=24&u_nplug&u_nmime&bc=29&bih=602&biw=647&brdim=0%2C25%2C0%2C25%2C1366%2C25%2C1366%2C715%2C659%2C602&vis=1&wgl=true&ca_type=image&bid=ANyPxKqzfUO30HRv0M2H6AeWGxX8ZZbZGemwvq0W0AIrI7kOTmEENhSSeMo-Viiph8qE-lYLxF5UUdYjf3XxCFJTmxvxmocoxg',
      'X-SPF-Referer': 'https://www.youtube.com/watch?v=Z2qi_pivYSM',
      'X-SPF-Previous': 'https://www.youtube.com/watch?v=Z2qi_pivYSM',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': 280,
      DNT: 1,
      Connection: 'keep-alive',
      TE: 'Trailers'
    }

    console.error(JSON.stringify(headers, null, 2))

    return got.post('https://www.youtube.com/comment_service_ajax', {
      query: params,
      body: form,
      headers
    })
  })
  .then(res => {
    console.log(res)
  })

// https://www.youtube.com/comment_service_ajax
//   ?action_get_comments=1
//   &pbj=1
//   &ctoken=EkQSC1oycWlfcGl2WVNNwAEAyAEA4AEBogINKP___________wFAAMICGxoXaHR0cHM6Ly93d3cueW91dHViZS5jb20iABgG
//   &continuation=EkQSC1oycWlfcGl2WVNNwAEAyAEA4AEBogINKP___________wFAAMICGxoXaHR0cHM6Ly93d3cueW91dHViZS5jb20iABgG
//   &itct=CGwQybcCIhMI_o2P6cuo5QIVAQiDCh03iAQg
