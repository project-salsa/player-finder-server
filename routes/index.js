const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', (req, res) => {
  res.send('GET request received')
})

router.post('/', (req, res) => {
  res.send('POST request received')
})
router.put('/', (req, res) => {
  res.send('PUT request received')
})
router.head('/', (req, res) => {
  res.send('HEAD request received')
})
router.delete('/', (req, res) => {
  res.send('DELETE request received')
})
router.patch('/', (req, res) => {
  res.send('PATCH request received')
})
router.copy('/', (req, res) => {
  res.send('COPY request received')
})
router.options('/', (req, res) => {
  res.send('OPTIONS request received')
})
router.link('/', (req, res) => {
  res.send('LINK request received')
})
router.unlink('/', (req, res) => {
  res.send('UNLINK request received')
})
router.purge('/', (req, res) => {
  res.send('PURGE request received')
})
router.lock('/', (req, res) => {
  res.send('LOCK request received')
})
router.unlock('/', (req, res) => {
  res.send('UNLOCK request received')
})
router.propfind('/', (req, res) => {
  res.send('PROPFIND request received')
})

router.all('/', (req, res) => {
  res.send('Request caught')
})

module.exports = router
