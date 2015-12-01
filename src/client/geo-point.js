"use strict";

import L from 'leaflet';
import io from 'socket.io-client';

import { getRandomInt } from './lib';
import Config from '../../config';

L.Icon.Default.imagePath = 'http://cdn.leafletjs.com/leaflet/v0.7.7/images';

class GeoPoint {
  constructor() {
    this.state = {
      position: [39.5, -96.196289], // center of the US
      source: '',
      recent: null
    }

    this.map = L.map('map', { zoomControl: false }).setView(this.state.position, 5);

    L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.marker = L.marker(this.state.position).addTo(this.map);
  }

  updateRecents = (recents) => {
    let numMarkets = recents.length;
    let marketIndex = 0;

    // Get a random market
    for (let i = 0; i < numMarkets; i++) {
      let index = getRandomInt(0, numMarkets - 1);
      let market = recents[index];
      if (!this.state.source || this.state.source != market.source) {
        marketIndex = index;
        break;
      }
    }

    // Get a random article
    let marketRecents = recents[marketIndex].recents;
    let recent = this.getRecentArticle(marketRecents);

    this.state = {
      position: [recent.lat, recent.lng],
      source: recents[marketIndex].source,
      recent
    };

    this.updateMap();
  }

  getRecentArticle(articles) {
    let index = 0;
    for (let i = 0; i < articles.length; i++) {
      let randomIndex = getRandomInt(0, articles.length - 1);

      let recent = articles[randomIndex];
      if (recent.title !== "") {
        index = randomIndex;
        break;
      }
    }

    return articles[index];
  }

  getPlatformImage(platform) {
    if (platform === 'desktop') {
      return '<i class="fa fa-desktop fa-3x"></i>';
    } else if (platform === 'mobile') {
      return '<i class="fa fa-mobile fa-5x"></i>'
    } else if (platform === 'tablet') {
      return '<i class="fa fa-tablet fa-5x"></i>'
    }
  }

  renderPopup = () => {
    let recent = this.state.recent;
    if (!recent) return null;

    return (
      `
      <div class='marker-popup-class'>
        <div class='marker-popup'>
          <div class='info'>
            <div class='host-image'>
              <img src='/img/hostimages/${recent.host}.png'>
            </div>
            <div class='platform'>
              ${this.getPlatformImage(recent.platform)}
            </div>
          </div>
          <div class='title'>
            <a target='_blank' href='http://${recent.url}'>${recent.title}</a>
          </div>
        </div>
      </div>
      `
    )
  }

  updateMap = () => {
    this.marker.setLatLng(this.state.position).update();
    this.map.setView([this.state.recent.lat + 3, this.state.recent.lng]);

    this.popup = L.popup().setContent(this.renderPopup());
    this.marker.bindPopup(this.popup).openPopup();
  }

}

let dashboard = new GeoPoint();
let socket = io(Config.socketUrl, { transports: ['websocket', 'xhr-polling'] });
socket.emit('get_recent');
socket.on('got_recent', (data) => {
  dashboard.updateRecents(data.snapshot.recents);
});
