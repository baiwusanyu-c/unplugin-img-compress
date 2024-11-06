import { outPutFile, readFile, pathExists } from 'unplugin-img-compress-fs'
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
  let isExists = await pathExists('./home.png')
  console.log(isExists)
  isExists = await pathExists('./homes.png')
  console.log(isExists)
}
start()
// TODO: outputFile √
// TODO: pathExists
// TODO: readFile √
// TODO: remove

// TODO: readdir
// TODO: readJson
// TODO: writeJson
// TODO: copy
// TODO: stat
