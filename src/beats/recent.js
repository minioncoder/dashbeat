'use strict';

import Chance from 'chance';

import { chartbeatApi } from '../helpers/constants';
import { getRandomSite, isSectionPage, getDistance } from '../helpers/parse';
import Beat from './beat';

export default class Recent extends Beat {
  constructor(app, name='recent', apiUrl='/live/recent/v3/?limit=50', schema) {
    super(app, name, apiUrl, schema);
  }

  // Need to override this b/c we only request 1 site for the geopoint dashboard
  compileUrls(apiKey, sites) {
    var site = getRandomSite(sites);
    return [`${chartbeatApi}${this.apiUrl}&apikey=${apiKey}&host=${site}`];
  }

  parseResponses(responses) {
    var lastLatLng = {
      lat: -Infinity,
      lng: -Infinity
    }
    var chance = new Chance();

    // Only one response expected
    if (responses.length > 1) {
      console.log('More than one response returned');
    }

    // Iterate over people reading
    var geoData = {};
    var people = responses[0][1];
    var numPeople = people.length;
    for (var i = 0; i < numPeople; i++) {
      // Get random person
      var randomIndex = chance.integer({
        min: 0,
        max: numPeople - 1
      });
      var person = people[randomIndex];
      // console.log(util.inspect(person));

      // Check random person
      if (isSectionPage(person.path) ||
          !(person.title.trim())) {
        continue;
      }
      geoData = {
          lat: person.lat,
          lng: person.lng,
          platform: person.platform,
          domain: person.domain,
          host: person.host,
          path: person.path,
          title: person.title,
          user_agent: person.user_agent,
          country: person.country,
      }

      var latLngDelta = getDistance(
        lastLatLng.lat,
        lastLatLng.lng,
        person.lat,
        person.lng
      )
      if (latLngDelta > 5.0) break;
    }

    lastLatLng.lat = geoData.lat;
    lastLatLng.lng = geoData.lng;

    return geoData
  }
}
