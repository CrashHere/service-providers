const fs = require('fs')
const geocoder = require('geocoder')
const path = require('path')

const providers = require('./data/service-providers.json')

const promises = providers.map(provider => {
  return new Promise((resolve, reject) => {
    geocoder.geocode(provider.address, (error, data) => {
      if (data) {
        const result = data.results[0]
        if (result) {
          const geometry = result.geometry
          const location = geometry.location
          const geocoded = Object.assign(
            {},
            provider,
            {
              _geoloc: location
            }
          )
          resolve(geocoded)
        }
      }
      resolve(provider)
    })
  })
})

Promise.all(promises)
  .then(data => {
    console.log(data.length)
    const json = JSON.stringify(data, null, 4)
    console.log('Writing geocoded results...')
    fs.writeFileSync(
      path.resolve('src/data/service-providers-geocoded.json'),
      json
    )
  })
  .catch(error => {
    console.log(error)
  })
