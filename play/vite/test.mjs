import { outPutFile, readFile, pathExists, remove, copy, readJson, jsObjectToHashmap } from 'unplugin-img-compress-fs'
import tinify from 'tinify'

export const tinifyBuffer = (data, APIKey) => {
  tinify.key = APIKey
  return new Promise((resolve) => {
    tinify.fromBuffer(data)
      .toBuffer((err, resultData) => {
        if (err)
          throw err

        resolve(resultData)
      })
  })
}

async function start() {
  // const data = Buffer.from(readFile('./home.png'))
  // const tinifyRes = await tinifyBuffer(data, 'kZgn8pxfdjQjKFmf2StLq7CY4TqMgs0T')
  // outPutFile('./homes.png', tinifyRes.toJSON().data)

  // let isExists = await pathExists('./home.png')
  // console.log(isExists)
  // isExists = await pathExists('./homes.png')
  // console.log(isExists)

  // await remove('./homes')
  // copy('./home.png', './homes.png')
  const json = readJson('./package.json')
  json.name = 'baiwusanyu'
  const res = jsObjectToHashmap(json)
  debugger
  // writeJson(json, './package-test.json')
}
start()
// TODO: outputFile √
// TODO: pathExists √
// TODO: readFile √
// TODO: remove √

// TODO: readJson √
// TODO: writeJson
// TODO: readdir
// TODO: stat

// TODO: copy √
