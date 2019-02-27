/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const config = require('./config.json');

const COUNTRIES = 'http://download.geonames.org/export/dump/countryInfo.txt';

function requestChildren(id, username = 'demo') {
  const base = 'http://api.geonames.org/childrenJSON';
  const request = encodeURI(`${base}?geonameId=${id}&username=${username}`);
  return fetch(request).then(r => r.json());
}

class Country {
  constructor(data) {
    this.line = data;
    this.iso = data[0],
    this.iso3 = data[1],
    this.iso_numeric = data[2],
    this.fips = data[3],
    this.name = data[4],
    this.capital = data[5],
    this.area = Number(data[6]),
    this.population = data[7],
    this.continent = data[8],
    this.tld = data[9],
    this.currency_code = data[10],
    this.currency_name = data[11],
    this.phone = data[12],
    this.postal_code_format = data[13],
    this.postal_code_regex = data[14],
    this.languages = data[15],
    this.geoname_id = data[16],
    this.neighbours = data[17],
    this.children = [];
    this.getChildren = this.getChildren.bind(this);
  }
  getChildren() {
    if(this.area >= 1000000) {
      return requestChildren(this.geoname_id, config.username)
        .then(children => {
          if(children && children.geonames) {
            this.children = children.geonames.map(gn => gn.name);
          }
          return this;
        });
    }
    return this;
  }
}

function parseCountries(text) {
  const lines = text.split('\n');
  const notCommentedOut = lines.filter(l => !l.startsWith('#'));
  const cells = notCommentedOut.map(l => l.split('\t'));
  const countries = cells.map(c => new Country(c));
  return Promise.all(countries.map(c => c.getChildren()));
}

function saveCountries(data) {
  const countries = data.map(country => {
    for(const key in country) {
      if(!config.include.includes(key)) {
        delete country[key];
      }
    }
    country.label = country.name || '';
    country.value = country.iso || '';
    delete country.name;
    delete country.iso;
    return country;
  })
    .filter(c => c.label.length)
    .sort((a, b) => a.label.localeCompare(b.label));
  const filepath = path.join(__dirname, `${config.filename}`);
  fs.writeFile(
    filepath, JSON.stringify(countries, null, 2), 'utf-8', console.error);
}

function getCountries() {
  return fetch(COUNTRIES)
    .then(r => r.text())
    .then(parseCountries)
    .then(saveCountries);
}

getCountries().then(c => console.log('countries', c));
