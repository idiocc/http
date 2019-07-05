import HttpContext from '../../../../src'
import Busboy from '@goa/busboy'

/** @type {Object<string, (h: HttpContext, { middleware: !Function})} */
const TS = {
  context: [HttpContext, {
    /**
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     */
    middleware(req, res) {
      const data = []
      const busboy = new Busboy({
        headers: req.headers,
      })
      req.pipe(busboy)
      busboy.on('file', (fieldname, stream, filename, transferEncoding, mimeType) => {
        data.push([fieldname, filename, transferEncoding, mimeType])
      })
      busboy.on('field', (fieldname, value, _, __, transferEncoding, mimeType) => {
        data.push([fieldname, value, transferEncoding, mimeType])
      })
      req.on('end', () => {
        res.setHeader('content-type', 'application/json')
        res.end(JSON.stringify(data, null, 2))
      })
    } }],
  // tests
  /* start example */
  async 'posts multipart/form-data'({ startPlain }, { middleware }) {
    await startPlain(middleware)
      .postForm('/submit', async (form) => {
        form.addSection('field', 'hello-world')
        await form.addFile('test/fixture/test.txt', 'file')
        await form.addFile('test/fixture/test.txt', 'file', {
          filename: 'testfile.txt',
        })
      })
      .assert(200, [
        [ 'field', 'hello-world', '7bit', 'text/plain' ],
        [ 'file',  'test.txt', '7bit', 'application/octet-stream' ],
        [ 'file',  'testfile.txt', '7bit', 'application/octet-stream' ],
      ])
  },
  /* end example */
}

export default TS

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 * @typedef {import('http').ServerResponse} ServerResponse
 */