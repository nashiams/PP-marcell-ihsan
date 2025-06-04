const geoip = require('geoip-lite');
const geolib = require('geolib');
const express = require('express');  


// Fixed laundry coordinates
const laundryCoords = {
  latitude: -6.1745,
  longitude: 106.8227
};

// Normalize IP and handle localhost
function getClientIp(req) {
  let ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

  // Handle IPv6-mapped IPv4 (e.g. "::ffff:192.168.0.12")
  if (ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');
  if (ip === '::1' || ip.startsWith('127.')) return null;

  return ip;
}

// Main helper to get distance in km or error string
function getDistance(req) {
  let ip = getClientIp(req);

  // Localhost: simulate Jakarta IP for testing
  if (!ip) {
    ip = '103.196.15.111'; // example IP from Jakarta
  }

  const geo = geoip.lookup(ip);
  if (!geo || !geo.ll) {
    return 'Location not found from IP';
  }

  const [lat, lon] = geo.ll;

  const distanceMeters = geolib.getDistance(
    { latitude: lat, longitude: lon },
    laundryCoords
  );

  return +(distanceMeters / 1000).toFixed(2); // round to 2 decimal places
}

module.exports = { getDistance };


