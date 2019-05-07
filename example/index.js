/* alanode example/ */
import http from '../src'

(async () => {
  const res = await http({
    text: 'example',
  })
  console.log(res)
})()