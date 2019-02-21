# bedrock-vue-address-form

A Vue.js address form component for Bedrock Web apps

### View the component in the test harness
```
npm i
cd test/
npm i
npm start
```

### Re-Build countries.js

1. Create an account on http://www.geonames.org/
2. Navigate to the `bin/` directory
3. Update `username` in `config.json` with your geoname's username
4. Use the created JSON file to update `countries.js`
```
cd bin/
node index.js
```

### Additional Information

Geonames Country Data
* Source: http://www.geonames.org/
* License: https://creativecommons.org/licenses/by/4.0/
