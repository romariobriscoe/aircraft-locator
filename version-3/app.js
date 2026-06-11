/* ===========================================================================
 * CIRRUS FLEET · Operational Registry — version 3
 * Plain-JS React (no JSX, no in-browser Babel). `h` = React.createElement.
 * ========================================================================= */
'use strict';

const { useState, useEffect, useRef, useMemo, useCallback } = React;
const h = React.createElement;
const Frag = React.Fragment;

/* ---------------------------------------------------------------------------
 * INLINE LUCIDE ICONS
 * Hand-picked SVG paths from lucide.dev — zero npm deps.
 * mkIcon([['path', {d}], ...]) -> component with (size, strokeWidth, className).
 * ------------------------------------------------------------------------- */
const mkIcon = (parts) => (props) => {
  props = props || {};
  const size = props.size || 16;
  return h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      width: size, height: size, viewBox: '0 0 24 24',
      fill: 'none', stroke: 'currentColor',
      strokeWidth: props.strokeWidth || 2,
      strokeLinecap: 'round', strokeLinejoin: 'round',
      className: props.className || '',
      'aria-hidden': 'true',
    },
    parts.map((p, i) => h(p[0], Object.assign({ key: i }, p[1])))
  );
};

const Upload = mkIcon([
  ['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }],
  ['polyline', { points: '17 8 12 3 7 8' }],
  ['line', { x1: '12', y1: '3', x2: '12', y2: '15' }],
]);
const Plane = mkIcon([
  ['path', { d: 'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z' }],
]);
const MapPin = mkIcon([
  ['path', { d: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z' }],
  ['circle', { cx: '12', cy: '10', r: '3' }],
]);
const Users = mkIcon([
  ['path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }],
  ['circle', { cx: '9', cy: '7', r: '4' }],
  ['path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }],
  ['path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' }],
]);
const Radio = mkIcon([
  ['path', { d: 'M4.9 19.1C1 15.2 1 8.8 4.9 4.9' }],
  ['path', { d: 'M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5' }],
  ['circle', { cx: '12', cy: '12', r: '2' }],
  ['path', { d: 'M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5' }],
  ['path', { d: 'M19.1 4.9C23 8.8 23 15.2 19.1 19.1' }],
]);
const X = mkIcon([
  ['path', { d: 'M18 6 6 18' }],
  ['path', { d: 'm6 6 12 12' }],
]);
const ChevronRight = mkIcon([['path', { d: 'm9 18 6-6-6-6' }]]);
const ChevronDown = mkIcon([['path', { d: 'm6 9 6 6 6-6' }]]);
const Sliders = mkIcon([
  ['line', { x1: '4', y1: '21', x2: '4', y2: '14' }], ['line', { x1: '4', y1: '10', x2: '4', y2: '3' }],
  ['line', { x1: '12', y1: '21', x2: '12', y2: '12' }], ['line', { x1: '12', y1: '8', x2: '12', y2: '3' }],
  ['line', { x1: '20', y1: '21', x2: '20', y2: '16' }], ['line', { x1: '20', y1: '12', x2: '20', y2: '3' }],
  ['line', { x1: '1', y1: '14', x2: '7', y2: '14' }], ['line', { x1: '9', y1: '8', x2: '15', y2: '8' }], ['line', { x1: '17', y1: '16', x2: '23', y2: '16' }],
]);
const Download = mkIcon([
  ['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }],
  ['polyline', { points: '7 10 12 15 17 10' }],
  ['line', { x1: '12', y1: '15', x2: '12', y2: '3' }],
]);
const FileText = mkIcon([
  ['path', { d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z' }],
  ['polyline', { points: '14 2 14 8 20 8' }],
  ['line', { x1: '16', y1: '13', x2: '8', y2: '13' }],
  ['line', { x1: '16', y1: '17', x2: '8', y2: '17' }],
  ['line', { x1: '10', y1: '9', x2: '8', y2: '9' }],
]);
const Compass = mkIcon([
  ['circle', { cx: '12', cy: '12', r: '10' }],
  ['polygon', { points: '16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76' }],
]);
const Radar = mkIcon([
  ['path', { d: 'M19.07 4.93A10 10 0 0 0 6.99 3.34' }],
  ['path', { d: 'M4 6h.01' }],
  ['path', { d: 'M2.29 9.62A10 10 0 1 0 21.31 8.35' }],
  ['path', { d: 'M16.24 7.76A6 6 0 1 0 8.23 16.67' }],
  ['path', { d: 'M12 18h.01' }],
  ['path', { d: 'M17.99 11.66A6 6 0 0 1 15.77 16.67' }],
  ['circle', { cx: '12', cy: '12', r: '2' }],
  ['path', { d: 'M13.41 10.59l5.66-5.66' }],
]);
const Search = mkIcon([
  ['circle', { cx: '11', cy: '11', r: '8' }],
  ['path', { d: 'm21 21-4.3-4.3' }],
]);
const Sparkles = mkIcon([
  ['path', { d: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z' }],
  ['path', { d: 'M20 3v4' }], ['path', { d: 'M22 5h-4' }], ['path', { d: 'M4 17v2' }], ['path', { d: 'M5 18H3' }],
]);
const Loader2 = mkIcon([['path', { d: 'M21 12a9 9 0 1 1-6.219-8.56' }]]);
const Bell = mkIcon([
  ['path', { d: 'M10.268 21a2 2 0 0 0 3.464 0' }],
  ['path', { d: 'M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326' }],
]);
const ExternalLink = mkIcon([
  ['path', { d: 'M15 3h6v6' }], ['path', { d: 'M10 14 21 3' }],
  ['path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' }],
]);
const Activity = mkIcon([['path', { d: 'M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2' }]]);
const Copy = mkIcon([
  ['rect', { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2' }],
  ['path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' }],
]);
const CheckCircle2 = mkIcon([
  ['path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }],
  ['polyline', { points: '22 4 12 14.01 9 11.01' }],
]);
const AlertCircle = mkIcon([
  ['circle', { cx: '12', cy: '12', r: '10' }],
  ['line', { x1: '12', y1: '8', x2: '12', y2: '12' }],
  ['line', { x1: '12', y1: '16', x2: '12.01', y2: '16' }],
]);
const Eye = mkIcon([
  ['path', { d: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z' }],
  ['circle', { cx: '12', cy: '12', r: '3' }],
]);
const EyeOff = mkIcon([
  ['path', { d: 'M9.88 9.88a3 3 0 1 0 4.24 4.24' }],
  ['path', { d: 'M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68' }],
  ['path', { d: 'M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61' }],
  ['line', { x1: '2', y1: '2', x2: '22', y2: '22' }],
]);
const Layers = mkIcon([
  ['path', { d: 'm12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z' }],
  ['path', { d: 'm22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65' }],
  ['path', { d: 'm22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65' }],
]);
const Navigation = mkIcon([['polygon', { points: '3 11 22 2 13 21 11 13 3 11' }]]);
const Menu = mkIcon([
  ['line', { x1: '4', y1: '6', x2: '20', y2: '6' }],
  ['line', { x1: '4', y1: '12', x2: '20', y2: '12' }],
  ['line', { x1: '4', y1: '18', x2: '20', y2: '18' }],
]);
const ShieldCheck = mkIcon([
  ['path', { d: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z' }],
  ['path', { d: 'm9 12 2 2 4-4' }],
]);

/* ---------------------------------------------------------------------------
 * FEATURED BASES + FBO DIRECTORY (curated)
 * Airport codes are resolved against the GLOBAL public airport directory
 * (see fetchAirportsDataset below — ~28k airports worldwide). This curated
 * list serves three extra purposes the global dataset can't:
 *   1. FBO names (no public/free worldwide FBO dataset exists)
 *   2. "Foundational airport" ghost markers on the map
 *   3. Instant, offline resolution for the most common Cirrus bases
 * ------------------------------------------------------------------------- */
const AIRPORT_DB = [
  { iata: 'PDK', icao: 'KPDK', name: 'DeKalb-Peachtree Airport',         city: 'Atlanta, GA',          fbo: 'Atlantic Aviation',         lat: 33.8756, lng: -84.3019 },
  { iata: 'TRI', icao: 'KTRI', name: 'Tri-Cities Airport',                city: 'Bristol, TN',          fbo: 'Tri-City Aviation',         lat: 36.4752, lng: -82.4074 },
  { iata: 'TYS', icao: 'KTYS', name: 'McGhee Tyson Airport',              city: 'Knoxville, TN',        fbo: 'TAC Air / Signature',       lat: 35.8108, lng: -83.9940 },
  { iata: 'CHA', icao: 'KCHA', name: 'Chattanooga Metropolitan Airport',  city: 'Chattanooga, TN',      fbo: 'Wilson Air Center',         lat: 35.0353, lng: -85.2038 },
  { iata: 'BNA', icao: 'KBNA', name: 'Nashville International',           city: 'Nashville, TN',        fbo: 'Signature Flight Support',  lat: 36.1245, lng: -86.6782 },
  { iata: 'MQY', icao: 'KMQY', name: 'Smyrna Airport',                    city: 'Smyrna, TN',           fbo: 'Corporate Flight Mgmt',     lat: 36.0090, lng: -86.5202 },
  { iata: 'FXE', icao: 'KFXE', name: 'Fort Lauderdale Executive',         city: 'Fort Lauderdale, FL',  fbo: 'Banyan Air Service',        lat: 26.1973, lng: -80.1707 },
  { iata: 'ORL', icao: 'KORL', name: 'Orlando Executive',                 city: 'Orlando, FL',          fbo: 'Atlantic Aviation',         lat: 28.5455, lng: -81.3329 },
  { iata: 'SFB', icao: 'KSFB', name: 'Orlando Sanford International',     city: 'Sanford, FL',          fbo: 'Million Air',               lat: 28.7775, lng: -81.2375 },
  { iata: 'OPF', icao: 'KOPF', name: 'Miami-Opa Locka Executive',         city: 'Opa-locka, FL',        fbo: 'Signature',                 lat: 25.9070, lng: -80.2784 },
  { iata: 'BCT', icao: 'KBCT', name: 'Boca Raton Airport',                city: 'Boca Raton, FL',       fbo: 'Atlantic Aviation',         lat: 26.3784, lng: -80.1077 },
  { iata: 'DAB', icao: 'KDAB', name: 'Daytona Beach International',       city: 'Daytona Beach, FL',    fbo: 'Sheltair',                  lat: 29.1799, lng: -81.0581 },
  { iata: 'CLT', icao: 'KCLT', name: 'Charlotte Douglas',                 city: 'Charlotte, NC',        fbo: 'Wilson Air Center',         lat: 35.2140, lng: -80.9431 },
  { iata: 'TKI', icao: 'KTKI', name: 'McKinney National Airport',         city: 'McKinney, TX',         fbo: 'McKinney Air Center',       lat: 33.1779, lng: -96.5905 },
  { iata: 'ADS', icao: 'KADS', name: 'Addison Airport',                   city: 'Addison, TX',          fbo: 'Million Air',               lat: 32.9686, lng: -96.8364 },
  { iata: 'DAL', icao: 'KDAL', name: 'Dallas Love Field',                 city: 'Dallas, TX',           fbo: 'Signature Flight Support',  lat: 32.8471, lng: -96.8517 },
  { iata: 'FTW', icao: 'KFTW', name: 'Fort Worth Meacham International',  city: 'Fort Worth, TX',       fbo: 'American Aero',             lat: 32.8198, lng: -97.3624 },
  { iata: 'HOU', icao: 'KHOU', name: 'William P. Hobby Airport',          city: 'Houston, TX',          fbo: 'Atlantic Aviation',         lat: 29.6454, lng: -95.2789 },
  { iata: 'SGR', icao: 'KSGR', name: 'Sugar Land Regional',               city: 'Sugar Land, TX',       fbo: 'Global Select',             lat: 29.6224, lng: -95.6566 },
  { iata: 'AUS', icao: 'KAUS', name: 'Austin-Bergstrom',                  city: 'Austin, TX',           fbo: 'Atlantic Aviation',         lat: 30.1945, lng: -97.6699 },
  { iata: 'SDL', icao: 'KSDL', name: 'Scottsdale Airport',                city: 'Scottsdale, AZ',       fbo: 'Signature Flight Support',  lat: 33.6229, lng: -111.9106 },
  { iata: 'DVT', icao: 'KDVT', name: 'Phoenix Deer Valley',               city: 'Phoenix, AZ',          fbo: 'Atlantic Aviation',         lat: 33.6883, lng: -112.0826 },
  { iata: 'APA', icao: 'KAPA', name: 'Centennial Airport',                city: 'Denver, CO',           fbo: 'Denver jetCenter',          lat: 39.5701, lng: -104.8492 },
  { iata: 'BJC', icao: 'KBJC', name: 'Rocky Mountain Metropolitan',       city: 'Broomfield, CO',       fbo: 'Signature',                 lat: 39.9088, lng: -105.1172 },
  { iata: 'BIL', icao: 'KBIL', name: 'Billings Logan International',      city: 'Billings, MT',         fbo: 'Edwards Jet Center',        lat: 45.8077, lng: -108.5429 },
  { iata: 'SLC', icao: 'KSLC', name: 'Salt Lake City International',      city: 'Salt Lake City, UT',   fbo: 'TAC Air',                   lat: 40.7884, lng: -111.9778 },
  { iata: 'BFI', icao: 'KBFI', name: 'Boeing Field / King County Intl',   city: 'Seattle, WA',          fbo: 'Modern Aviation',           lat: 47.5300, lng: -122.3019 },
  { iata: 'PAE', icao: 'KPAE', name: 'Paine Field',                       city: 'Everett, WA',          fbo: 'Castle & Cooke',            lat: 47.9063, lng: -122.2815 },
  { iata: 'HIO', icao: 'KHIO', name: 'Hillsboro Airport',                 city: 'Hillsboro, OR',        fbo: 'Atlantic Aviation',         lat: 45.5404, lng: -122.9498 },
  { iata: 'VNY', icao: 'KVNY', name: 'Van Nuys Airport',                  city: 'Van Nuys, CA',         fbo: 'Signature',                 lat: 34.2098, lng: -118.4898 },
  { iata: 'SMO', icao: 'KSMO', name: 'Santa Monica Airport',              city: 'Santa Monica, CA',     fbo: 'Atlantic Aviation',         lat: 34.0158, lng: -118.4513 },
  { iata: 'SNA', icao: 'KSNA', name: 'John Wayne Airport',                city: 'Santa Ana, CA',        fbo: 'ACI Jet',                   lat: 33.6757, lng: -117.8682 },
  { iata: 'CRQ', icao: 'KCRQ', name: 'McClellan-Palomar Airport',         city: 'Carlsbad, CA',         fbo: 'Western Flight Services',   lat: 33.1283, lng: -117.2799 },
  { iata: 'PAO', icao: 'KPAO', name: 'Palo Alto Airport',                 city: 'Palo Alto, CA',        fbo: 'Surf Air',                  lat: 37.4611, lng: -122.1150 },
  { iata: 'CCR', icao: 'KCCR', name: 'Buchanan Field',                    city: 'Concord, CA',          fbo: 'Sterling Aviation',         lat: 37.9897, lng: -122.0568 },
  { iata: 'OAK', icao: 'KOAK', name: 'Oakland International',             city: 'Oakland, CA',          fbo: 'Signature',                 lat: 37.7213, lng: -122.2207 },
  { iata: 'DLH', icao: 'KDLH', name: 'Duluth International',              city: 'Duluth, MN',           fbo: 'Monaco Air Duluth · Cirrus HQ', lat: 46.8421, lng: -92.1936 },
  { iata: 'FCM', icao: 'KFCM', name: 'Flying Cloud Airport',              city: 'Eden Prairie, MN',     fbo: 'Signature',                 lat: 44.8272, lng: -93.4571 },
  { iata: 'STP', icao: 'KSTP', name: 'St Paul Downtown',                  city: 'St Paul, MN',          fbo: 'Holman Field',              lat: 44.9345, lng: -93.0599 },
  { iata: 'MKE', icao: 'KMKE', name: 'Milwaukee Mitchell International',  city: 'Milwaukee, WI',        fbo: 'Signature',                 lat: 42.9472, lng: -87.8966 },
  { iata: 'MSN', icao: 'KMSN', name: 'Dane County Regional',              city: 'Madison, WI',          fbo: 'Wisconsin Aviation',        lat: 43.1399, lng: -89.3375 },
  { iata: 'PWK', icao: 'KPWK', name: 'Chicago Executive',                 city: 'Wheeling, IL',         fbo: 'Atlantic Aviation',         lat: 42.1142, lng: -87.9015 },
  { iata: 'DPA', icao: 'KDPA', name: 'DuPage Airport',                    city: 'West Chicago, IL',     fbo: 'DuPage Flight Center',      lat: 41.9078, lng: -88.2486 },
  { iata: 'PTK', icao: 'KPTK', name: 'Oakland County International',      city: 'Pontiac, MI',          fbo: 'Pentastar',                 lat: 42.6655, lng: -83.4200 },
  { iata: 'GRR', icao: 'KGRR', name: 'Gerald R. Ford International',      city: 'Grand Rapids, MI',     fbo: 'Northern Air',              lat: 42.8808, lng: -85.5228 },
  { iata: 'LUK', icao: 'KLUK', name: 'Cincinnati Municipal-Lunken',       city: 'Cincinnati, OH',       fbo: 'Million Air',               lat: 39.1031, lng: -84.4186 },
  { iata: 'CMH', icao: 'KCMH', name: 'John Glenn Columbus Intl',          city: 'Columbus, OH',         fbo: 'NetJets',                   lat: 39.9980, lng: -82.8919 },
  { iata: 'IND', icao: 'KIND', name: 'Indianapolis International',        city: 'Indianapolis, IN',     fbo: 'Signature',                 lat: 39.7173, lng: -86.2944 },
  { iata: 'STL', icao: 'KSTL', name: 'St Louis Lambert International',    city: 'St Louis, MO',         fbo: 'Signature',                 lat: 38.7487, lng: -90.3700 },
  { iata: 'TEB', icao: 'KTEB', name: 'Teterboro Airport',                 city: 'Teterboro, NJ',        fbo: 'Meridian / Signature',      lat: 40.8501, lng: -74.0608 },
  { iata: 'MMU', icao: 'KMMU', name: 'Morristown Municipal',              city: 'Morristown, NJ',       fbo: 'Signature',                 lat: 40.7995, lng: -74.4148 },
  { iata: 'HPN', icao: 'KHPN', name: 'Westchester County',                city: 'White Plains, NY',     fbo: 'Million Air',               lat: 41.0670, lng: -73.7076 },
  { iata: 'FRG', icao: 'KFRG', name: 'Republic Airport',                  city: 'Farmingdale, NY',      fbo: 'Atlantic Aviation',         lat: 40.7288, lng: -73.4134 },
  { iata: 'BED', icao: 'KBED', name: 'Laurence G. Hanscom Field',         city: 'Bedford, MA',          fbo: 'Signature',                 lat: 42.4699, lng: -71.2890 },
  { iata: 'OWD', icao: 'KOWD', name: 'Norwood Memorial',                  city: 'Norwood, MA',          fbo: 'FlightLevel Aviation',      lat: 42.1905, lng: -71.1730 },
  { iata: 'JYO', icao: 'KJYO', name: 'Leesburg Executive',                city: 'Leesburg, VA',         fbo: 'Aviation Adventures',       lat: 39.0778, lng: -77.5575 },
  { iata: 'FDK', icao: 'KFDK', name: 'Frederick Municipal',               city: 'Frederick, MD',        fbo: 'Frederick Aviation',        lat: 39.4176, lng: -77.3742 },
  { iata: 'BQH', icao: 'EGKB', name: 'London Biggin Hill',                city: 'London, UK',           fbo: 'Signature',                 lat: 51.3308, lng: 0.0325 },
  { iata: 'GVA', icao: 'LSGG', name: 'Geneva Airport',                    city: 'Geneva, Switzerland',  fbo: 'Jet Aviation',              lat: 46.2381, lng: 6.1090 },
  { iata: 'DXB', icao: 'OMDB', name: 'Dubai International',               city: 'Dubai, UAE',           fbo: 'ExecuJet',                  lat: 25.2532, lng: 55.3657 },
  { iata: 'YYZ', icao: 'CYYZ', name: 'Toronto Pearson',                   city: 'Toronto, ON',          fbo: 'Skyservice',                lat: 43.6777, lng: -79.6248 },
  { iata: 'YVR', icao: 'CYVR', name: 'Vancouver International',           city: 'Vancouver, BC',        fbo: 'Million Air',               lat: 49.1939, lng: -123.1844 },

  // ── Additional US general aviation fields ─────────────────────────────
  { iata: 'AHN', icao: 'KAHN', name: 'Athens-Ben Epps Airport',           city: 'Athens, GA',           fbo: 'Epps Aviation',             lat: 33.9486, lng: -83.3263 },
  { iata: 'BDU', icao: 'KBDU', name: 'Boulder Municipal Airport',         city: 'Boulder, CO',          fbo: 'Journeys Aviation',         lat: 40.0394, lng: -105.2258 },
  { iata: 'ERV', icao: 'KERV', name: 'Kerrville Municipal',               city: 'Kerrville, TX',        fbo: 'Mooney Service Center',     lat: 29.9767, lng: -99.0858 },
  { iata: 'FTY', icao: 'KFTY', name: 'Fulton County / Brown Field',       city: 'Atlanta, GA',          fbo: 'Atlantic Aviation',         lat: 33.7793, lng: -84.5214 },
  { iata: 'GCY', icao: 'KGCY', name: 'Greeneville-Greene County Muni',    city: 'Greeneville, TN',      fbo: 'Greeneville Aero',          lat: 36.1929, lng: -82.8154 },
  { iata: 'GKT', icao: 'KGKT', name: 'Gatlinburg-Pigeon Forge Airport',   city: 'Sevierville, TN',      fbo: 'TAC Air',                   lat: 35.8587, lng: -83.5286 },
  { iata: 'JWN', icao: 'KJWN', name: 'John C. Tune Airport',              city: 'Nashville, TN',        fbo: 'Atlantic Aviation',         lat: 36.1825, lng: -86.8888 },
  { iata: 'MOR', icao: 'KMOR', name: 'Moore-Murrell Airport',             city: 'Morristown, TN',       fbo: 'Morristown Aviation',       lat: 36.1907, lng: -83.3754 },
  { iata: 'RNT', icao: 'KRNT', name: 'Renton Municipal Airport',          city: 'Renton, WA',           fbo: 'Pro-Flight Aviation',       lat: 47.4928, lng: -122.2169 },
  { iata: 'VRB', icao: 'KVRB', name: 'Vero Beach Regional',               city: 'Vero Beach, FL',       fbo: 'Sun Aviation',              lat: 27.6556, lng: -80.4179 },

  // ── Additional international ──────────────────────────────────────────
  { iata: 'CGH', icao: 'SBSP', name: 'São Paulo Congonhas',               city: 'São Paulo, Brazil',    fbo: 'Líder Aviação',             lat: -23.6261, lng: -46.6564 },
  { iata: 'MGL', icao: 'EDLN', name: 'Mönchengladbach Airport',           city: 'Mönchengladbach, DE',  fbo: 'MGL Aviation',              lat: 51.2303, lng: 6.5044 },
  { iata: 'OXF', icao: 'EGTK', name: 'London Oxford Airport',             city: 'Oxford, UK',           fbo: 'Oxford Air',                lat: 51.8369, lng: -1.3200 },
  { iata: 'SYD', icao: 'YSSY', name: 'Sydney Kingsford Smith Intl',       city: 'Sydney, Australia',    fbo: 'Sydney Jet Base',           lat: -33.9461, lng: 151.1772 },
  { iata: 'TNF', icao: 'LFPN', name: 'Toussus-le-Noble Airport',          city: 'Toussus-le-Noble, FR', fbo: 'Advanced Air Support',      lat: 48.7517, lng: 2.1061 },
  { iata: 'YYC', icao: 'CYYC', name: 'Calgary International',             city: 'Calgary, Canada',      fbo: 'Skyservice',                lat: 51.1215, lng: -114.0076 },
  { iata: 'ZRH', icao: 'LSZH', name: 'Zurich Airport',                    city: 'Zurich, Switzerland',  fbo: 'Jet Aviation',              lat: 47.4647, lng: 8.5492 },
];

const AIRPORT_LOOKUP = (() => {
  const map = new Map();
  for (const a of AIRPORT_DB) {
    map.set(a.iata.toUpperCase(), a);
    map.set(a.icao.toUpperCase(), a);
  }
  return map;
})();

/* ---------------------------------------------------------------------------
 * SHARED CORS PROXY CHAIN
 * One list used by ADS-B, METAR, and the airport-data fallback (the v2 file
 * duplicated this). Index 0 is always a direct call.
 * ------------------------------------------------------------------------- */
const CORS_STRATEGIES = [
  (u) => u,
  (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
  (u) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(u)}`,
];

/* ---------------------------------------------------------------------------
 * GLOBAL AIRPORT DIRECTORY (public datasets — all US + worldwide airports)
 * Primary:  github.com/mwgg/Airports — ~28k airports keyed by ICAO (JSON)
 * Backup:   OurAirports (ourairports.com, public domain) — ~80k airports
 *           incl. small US GA fields, parsed from CSV with PapaParse.
 * Fetched lazily the first time an upload contains a code that isn't in the
 * featured-bases list. Resolved entries are persisted with the registry, so
 * the big download usually happens once per browser.
 * Neither dataset includes FBOs — no public worldwide FBO list exists, so
 * FBO names come from the upload's facility_name or the curated directory.
 * ------------------------------------------------------------------------- */
const AIRPORTS_JSON_URL = 'https://raw.githubusercontent.com/mwgg/Airports/master/airports.json';
const OURAIRPORTS_CSV_URL = 'https://davidmegginson.github.io/ourairports-data/airports.csv';

const parseMwggAirports = (data) => {
  const byCode = new Map();
  for (const key of Object.keys(data)) {
    const a = data[key];
    if (!a || typeof a.lat !== 'number' || typeof a.lon !== 'number') continue;
    const icao = String(a.icao || key || '').toUpperCase();
    const iata = String(a.iata || '').toUpperCase();
    const entry = {
      iata: iata || icao,            // display/key code
      icao: icao,
      name: a.name || icao,
      city: [a.city, a.country].filter(Boolean).join(', '),
      fbo: '—',
      lat: a.lat,
      lng: a.lon,
    };
    if (icao && !byCode.has(icao)) byCode.set(icao, entry);
    if (iata && !byCode.has(iata)) byCode.set(iata, entry);
  }
  return byCode;
};

const parseOurAirports = (csvText) => {
  const byCode = new Map();
  const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
  for (const row of parsed.data) {
    const lat = parseFloat(row.latitude_deg);
    const lng = parseFloat(row.longitude_deg);
    if (!isFinite(lat) || !isFinite(lng)) continue;
    if (row.type === 'closed') continue;
    const ident = String(row.ident || '').toUpperCase();       // e.g. KTKI, 7TX0
    const gps = String(row.gps_code || '').toUpperCase();
    const iata = String(row.iata_code || '').toUpperCase();
    const local = String(row.local_code || '').toUpperCase();
    const entry = {
      iata: iata || ident,
      icao: gps || ident,
      name: row.name || ident,
      city: [row.municipality, row.iso_country].filter(Boolean).join(', '),
      fbo: '—',
      lat, lng,
    };
    for (const code of [ident, gps, iata, local]) {
      if (code && !byCode.has(code)) byCode.set(code, entry);
    }
  }
  return byCode;
};

let airportsDataPromise = null;
const fetchAirportsDataset = () => {
  if (!airportsDataPromise) {
    airportsDataPromise = (async () => {
      // Primary: compact worldwide JSON
      for (const wrap of CORS_STRATEGIES) {
        try {
          const r = await fetch(wrap(AIRPORTS_JSON_URL));
          if (!r.ok) continue;
          const data = await r.json();
          if (data && typeof data === 'object') return parseMwggAirports(data);
        } catch (e) { /* try next strategy */ }
      }
      // Backup: OurAirports CSV (bigger, includes tiny US GA fields)
      for (const wrap of CORS_STRATEGIES) {
        try {
          const r = await fetch(wrap(OURAIRPORTS_CSV_URL));
          if (!r.ok) continue;
          const text = await r.text();
          if (text && text.indexOf('ident') >= 0) return parseOurAirports(text);
        } catch (e) { /* try next strategy */ }
      }
      throw new Error('airport directory unavailable');
    })();
    airportsDataPromise.catch(() => { airportsDataPromise = null; }); // allow retry later
  }
  return airportsDataPromise;
};

/* ---------------------------------------------------------------------------
 * LOCAL PERSISTENCE
 * Registry + view prefs survive a refresh. Everything stays in this browser —
 * nothing is uploaded anywhere (see the privacy note in the upload card).
 * ------------------------------------------------------------------------- */
const STORAGE_KEY = 'cirrus-fleet-registry-v3';
const loadSavedState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
};
const saveSavedState = (state) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* quota/private mode */ }
};
const clearSavedState = () => {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
};

const COLUMN_ALIASES = {
  owner_name: ['owner_name', 'owner name', 'name', 'pilot', 'pilot name', 'registered owner'],
  home_airport: ['home_airport', 'home airport', 'home base', 'home base code', 'icao', 'iata', 'airport code', 'airport'],
  aircraft_generation: ['aircraft_generation', 'model generation', 'generation', 'gen', 'aircraft gen'],
  aircraft_model: ['aircraft_model', 'aircraft model', 'model', 'type', 'aircraft type'],
  facility_name: ['facility_name', 'facility name', 'fbo', 'fbo name', 'terminal', 'airport / fbo facility'],
  facility_type: ['facility_type', 'facility type', 'base type'],
  tail_number: ['tail_number', 'tail number', 'tail #', 'tail', 'n_number', 'n number', 'n#', 'registration', 'reg', 'aircraft_id', 'icao24'],
  mailing_address: ['mailing_address', 'mailing address', 'address', 'owner address', 'street address', 'postal address'],
  phone_number: ['phone_number', 'phone number', 'phone', 'contact', 'contact number', 'mobile', 'telephone'],
};

const normalizeRow = (raw) => {
  const out = {};
  const keys = Object.keys(raw);
  const lower = Object.fromEntries(keys.map((k) => [k.toLowerCase().trim(), k]));
  for (const target of Object.keys(COLUMN_ALIASES)) {
    for (const alias of COLUMN_ALIASES[target]) {
      if (lower[alias] !== undefined) {
        out[target] = raw[lower[alias]];
        break;
      }
    }
  }
  return out;
};

const isRowEmpty = (raw) => Object.values(raw).every((v) => String(v == null ? '' : v).trim() === '');

const cleanModel = (m) => {
  if (!m) return '';
  return String(m).replace(/^cirrus\s+/i, '').replace(/^vision\s+/i, '').trim().toUpperCase();
};
const cleanGen = (g) => {
  if (!g) return '';
  return String(g).trim().toUpperCase();
};
const normalizeTail = (s) => (s || '').toString().replace(/[\s\-_]/g, '').toUpperCase().trim();

const SAMPLE_CSV = `owner_name,tail_number,aircraft_model,aircraft_generation,mailing_address,phone_number,home_airport,facility_name,facility_type
Amelia Chen,N742AC,Cirrus SR22T,G7,"1091 Skyline Dr, Plano, TX 75024, USA",+1 (214) 555-0142,KTKI,Aero Centers TKI,FBO
Marcus Holloway,N518MH,Cirrus SR22,G6,"2200 N Scottsdale Rd, Scottsdale, AZ 85257, USA",+1 (480) 555-0118,KSDL,Jet Aviation,FBO
Priya Vasquez,N50PV,Cirrus Vision SF50,G2 Jet,"4444 Citrus Way, Orlando, FL 32827, USA",+1 (407) 555-0177,KORL,Atlantic Aviation,FBO
Dmitri Krause,G-SHUQ,Cirrus SR22T,G5,"7 Aviation Park, Oxford OX5 1QR, United Kingdom",+44 1865 555 042,OXF,London Oxford Airport,FBO
Sofia Albright,HB-KIP,Cirrus SR20,G3,"Flughafenstrasse 12, 8302 Kloten, Switzerland",+41 44 555 2210,ZRH,Jet Aviation Zurich,FBO
Theodore Wynn,N7TW,Cirrus Vision SF50,G2 Jet,"100 Airport Rd, Teterboro, NJ 07608, USA",+1 (201) 555-0193,KTEB,Signature Flight Support,FBO
Naomi Forrester,VH-CRR,Cirrus SR22,G6,"42 Hangar Lane, Bankstown NSW 2200, Australia",+61 2 5550 8124,SYD,Sydney Aviation Services,FBO
Lucien Bartholomew,C-FCIR,Cirrus SR22T,G5,"880 Skyway Dr, Calgary AB T2E 6V1, Canada",+1 (403) 555-0241,YYC,Calgary Executive Jets,FBO
`;

const MODEL_KEYS = ['SR20', 'SR22', 'SR22T', 'SF50'];
const WX_COLORS = { VFR: '#2e9e4f', MVFR: '#1565c0', IFR: '#d32f2f', LIFR: '#8e24aa' };
const REGION_KEYS = ['West', 'Central', 'Southeast', 'Northeast', 'International'];
const regionOf = (lat, lng) => {
  if (typeof lat !== 'number' || typeof lng !== 'number') return 'International';
  // Outside the contiguous US box → International
  if (lat < 24 || lat > 50 || lng < -125 || lng > -66.5) return 'International';
  if (lng <= -110) return 'West';
  if (lng <= -90) return 'Central';
  return lat < 37 ? 'Southeast' : 'Northeast';
};
const canonType = (t) => (t === 'S22T' ? 'SR22T' : t); // ADS-B type code → model key

/* ---------------------------------------------------------------------------
 * BASE-MARKER CLUSTERING (dependency-free)
 * At low zoom, nearby active bases merge into one bubble showing the summed
 * owner count plus a small badge with the number of bases. Clicking a cluster
 * zooms in. Fully separates at zoom >= 7. The selected base never clusters.
 * ------------------------------------------------------------------------- */
const CLUSTER_CELL_BY_ZOOM = { 0: 12, 1: 10, 2: 8, 3: 5, 4: 2.8, 5: 1.4, 6: 0.7 };
const clusterAirports = (airports, zoom, excludeIata) => {
  if (zoom >= 7) return airports.map((a) => ({ kind: 'single', airport: a }));
  const cell = CLUSTER_CELL_BY_ZOOM[Math.max(0, Math.min(6, Math.round(zoom)))] || 0.7;
  const buckets = new Map();
  const out = [];
  for (const a of airports) {
    if (excludeIata && a.iata === excludeIata) { out.push({ kind: 'single', airport: a }); continue; }
    const key = Math.round(a.lat / cell) + ':' + Math.round(a.lng / cell);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(a);
  }
  for (const group of buckets.values()) {
    if (group.length === 1) {
      out.push({ kind: 'single', airport: group[0] });
    } else {
      let lat = 0, lng = 0, ownerCount = 0;
      for (const a of group) { lat += a.lat; lng += a.lng; ownerCount += a.owners.length; }
      out.push({
        kind: 'cluster',
        airports: group,
        lat: lat / group.length,
        lng: lng / group.length,
        ownerCount,
      });
    }
  }
  return out;
};

const formatAge = (ms) => {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return s + 's ago';
  const m = Math.floor(s / 60);
  return m + 'm ' + (s % 60) + 's ago';
};

const AC_ICON = {
  sr:   { src: 'data:image/png;base64,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', w: 42, h: 20 },
  sf50: { src: 'data:image/png;base64,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', w: 42, h: 18 },
};
/* ---------------------------------------------------------------------------
 * MAIN COMPONENT
 * ------------------------------------------------------------------------- */
function CirrusFleetDashboard() {
  // Saved session (registry, prefs, resolved airports) — loaded once
  const savedRef = useRef(undefined);
  if (savedRef.current === undefined) savedRef.current = loadSavedState();
  const saved = savedRef.current || {};

  const [owners, setOwners] = useState(Array.isArray(saved.owners) ? saved.owners : []);
  const [extraAirports, setExtraAirports] = useState(Array.isArray(saved.extraAirports) ? saved.extraAirports : []);
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [selectedOwnerIdx, setSelectedOwnerIdx] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(saved.owners && saved.owners.length ? 'success' : 'idle');
  const [uploadError, setUploadError] = useState('');
  const [uploadInfo, setUploadInfo] = useState(saved.uploadInfo || null);
  const [uploadReport, setUploadReport] = useState(null); // { skipped, unmatched: [codes] }
  const [isDragging, setIsDragging] = useState(false);
  const [leafletReady, setLeafletReady] = useState(typeof window !== 'undefined' && !!window.L);
  const [showEmptyBases, setShowEmptyBases] = useState(saved.showEmptyBases !== undefined ? !!saved.showEmptyBases : true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer
  const [lookupStatus, setLookupStatus] = useState('idle'); // airport fallback: 'idle'|'loading'|'done'|'error'

  // ── Live ADS-B traffic state ────────────────────────────────────
  const [airborneAircraft, setAirborneAircraft] = useState([]);
  const [showAirborne, setShowAirborne] = useState(saved.showAirborne !== undefined ? !!saved.showAirborne : true);
  const [airborneStatus, setAirborneStatus] = useState('idle'); // 'idle' | 'loading' | 'live' | 'error' | 'demo'
  const [airborneLastUpdate, setAirborneLastUpdate] = useState(null);
  const [dataAgeTick, setDataAgeTick] = useState(0); // re-render driver for "updated Xs ago"
  const [demoMode, setDemoMode] = useState(false); // simulate traffic when the live feed is blocked (e.g. CSP sandbox)
  const [filters, setFilters] = useState(
    Object.assign({ models: [], gens: [], regions: [], flyingOnly: false }, saved.filters || {})
  );
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [weatherOn, setWeatherOn] = useState(!!saved.weatherOn); // METAR flight-category layer
  const [metarByAirport, setMetarByAirport] = useState({}); // iata -> { cat, raw, wind, vis, temp }
  const [metarStatus, setMetarStatus] = useState('idle'); // 'idle'|'loading'|'live'|'error'|'demo'
  const [toast, setToast] = useState(null);
  const [watched, setWatched] = useState(Array.isArray(saved.watched) ? saved.watched : []); // normalized tails watched for takeoff
  const [activity, setActivity] = useState([]); // session airborne-count samples for the sparkline
  const [flightsToday, setFlightsToday] = useState(0); // distinct tails seen airborne this session
  const [mapZoom, setMapZoom] = useState(4); // drives base-marker clustering
  const prevAirborneWatchedRef = useRef(new Set());
  const seenTailsRef = useRef(new Set());

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef(new Map());
  const aircraftMarkersRef = useRef(new Map()); // hex -> Leaflet marker for live aircraft
  const trailLinesRef = useRef([]); // Leaflet polylines for owner trails
  const adsbStrategyRef = useRef(null); // index of the fetch strategy that works (direct or a proxy)
  const metarDemoRef = useRef({}); // stable synthesized METAR cats for demo fallback
  const trailHistoryRef = useRef(new Map()); // hex -> [[lat,lng], ...] accumulated flight path
  const aircraftTrailsRef = useRef(new Map()); // hex -> Leaflet polyline for the flight path
  const dragCounter = useRef(0);

  // ── Combined airport directory: curated DB + runtime-resolved extras ──
  const airportDb = useMemo(() => {
    if (!extraAirports.length) return AIRPORT_DB;
    const seen = new Set(AIRPORT_DB.map((a) => a.iata));
    return AIRPORT_DB.concat(extraAirports.filter((a) => a && a.iata && !seen.has(a.iata)));
  }, [extraAirports]);

  const airportLookup = useMemo(() => {
    if (!extraAirports.length) return AIRPORT_LOOKUP;
    const map = new Map(AIRPORT_LOOKUP);
    for (const a of extraAirports) {
      if (!a) continue;
      if (a.iata && !map.has(a.iata.toUpperCase())) map.set(a.iata.toUpperCase(), a);
      if (a.icao && !map.has(a.icao.toUpperCase())) map.set(a.icao.toUpperCase(), a);
    }
    return map;
  }, [extraAirports]);
  const airportLookupRef = useRef(airportLookup);
  useEffect(() => { airportLookupRef.current = airportLookup; }, [airportLookup]);

  // ── PERSISTENCE: registry + prefs survive refresh (this browser only) ──
  useEffect(() => {
    const t = setTimeout(() => {
      saveSavedState({
        owners,
        uploadInfo,
        extraAirports,
        filters,
        watched,
        weatherOn,
        showAirborne,
        showEmptyBases,
      });
    }, 350);
    return () => clearTimeout(t);
  }, [owners, uploadInfo, extraAirports, filters, watched, weatherOn, showAirborne, showEmptyBases]);

  const clearAllData = () => {
    clearSavedState();
    setOwners([]);
    setExtraAirports([]);
    setUploadInfo(null);
    setUploadReport(null);
    setUploadStatus('idle');
    setSelectedAirport(null);
    setSelectedOwnerIdx(null);
    setWatched([]);
    setFilters({ models: [], gens: [], regions: [], flyingOnly: false });
    showToast('Saved registry data cleared from this browser');
  };

  // Distinct filter options (computed from the full dataset so they stay stable)
  const filterOptions = useMemo(() => {
    const models = new Set(), gens = new Set(), regions = new Set();
    for (const o of owners) {
      const m = cleanModel(o.aircraft_model) || 'Unknown';
      models.add(m);
      const g = cleanGen(o.aircraft_generation) || '—';
      gens.add(g);
      const ap = airportLookup.get(String(o.home_airport || '').toUpperCase().trim());
      regions.add(ap ? regionOf(ap.lat, ap.lng) : 'International');
    }
    const order = (arr, ref) => arr.slice().sort((a, b) => {
      const ia = ref.indexOf(a), ib = ref.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b);
    });
    return {
      models: order([...models], MODEL_KEYS),
      gens: [...gens].sort(),
      regions: order([...regions], REGION_KEYS),
    };
  }, [owners, airportLookup]);

  const filtersActive = filters.models.length || filters.gens.length || filters.regions.length || filters.flyingOnly;
  const filterCount = filters.models.length + filters.gens.length + filters.regions.length + (filters.flyingOnly ? 1 : 0);

  // The master filtered owner set — everything downstream derives from this
  const filteredOwners = useMemo(() => {
    const flyingTails = filters.flyingOnly
      ? new Set(airborneAircraft.map((a) => normalizeTail(a.reg)).filter(Boolean))
      : null;
    return owners.filter((o) => {
      if (filters.models.length) {
        const m = cleanModel(o.aircraft_model) || 'Unknown';
        if (!filters.models.includes(m)) return false;
      }
      if (filters.gens.length) {
        const g = cleanGen(o.aircraft_generation) || '—';
        if (!filters.gens.includes(g)) return false;
      }
      if (filters.regions.length) {
        const ap = airportLookup.get(String(o.home_airport || '').toUpperCase().trim());
        const reg = ap ? regionOf(ap.lat, ap.lng) : 'International';
        if (!filters.regions.includes(reg)) return false;
      }
      if (flyingTails) {
        const t = normalizeTail(o.tail_number);
        if (!t || !flyingTails.has(t)) return false;
      }
      return true;
    });
  }, [owners, filters, airborneAircraft, airportLookup]);

  const ownersByAirport = useMemo(() => {
    const m = new Map();
    for (const o of filteredOwners) {
      const code = String(o.home_airport || '').toUpperCase().trim();
      const airport = airportLookup.get(code);
      const key = airport ? airport.iata : code;
      if (!m.has(key)) m.set(key, []);
      m.get(key).push(o);
    }
    return m;
  }, [filteredOwners, airportLookup]);

  const activeAirports = useMemo(() => {
    return airportDb
      .filter((a) => ownersByAirport.has(a.iata))
      .map((a) => Object.assign({}, a, { owners: ownersByAirport.get(a.iata) }))
      .sort((a, b) => b.owners.length - a.owners.length);
  }, [ownersByAirport, airportDb]);

  const filteredAirports = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return activeAirports;
    return activeAirports.filter((a) =>
      a.iata.toLowerCase().includes(q) ||
      a.icao.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q)
    );
  }, [activeAirports, searchQuery]);

  /* ── Live-traffic matching memos ─────────────────────────────── */
  const tailToOwner = useMemo(() => {
    const m = new Map();
    for (const o of owners) {
      const norm = normalizeTail(o.tail_number);
      if (norm) m.set(norm, o);
    }
    return m;
  }, [owners]);

  const enrichedAirborne = useMemo(() => {
    return airborneAircraft.map((ac) => {
      const norm = normalizeTail(ac.reg);
      const owner = norm ? tailToOwner.get(norm) : null;
      return Object.assign({}, ac, { owner: owner || null });
    });
  }, [airborneAircraft, tailToOwner]);

  const flyingMap = useMemo(() => {
    const m = new Map();
    for (const ac of enrichedAirborne) {
      if (!ac.owner) continue;
      const norm = normalizeTail(ac.reg);
      if (norm) m.set(norm, ac);
    }
    return m;
  }, [enrichedAirborne]);

  const flyingByAirport = useMemo(() => {
    const m = new Map();
    for (const ac of enrichedAirborne) {
      if (!ac.owner) continue;
      const ha = (ac.owner.home_airport || '').toUpperCase();
      if (!ha) continue;
      m.set(ha, (m.get(ha) || 0) + 1);
    }
    return m;
  }, [enrichedAirborne]);

  // Airborne aircraft visible under the current filters (model + region apply
  // to live traffic; generation/flying-now are registry-only concepts).
  const visibleAirborne = useMemo(() => {
    if (!filtersActive) return enrichedAirborne;
    return enrichedAirborne.filter((ac) => {
      if (filters.models.length && !filters.models.includes(canonType(ac.type))) return false;
      if (filters.regions.length && !filters.regions.includes(regionOf(ac.lat, ac.lng))) return false;
      return true;
    });
  }, [enrichedAirborne, filters, filtersActive]);

  const fleetStats = useMemo(() => {
    const byModel = {};
    const byGen = {};
    for (const o of filteredOwners) {
      const m = cleanModel(o.aircraft_model) || 'Unknown';
      byModel[m] = (byModel[m] || 0) + 1;
      const g = cleanGen(o.aircraft_generation);
      if (g) byGen[g] = (byGen[g] || 0) + 1;
    }
    return { total: filteredOwners.length, grandTotal: owners.length, bases: activeAirports.length, byModel, byGen };
  }, [filteredOwners, owners, activeAirports]);

  // Generation breakdown per model: { SR22: { G6: 12, G7: 8, '—': 4 }, ... }
  const generationsByModel = useMemo(() => {
    const map = {};
    for (const o of filteredOwners) {
      const model = cleanModel(o.aircraft_model) || 'Unknown';
      const gen = cleanGen(o.aircraft_generation) || '—';
      if (!map[model]) map[model] = {};
      map[model][gen] = (map[model][gen] || 0) + 1;
    }
    return map;
  }, [filteredOwners]);

  // ALERTS: fire a toast + browser notification when a watched owner takes off
  useEffect(() => {
    if (watched.length === 0) { prevAirborneWatchedRef.current = new Set(); return; }
    const nowAirborne = new Set();
    for (const t of watched) { if (flyingMap.has(t)) nowAirborne.add(t); }
    const prev = prevAirborneWatchedRef.current;
    for (const t of nowAirborne) {
      if (!prev.has(t)) {
        const ac = flyingMap.get(t);
        const who = ac && ac.owner ? ac.owner.owner_name : (ac ? ac.reg : t);
        const msg = `✈ ${who} is now airborne${ac && ac.alt ? ` · ${Math.round(ac.alt).toLocaleString()} ft` : ''}`;
        showToast(msg);
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          try { new Notification('Cirrus Fleet — aircraft airborne', { body: msg }); } catch (e) { /* ignore */ }
        }
      }
    }
    prevAirborneWatchedRef.current = nowAirborne;
  }, [flyingMap, watched]);

  // TIME DIMENSION: accumulate session activity (airborne count over time + distinct flights)
  useEffect(() => {
    if (airborneStatus !== 'live' && airborneStatus !== 'demo') return;
    for (const ac of airborneAircraft) {
      const t = normalizeTail(ac.reg);
      if (t) seenTailsRef.current.add(t);
    }
    setFlightsToday(seenTailsRef.current.size);
    setActivity((a) => a.concat([airborneAircraft.length]).slice(-48));
  }, [airborneAircraft, airborneStatus]);

  // DATA AGE: tick every 5s while the feed is live/demo so "updated Xs ago" stays fresh
  useEffect(() => {
    if (airborneStatus !== 'live' && airborneStatus !== 'demo' && airborneStatus !== 'error') return;
    const id = setInterval(() => setDataAgeTick((t) => t + 1), 5000);
    return () => clearInterval(id);
  }, [airborneStatus]);

  // Restore shared state from the URL hash on first load (overrides saved prefs)
  const restoredRef = useRef(false);
  useEffect(() => {
    if (restoredRef.current) return;
    const hsh = location.hash || '';
    const mm = hsh.match(/[#&]v=([^&]+)/);
    if (!mm) return;
    let state = null;
    try { state = JSON.parse(decodeURIComponent(atob(mm[1]))); } catch (e) { return; }
    restoredRef.current = true;
    if (state.filters) setFilters((f) => Object.assign({ models: [], gens: [], regions: [], flyingOnly: false }, state.filters));
    if (typeof state.wx === 'boolean') setWeatherOn(state.wx);
    if (typeof state.air === 'boolean') setShowAirborne(state.air);
    if (state.sel) setSelectedAirport(state.sel);
    if (state.view) {
      let tries = 0;
      const t = setInterval(() => {
        tries++;
        if (mapInstance.current) {
          mapInstance.current.setView([state.view.lat, state.view.lng], state.view.z || 5, { animate: false });
          clearInterval(t);
        } else if (tries > 50) clearInterval(t);
      }, 80);
    }
  }, [leafletReady]);

  // Recalc map size when the filter bar appears/disappears (changes map height)
  useEffect(() => {
    if (mapInstance.current) {
      const t = setTimeout(() => mapInstance.current.invalidateSize(), 60);
      return () => clearTimeout(t);
    }
  }, [owners.length > 0]);

  // ESC closes (in priority order): filter menu → airport panel → mobile drawer
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (filterMenuOpen) { setFilterMenuOpen(false); return; }
      if (selectedAirport) { setSelectedAirport(null); setSelectedOwnerIdx(null); return; }
      if (sidebarOpen) setSidebarOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [filterMenuOpen, selectedAirport, sidebarOpen]);

  /* ────────────────────────────────────────────────────────────────
   * METAR WEATHER: when the layer is on, fetch flight categories for the
   * active bases from aviationweather.gov (shared proxy chain). Falls back
   * to a stable simulation if the sandbox blocks it.
   * ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!weatherOn) { setMetarStatus('idle'); return; }
    let cancelled = false;
    const bases = activeAirports.filter((a) => a.icao);
    const synthDemo = () => {
      const cats = ['VFR', 'VFR', 'VFR', 'VFR', 'MVFR', 'MVFR', 'IFR', 'VFR', 'LIFR'];
      const cache = metarDemoRef.current;
      const out = {};
      for (const a of bases) {
        if (!cache[a.iata]) {
          const cat = cats[Math.floor(Math.random() * cats.length)];
          cache[a.iata] = {
            cat,
            wind: Math.round(Math.random() * 18),
            wdir: Math.round(Math.random() * 36) * 10,
            vis: cat === 'LIFR' ? 0.5 : cat === 'IFR' ? 2 : cat === 'MVFR' ? 4 : 10,
            temp: Math.round(5 + Math.random() * 25),
            raw: '(simulated)',
          };
        }
        out[a.iata] = cache[a.iata];
      }
      return out;
    };
    const fetchMetar = async () => {
      if (bases.length === 0) { setMetarByAirport({}); return; }
      const ids = bases.map((a) => a.icao).join(',');
      const url = `https://aviationweather.gov/api/data/metar?ids=${ids}&format=json`;
      let data = null;
      for (let i = 0; i < CORS_STRATEGIES.length; i++) {
        try {
          const r = await fetch(CORS_STRATEGIES[i](url));
          if (!r.ok) continue;
          data = await r.json();
          if (Array.isArray(data)) break;
        } catch (e) { /* next */ }
      }
      if (cancelled) return;
      if (!Array.isArray(data)) { setMetarByAirport(synthDemo()); setMetarStatus('demo'); return; }
      const byIcao = {};
      for (const m of data) { if (m && m.icaoId) byIcao[String(m.icaoId).toUpperCase()] = m; }
      const out = {};
      for (const a of bases) {
        const m = byIcao[(a.icao || '').toUpperCase()];
        if (!m) continue;
        out[a.iata] = {
          cat: m.fltCat || 'VFR',
          wind: typeof m.wspd === 'number' ? m.wspd : null,
          wdir: typeof m.wdir === 'number' ? m.wdir : null,
          vis: m.visib,
          temp: typeof m.temp === 'number' ? Math.round(m.temp) : null,
          raw: m.rawOb || '',
        };
      }
      setMetarByAirport(out);
      setMetarStatus('live');
    };
    setMetarStatus('loading');
    fetchMetar();
    const id = setInterval(fetchMetar, 600000);
    return () => { cancelled = true; clearInterval(id); };
  }, [weatherOn, activeAirports]);

  // Leaflet readiness (script tag is in <head>, so usually instant)
  useEffect(() => {
    if (window.L) { setLeafletReady(true); return; }
    const t = setInterval(() => { if (window.L) { setLeafletReady(true); clearInterval(t); } }, 60);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!leafletReady || !mapRef.current || mapInstance.current) return;
    const L = window.L;
    const map = L.map(mapRef.current, {
      center: [37.5, -96],
      zoom: 4,
      minZoom: 2,
      maxZoom: 14,
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true,
      preferCanvas: true,
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
      crossOrigin: 'anonymous',
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.control.attribution({ position: 'bottomleft', prefix: false })
      .addAttribution('© OpenStreetMap · © CARTO')
      .addTo(map);
    map.on('zoomend', () => setMapZoom(map.getZoom()));

    mapInstance.current = map;
  }, [leafletReady]);

  /* ── BASE MARKERS (with low-zoom clustering) ─────────────────── */
  useEffect(() => {
    if (!leafletReady || !mapInstance.current) return;
    const L = window.L;
    const map = mapInstance.current;
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current.clear();

    // Active bases cluster at low zoom; the selected base always stays its own pin
    const items = clusterAirports(activeAirports, mapZoom, selectedAirport);

    for (const item of items) {
      if (item.kind === 'cluster') {
        const size = Math.min(60, 32 + item.ownerCount * 1.6);
        const html =
          `<div class="cirrus-marker cirrus-marker--cluster" style="width:${size}px;height:${size}px;">
             <div class="cirrus-marker__pulse"></div>
             <div class="cirrus-marker__core">
               <span class="cirrus-marker__count">${item.ownerCount}</span>
             </div>
             <span class="cirrus-marker__bases">${item.airports.length}</span>
           </div>`;
        const icon = L.divIcon({ html, className: 'cirrus-marker-wrap', iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
        const marker = L.marker([item.lat, item.lng], { icon, riseOnHover: true, alt: `${item.airports.length} bases · ${item.ownerCount} owners — click to zoom in` });
        marker.on('click', () => {
          map.flyTo([item.lat, item.lng], Math.min(14, map.getZoom() + 2), { duration: 0.7 });
        });
        marker.addTo(map);
        markersRef.current.set('cluster:' + item.airports.map((a) => a.iata).join('+'), marker);
        continue;
      }

      const airport = item.airport;
      const list = airport.owners || [];
      const isSelected = selectedAirport === airport.iata;
      const size = Math.min(56, 28 + list.length * 2.2);
      const wx = weatherOn ? metarByAirport[airport.iata] : null;
      const wxColor = wx ? (WX_COLORS[wx.cat] || null) : null;
      const wxClass = wxColor ? ' cirrus-marker--wx' : '';
      const wxVar = wxColor ? `--wx:${wxColor};` : '';
      const html =
        `<div class="cirrus-marker ${isSelected ? 'cirrus-marker--selected' : ''}${wxClass}" style="width:${size}px;height:${size}px;${wxVar}">
           <div class="cirrus-marker__pulse"></div>
           <div class="cirrus-marker__core">
             <span class="cirrus-marker__count">${list.length}</span>
           </div>
         </div>`;
      const icon = L.divIcon({ html, className: 'cirrus-marker-wrap', iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
      const marker = L.marker([airport.lat, airport.lng], { icon, riseOnHover: true, alt: `${airport.iata} — ${list.length} owners` });
      marker.on('click', () => {
        setSelectedAirport(airport.iata);
        setSelectedOwnerIdx(null);
      });
      marker.addTo(map);
      markersRef.current.set(airport.iata, marker);
    }

    // Ghost (empty foundational) bases — never clustered, hidden via toggle
    if (showEmptyBases) {
      for (const airport of AIRPORT_DB) {
        if (ownersByAirport.has(airport.iata)) continue;
        const size = 14;
        const html = `<div class="cirrus-marker cirrus-marker--ghost" style="width:${size}px;height:${size}px;"></div>`;
        const icon = L.divIcon({ html, className: 'cirrus-marker-wrap', iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
        const marker = L.marker([airport.lat, airport.lng], { icon, alt: `${airport.iata} — no owners` });
        marker.addTo(map);
        markersRef.current.set(airport.iata, marker);
      }
    }
  }, [leafletReady, activeAirports, ownersByAirport, selectedAirport, showEmptyBases, weatherOn, metarByAirport, mapZoom]);

  /* ────────────────────────────────────────────────────────────────
   * LIVE ADS-B TRAFFIC: poll adsb.lol every 25s for airborne Cirrus.
   * Direct call first, then the shared CORS proxy chain; the working
   * strategy is cached so later polls stay fast.
   * ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (demoMode) return; // demo simulation drives the data instead
    let cancelled = false;
    const TYPES = ['SR22', 'S22T', 'SR20', 'SF50']; // S22T = SR22T turbo (distinct ICAO designator)

    const fetchOne = async (stratIdx, type) => {
      const url = `https://api.adsb.lol/v2/type/${type}`;
      const wrapped = CORS_STRATEGIES[stratIdx](url);
      const r = await fetch(wrapped, { method: 'GET' });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    };

    let firstRun = true;

    const parseInto = (responses, aircraft) => {
      for (let i = 0; i < responses.length; i++) {
        const data = responses[i];
        if (!data || !Array.isArray(data.ac)) continue;
        for (const a of data.ac) {
          if (typeof a.lat !== 'number' || typeof a.lon !== 'number') continue;
          if (a.alt_baro === 'ground') continue; // skip ground traffic
          aircraft.push({
            hex: (a.hex || '').toLowerCase(),
            reg: (a.r || '').trim(),
            type: a.t || TYPES[i],
            desc: a.desc || `Cirrus ${a.t || TYPES[i]}`,
            lat: a.lat,
            lng: a.lon,
            alt: typeof a.alt_baro === 'number' ? a.alt_baro : 0,
            speed: typeof a.gs === 'number' ? a.gs : 0,
            heading: typeof a.track === 'number' ? a.track : 0,
            callsign: (a.flight || '').trim(),
          });
        }
      }
    };

    const fetchAirborne = async () => {
      if (firstRun) { setAirborneStatus('loading'); firstRun = false; }

      // Probe for a working strategy if we don't have one yet
      if (adsbStrategyRef.current === null) {
        for (let i = 0; i < CORS_STRATEGIES.length; i++) {
          try {
            const test = await fetchOne(i, TYPES[0]);
            if (test && Array.isArray(test.ac)) {
              adsbStrategyRef.current = i;
              break;
            }
          } catch (e) { /* try next strategy */ }
        }
        if (cancelled) return;
        if (adsbStrategyRef.current === null) {
          setAirborneStatus('error');
          return;
        }
      }

      const strat = adsbStrategyRef.current;
      let responses;
      try {
        responses = await Promise.all(
          TYPES.map((t) => fetchOne(strat, t).catch(() => null))
        );
      } catch (e) {
        if (!cancelled) setAirborneStatus('error');
        return;
      }
      if (cancelled) return;

      // If every response failed, the cached proxy may be down — re-probe next cycle
      if (responses.every((r) => r === null)) {
        adsbStrategyRef.current = null;
        setAirborneStatus('error');
        return;
      }

      const aircraft = [];
      parseInto(responses, aircraft);
      setAirborneAircraft(aircraft);
      setAirborneStatus('live');
      setAirborneLastUpdate(Date.now());
    };

    fetchAirborne();
    const intervalId = setInterval(fetchAirborne, 25000);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [demoMode]);

  /* ────────────────────────────────────────────────────────────────
   * DEMO MODE: when the live feed is blocked, synthesize moving aircraft
   * so the full feature can be previewed. Several are tied to real tail
   * numbers from the uploaded registry so owner-matching lights up.
   * ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!demoMode) return;
    const KT_TO_DEG_PER_TICK = (kt, lat) => {
      // distance covered in one 3s tick, in degrees
      const km = kt * 1.852 * (3 / 3600);
      return { dLat: km / 111, dLng: km / (111 * Math.cos(lat * Math.PI / 180) || 1) };
    };

    // Seed aircraft: prefer owners with tail numbers + known home airports
    const seeds = [];
    const lookup = airportLookupRef.current;
    const withTails = owners.filter((o) => normalizeTail(o.tail_number) && lookup.get((o.home_airport || '').toUpperCase()));
    const pickList = (withTails.length ? withTails : []).slice(0, 12);
    let seedIdx = 0;
    for (const o of pickList) {
      const ap = lookup.get((o.home_airport || '').toUpperCase());
      if (!ap) continue;
      const model = cleanModel(o.aircraft_model) || 'SR22';
      const isJet = /SF50|VISION/i.test(o.aircraft_model || '') || /SF50|VISION/i.test(model);
      const heading = (seedIdx * 47) % 360;
      seeds.push({
        hex: 'demo' + seedIdx,
        reg: o.tail_number.toUpperCase(),
        type: isJet ? 'SF50' : (model.indexOf('SR20') >= 0 ? 'SR20' : 'SR22'),
        desc: 'Cirrus ' + model + ' (demo)',
        lat: ap.lat + (Math.random() - 0.5) * 0.6,
        lng: ap.lng + (Math.random() - 0.5) * 0.6,
        alt: 4000 + Math.round(Math.random() * 11000),
        speed: isJet ? 240 + Math.round(Math.random() * 60) : 140 + Math.round(Math.random() * 40),
        heading,
        callsign: o.tail_number.toUpperCase(),
      });
      seedIdx++;
    }
    // If no registry tails available yet, fabricate a few generic ones over the US
    if (seeds.length === 0) {
      const fallback = [
        { reg: 'N742AC', type: 'SR22', lat: 33.0, lng: -96.6 },
        { reg: 'N50PV', type: 'SF50', lat: 28.5, lng: -81.3 },
        { reg: 'N99NF', type: 'SR22', lat: 47.5, lng: -122.3 },
        { reg: 'N220SA', type: 'SR20', lat: 33.8, lng: -84.3 },
      ];
      fallback.forEach((f, i) => seeds.push({
        hex: 'demo' + i, reg: f.reg, type: f.type, desc: 'Cirrus ' + f.type + ' (demo)',
        lat: f.lat, lng: f.lng, alt: 6000 + i * 1500, speed: f.type === 'SF50' ? 250 : 160,
        heading: (i * 73) % 360, callsign: f.reg,
      }));
    }

    let fleet = seeds;
    setAirborneAircraft(fleet.map((a) => Object.assign({}, a)));
    setAirborneStatus('demo');
    setAirborneLastUpdate(Date.now());

    const tick = () => {
      fleet = fleet.map((a) => {
        const { dLat, dLng } = KT_TO_DEG_PER_TICK(a.speed, a.lat);
        const rad = a.heading * Math.PI / 180;
        let nLat = a.lat + dLat * Math.cos(rad);
        let nLng = a.lng + dLng * Math.sin(rad);
        let nHeading = a.heading + (Math.random() - 0.5) * 8; // gentle drift
        // Keep them roaming within sane bounds
        if (nLat > 70 || nLat < -55) nHeading = (nHeading + 180) % 360;
        if (nLng > 180) nLng -= 360;
        if (nLng < -180) nLng += 360;
        return Object.assign({}, a, { lat: nLat, lng: nLng, heading: (nHeading + 360) % 360 });
      });
      setAirborneAircraft(fleet.map((a) => Object.assign({}, a)));
      setAirborneLastUpdate(Date.now());
    };
    const intervalId = setInterval(tick, 3000);
    return () => clearInterval(intervalId);
  }, [demoMode, owners]);

  /* ────────────────────────────────────────────────────────────────
   * LIVE ADS-B TRAFFIC: sync aircraft markers on the Leaflet map
   * ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!leafletReady || !mapInstance.current) return;
    const L = window.L;
    const map = mapInstance.current;
    const markers = aircraftMarkersRef.current;

    if (!showAirborne) {
      for (const m of markers.values()) {
        map.removeLayer(m);
      }
      markers.clear();
      return;
    }

    const currentHexes = new Set(visibleAirborne.map((a) => a.hex));
    for (const [hex, m] of markers.entries()) {
      if (!currentHexes.has(hex)) {
        map.removeLayer(m);
        markers.delete(hex);
      }
    }

    // Clean, flat, top-down directional glyphs — small enough to stay legible
    // in dense clusters. Strongly differentiated by color + shape + size:
    //  • SR-series: brand blue, straight-wing prop silhouette, 20px
    //  • SF50 Vision: red, swept-wing V-tail jet silhouette, 23px
    const SR_PATH = 'M12 2 L12.8 7.5 L21 11.5 L21 12.8 L12.8 11 L12.8 17.3 L15.5 19.7 L15.5 20.7 L12 19.8 L8.5 20.7 L8.5 19.7 L11.2 17.3 L11.2 11 L3 12.8 L3 11.5 L11.2 7.5 Z';
    const VISION_PATH = 'M12 2 L12.7 8 L21 14.5 L21 15.7 L12.7 11.5 L12.7 16.5 L16.5 20.6 L15.7 21.4 L12 18 L8.3 21.4 L7.5 20.6 L11.3 16.5 L11.3 11.5 L3 15.7 L3 14.5 L11.3 8 Z';
    for (const ac of visibleAirborne) {
      const isJet = ac.type === 'SF50';
      const color = isJet ? '#c1272d' : '#0077c8';
      const path = isJet ? VISION_PATH : SR_PATH;
      const size = isJet ? 23 : 20;
      const matchedAttr = ac.owner ? ' data-matched="true"' : '';
      const html = `<div class="cirrus-ac-marker" style="transform: rotate(${ac.heading}deg);" data-type="${ac.type}"${matchedAttr}>` +
        `<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">` +
        `<path d="${path}" fill="${color}" stroke="#ffffff" stroke-width="0.8" stroke-linejoin="round"/>` +
        `</svg></div>`;
      const icon = L.divIcon({
        className: 'cirrus-ac-divicon',
        html,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const existing = markers.get(ac.hex);
      if (existing) {
        existing.setLatLng([ac.lat, ac.lng]);
        existing.setIcon(icon);
        // Update popup content too (altitude/speed change in flight)
        existing.setPopupContent(buildAircraftPopup(ac));
      } else {
        const marker = L.marker([ac.lat, ac.lng], {
          icon,
          zIndexOffset: 1000,
          riseOnHover: true,
          alt: (ac.reg || ac.hex) + ' — airborne ' + (ac.desc || ac.type),
        });
        marker.bindPopup(buildAircraftPopup(ac), {
          className: 'cirrus-ac-popup-wrap',
          closeButton: false,
          offset: [0, -6],
        });
        marker.addTo(map);
        markers.set(ac.hex, marker);
      }
    }
  }, [leafletReady, visibleAirborne, showAirborne]);

  /* ────────────────────────────────────────────────────────────────
   * FLIGHT-PATH TRAILS: accumulate each airborne aircraft's positions
   * across poll cycles and draw a fading path behind it. History is
   * built client-side (no extra API calls), so trails grow over time.
   * ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!leafletReady || !mapInstance.current) return;
    const L = window.L;
    const map = mapInstance.current;
    const history = trailHistoryRef.current;
    const trails = aircraftTrailsRef.current;
    const MAX_POINTS = 30; // ~12 min of path at the 25s poll cadence

    const removeTrail = (hex) => {
      const line = trails.get(hex);
      if (line) { map.removeLayer(line); trails.delete(hex); }
    };

    // Layer hidden → clear everything and stop
    if (!showAirborne) {
      for (const hex of Array.from(trails.keys())) removeTrail(hex);
      return;
    }

    const nowHexes = new Set();

    // Append the latest position to each aircraft's history buffer
    for (const ac of visibleAirborne) {
      if (!ac.hex) continue;
      nowHexes.add(ac.hex);
      let pts = history.get(ac.hex);
      if (!pts) { pts = []; history.set(ac.hex, pts); }
      const last = pts[pts.length - 1];
      if (!last || last[0] !== ac.lat || last[1] !== ac.lng) {
        pts.push([ac.lat, ac.lng]);
        if (pts.length > MAX_POINTS) pts.shift();
      }
    }

    // Drop history + trail for aircraft that are no longer airborne
    for (const hex of Array.from(history.keys())) {
      if (!nowHexes.has(hex)) history.delete(hex);
    }
    for (const hex of Array.from(trails.keys())) {
      if (!nowHexes.has(hex)) removeTrail(hex);
    }

    // Draw / update a polyline through each aircraft's accumulated path
    for (const ac of visibleAirborne) {
      const pts = history.get(ac.hex);
      if (!pts || pts.length < 2) continue; // need 2+ points to draw a line
      const isJet = ac.type === 'SF50';
      const matched = !!ac.owner;
      const color = isJet ? '#c1272d' : '#0077c8';
      const existing = trails.get(ac.hex);
      if (existing) {
        existing.setLatLngs(pts);
      } else {
        const line = L.polyline(pts, {
          color,
          weight: matched ? 2.4 : 1.6,
          opacity: matched ? 0.7 : 0.4,
          smoothFactor: 1.2,
          lineCap: 'round',
          lineJoin: 'round',
          className: matched ? 'cirrus-ac-trail cirrus-ac-trail--matched' : 'cirrus-ac-trail',
          interactive: false,
        });
        line.addTo(map);
        trails.set(ac.hex, line);
      }
    }
  }, [leafletReady, visibleAirborne, showAirborne]);

  /* ────────────────────────────────────────────────────────────────
   * TRAIL POLYLINES: draw home-to-current arc for each currently-
   * flying owner of the SELECTED airport. Refreshes with selection
   * or airborne data.
   * ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!leafletReady || !mapInstance.current) return;
    const L = window.L;
    const map = mapInstance.current;

    // Clear existing trails
    for (const line of trailLinesRef.current) {
      map.removeLayer(line);
    }
    trailLinesRef.current = [];

    if (!selectedAirport) return;
    const home = airportLookup.get(selectedAirport);
    if (!home) return;

    for (const ac of visibleAirborne) {
      if (!ac.owner) continue;
      const ha = (ac.owner.home_airport || '').toUpperCase();
      if (ha !== selectedAirport) continue;

      const line = L.polyline(
        [[home.lat, home.lng], [ac.lat, ac.lng]],
        {
          color: '#0077c8',
          weight: 2.2,
          opacity: 0.7,
          dashArray: '6 6',
          className: 'cirrus-trail',
        }
      );
      line.addTo(map);
      trailLinesRef.current.push(line);
    }
  }, [leafletReady, selectedAirport, visibleAirborne, airportLookup]);

  useEffect(() => {
    if (!mapInstance.current || !selectedAirport) return;
    const airport = airportLookup.get(selectedAirport);
    if (!airport) return;
    mapInstance.current.flyTo([airport.lat, airport.lng], Math.max(mapInstance.current.getZoom(), 7), {
      duration: 1.1,
    });
  }, [selectedAirport, airportLookup]);

  const buildAircraftPopup = (ac) => {
    const altStr = ac.alt ? Math.round(ac.alt).toLocaleString() + ' ft' : '—';
    const spdStr = ac.speed ? Math.round(ac.speed) + ' kt' : '—';
    const hdgStr = Math.round(ac.heading) + '°';
    const reg = ac.reg || ac.hex.toUpperCase();
    const ic = ac.type === 'SF50' ? AC_ICON.sf50 : AC_ICON.sr;
    const matchedTag = ac.owner ? '<span class="cirrus-ac-popup__match-tag">REGISTERED OWNER</span>' : '';
    const ownerSection = ac.owner ? `
      <div class="cirrus-ac-popup__owner">
        <div class="cirrus-ac-popup__owner-name">${ac.owner.owner_name}</div>
        <div class="cirrus-ac-popup__owner-meta">Based at ${(ac.owner.home_airport || '').toUpperCase()}</div>
      </div>
    ` : '';
    return `<div class="cirrus-ac-popup${ac.owner ? ' cirrus-ac-popup--matched' : ''}">
      <div class="cirrus-ac-popup__art"><img src="${ic.src}" alt="" /></div>
      <div class="cirrus-ac-popup__head">
        <div class="cirrus-ac-popup__head-top">
          <span class="cirrus-ac-popup__reg">${reg}</span>
          ${matchedTag}
        </div>
        <span class="cirrus-ac-popup__type">${ac.desc}</span>
      </div>
      <div class="cirrus-ac-popup__stats">
        <div><span>ALT</span><strong>${altStr}</strong></div>
        <div><span>GS</span><strong>${spdStr}</strong></div>
        <div><span>HDG</span><strong>${hdgStr}</strong></div>
      </div>
      ${ownerSection}
      ${ac.callsign && ac.callsign !== reg ? `<div class="cirrus-ac-popup__cs">Callsign · ${ac.callsign}</div>` : ''}
    </div>`;
  };

  /* ────────────────────────────────────────────────────────────────
   * UPLOAD PARSING — every code is resolved against the global airport
   * directory; nothing is silently dropped any more. The upload report
   * lists skipped rows and any codes that couldn't be resolved.
   * ────────────────────────────────────────────────────────────── */
  const resolveUnknownCodes = useCallback(async (codes) => {
    if (!codes.length) return [];
    setLookupStatus('loading');
    try {
      const db = await fetchAirportsDataset();
      const found = [];
      const misses = [];
      for (const code of codes) {
        const e = db.get(code);
        if (e) found.push(e); else misses.push(code);
      }
      if (found.length) {
        setExtraAirports((prev) => {
          const seen = new Set(prev.map((a) => a.iata));
          const fresh = found.filter((a) => a.iata && !seen.has(a.iata));
          return fresh.length ? prev.concat(fresh) : prev;
        });
      }
      setLookupStatus('done');
      return misses;
    } catch (e) {
      setLookupStatus('error');
      return codes;
    }
  }, []);

  const parseRows = (rows, fileName) => {
    let skipped = 0;
    const normalized = [];
    for (const raw of rows) {
      if (isRowEmpty(raw)) continue; // blank spreadsheet rows aren't an error
      const r = normalizeRow(raw);
      if (!r.owner_name || !r.home_airport) { skipped++; continue; }
      // Defensive: skip footer/summary rows like "Registered Base Count"
      // by requiring home_airport to look like a real airport code.
      const code = String(r.home_airport).trim();
      if (!/^[A-Za-z0-9]{2,5}$/.test(code)) { skipped++; continue; }
      normalized.push(r);
    }
    if (normalized.length === 0) {
      setUploadStatus('error');
      setUploadError('No valid rows found. Required columns: owner_name + home_airport.');
      return;
    }
    setOwners(normalized);
    setUploadStatus('success');
    setUploadInfo({ fileName, count: normalized.length });
    setSelectedAirport(null);
    setSelectedOwnerIdx(null);
    setUploadReport(null);

    // Resolve any codes the featured list doesn't know via the global directory
    const lookup = airportLookupRef.current;
    const unknown = [...new Set(normalized.map((o) => String(o.home_airport).toUpperCase().trim()))]
      .filter((c) => !lookup.has(c));
    if (unknown.length) {
      resolveUnknownCodes(unknown).then((misses) => {
        if (misses.length || skipped) {
          setUploadReport({ skipped, unmatched: misses, resolved: unknown.length - misses.length });
        }
      });
    } else if (skipped) {
      setUploadReport({ skipped, unmatched: [], resolved: 0 });
    }
  };

  // After a refresh, quietly re-resolve any still-unknown codes from the saved registry
  const initialResolveRef = useRef(false);
  useEffect(() => {
    if (initialResolveRef.current) return;
    initialResolveRef.current = true;
    if (!owners.length) return;
    const lookup = airportLookupRef.current;
    const unknown = [...new Set(owners.map((o) => String(o.home_airport || '').toUpperCase().trim()))]
      .filter((c) => c && !lookup.has(c));
    if (unknown.length) {
      resolveUnknownCodes(unknown).then((misses) => {
        if (misses.length) setUploadReport({ skipped: 0, unmatched: misses, resolved: unknown.length - misses.length });
      });
    }
  }, []);

  const handleFile = useCallback((file) => {
    if (!file) return;
    setUploadStatus('parsing');
    setUploadError('');
    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => parseRows(results.data, file.name),
        error: (err) => { setUploadStatus('error'); setUploadError(err.message); },
      });
    } else if (ext === 'json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          const rows = Array.isArray(data) ? data : (data.owners || data.rows || []);
          parseRows(rows, file.name);
        } catch (err) {
          setUploadStatus('error');
          setUploadError('Invalid JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    } else if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const wb = XLSX.read(e.target.result, { type: 'array' });
          const sheet = wb.Sheets[wb.SheetNames[0]];
          let rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
          const sample = rows.slice(0, 3).map(normalizeRow);
          const hasAny = sample.some((r) => r.owner_name && r.home_airport);
          if (!hasAny) {
            const raw = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
            for (let i = 0; i < Math.min(raw.length, 8); i++) {
              const headerRow = raw[i].map((c) => String(c).toLowerCase().trim());
              const flat = headerRow.join(' ');
              if (/owner/.test(flat) && /(airport|home|icao|iata)/.test(flat)) {
                const headers = raw[i];
                rows = raw.slice(i + 1).map((arr) => {
                  const obj = {};
                  headers.forEach((hd, idx) => { obj[hd] = arr[idx]; });
                  return obj;
                });
                break;
              }
            }
          }
          parseRows(rows, file.name);
        } catch (err) {
          setUploadStatus('error');
          setUploadError('Failed to parse spreadsheet: ' + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setUploadStatus('error');
      setUploadError('Unsupported file type. Use CSV, JSON, or XLSX.');
    }
  }, []);

  useEffect(() => {
    const onDragEnter = (e) => {
      e.preventDefault();
      dragCounter.current++;
      if (e.dataTransfer && Array.from(e.dataTransfer.types).includes('Files')) {
        setIsDragging(true);
      }
    };
    const onDragLeave = (e) => {
      e.preventDefault();
      dragCounter.current--;
      if (dragCounter.current <= 0) {
        dragCounter.current = 0;
        setIsDragging(false);
      }
    };
    const onDragOver = (e) => { e.preventDefault(); };
    const onDrop = (e) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDragging(false);
      const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (file) handleFile(file);
    };
    window.addEventListener('dragenter', onDragEnter);
    window.addEventListener('dragleave', onDragLeave);
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('dragenter', onDragEnter);
      window.removeEventListener('dragleave', onDragLeave);
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('drop', onDrop);
    };
  }, [handleFile]);

  const toggleFilter = (group, value) => setFilters((f) => {
    const arr = f[group];
    return Object.assign({}, f, { [group]: arr.includes(value) ? arr.filter((x) => x !== value) : arr.concat([value]) });
  });
  const clearFilters = () => setFilters({ models: [], gens: [], regions: [], flyingOnly: false });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); };

  // ALERTS: watch specific owners; notify when their aircraft goes airborne
  const toggleWatch = (tailNorm) => {
    if (!tailNorm) return;
    setWatched((w) => {
      const has = w.includes(tailNorm);
      if (!has && typeof Notification !== 'undefined' && Notification.permission === 'default') {
        try { Notification.requestPermission(); } catch (e) { /* ignore */ }
      }
      return has ? w.filter((t) => t !== tailNorm) : w.concat([tailNorm]);
    });
  };

  const exportCSV = () => {
    const cols = ['owner_name', 'tail_number', 'aircraft_model', 'aircraft_generation', 'home_airport', 'facility_name', 'facility_type', 'phone_number', 'mailing_address'];
    const esc = (v) => {
      const s = (v == null ? '' : String(v));
      return (/[",]/.test(s) || s.indexOf(String.fromCharCode(10)) >= 0) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    const csv = [cols.join(',')].concat(filteredOwners.map((o) => cols.map((c) => esc(o[c])).join(','))).join(String.fromCharCode(10));
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'cirrus_fleet_filtered.csv'; a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${filteredOwners.length} owners to CSV`);
  };

  const shareLink = () => {
    const view = mapInstance.current
      ? { lat: +mapInstance.current.getCenter().lat.toFixed(4), lng: +mapInstance.current.getCenter().lng.toFixed(4), z: mapInstance.current.getZoom() }
      : null;
    const state = { filters, view, sel: selectedAirport, wx: weatherOn, air: showAirborne };
    let hash = '';
    try { hash = btoa(encodeURIComponent(JSON.stringify(state))); } catch (e) { hash = ''; }
    const link = location.origin + location.pathname + '#v=' + hash;
    const finish = () => showToast('Shareable link copied to clipboard');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(finish).catch(() => { location.hash = 'v=' + hash; showToast('Link set in address bar'); });
    } else {
      location.hash = 'v=' + hash; showToast('Link set in address bar');
    }
  };

  const exportPNG = async () => {
    showToast('Rendering snapshot…');
    const loadH2C = () => new Promise((resolve, reject) => {
      if (window.html2canvas) return resolve(window.html2canvas);
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      s.onload = () => resolve(window.html2canvas);
      s.onerror = () => reject(new Error('load failed'));
      document.head.appendChild(s);
    });
    try {
      const h2c = await loadH2C();
      const el = document.querySelector('.cirrus-maparea');
      if (!el) throw new Error('no map area');
      const canvas = await h2c(el, { useCORS: true, allowTaint: false, backgroundColor: '#ffffff', logging: false, scale: 2 });
      canvas.toBlob((blob) => {
        if (!blob) { showToast('Snapshot failed — try the hosted version'); return; }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'cirrus_fleet_map.png'; a.click();
        URL.revokeObjectURL(url);
        showToast('Map snapshot saved');
      });
    } catch (e) {
      showToast('Snapshot needs the hosted version (sandbox limits)');
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cirrus_owners_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedAirportData = selectedAirport ? airportLookup.get(selectedAirport) : null;
  const selectedOwners = selectedAirport ? (ownersByAirport.get(selectedAirport) || []) : [];
  const dataAgeMs = airborneLastUpdate ? Date.now() - airborneLastUpdate : null;

  /* ────────────────────────────────────────────────────────────────
   * RENDER
   * ────────────────────────────────────────────────────────────── */
  return h('div', { className: 'cirrus-root' },

    h('header', { className: 'cirrus-topbar' },
      h('button', {
        className: 'cirrus-menu-btn',
        onClick: () => setSidebarOpen((v) => !v),
        'aria-label': sidebarOpen ? 'Close base list' : 'Open base list',
        'aria-expanded': sidebarOpen,
      }, h(Menu, { size: 18 })),

      h('div', { className: 'cirrus-brand' },
        h('div', { className: 'cirrus-brand__mark' }, h(Plane, { size: 18, strokeWidth: 2.25 })),
        h('div', { className: 'cirrus-brand__text' },
          h('div', { className: 'cirrus-brand__title' }, 'CIRRUS FLEET'),
          h('div', { className: 'cirrus-brand__sub' }, 'Operational Registry · Live Deployment')
        )
      ),

      h('div', { className: 'cirrus-stats' },
        h(Stat, { label: 'Registered Owners', value: fleetStats.total, icon: h(Users, { size: 13 }) }),
        h(Stat, { label: 'Active Bases', value: fleetStats.bases, icon: h(Radio, { size: 13 }) }),
        h(Stat, { label: 'Fleet Composition', value: Object.keys(fleetStats.byModel).length, icon: h(Layers, { size: 13 }), suffix: ' models' }),
        h('div', { className: 'cirrus-stat cirrus-stat--live' },
          h('div', { className: 'cirrus-stat__label' }, h(Plane, { size: 13 }), h('span', null, 'Airborne Now')),
          h('div', { className: 'cirrus-stat__value' },
            h('span', {
              className: `cirrus-live-dot cirrus-live-dot--${airborneStatus}`,
              title: airborneStatus === 'live' ? 'Live · adsb.lol' : airborneStatus === 'error' ? 'Feed unavailable' : 'Connecting…',
            }),
            visibleAirborne.length
          )
        )
      ),

      h('div', { className: 'cirrus-topbar__right' },
        owners.length > 0 && h(Frag, null,
          h('button', { className: 'cirrus-btn cirrus-btn--ghost', onClick: exportCSV, title: 'Download the currently filtered owners as CSV' },
            h(Download, { size: 14 }), h('span', null, 'Export CSV')),
          h('button', { className: 'cirrus-btn cirrus-btn--ghost', onClick: exportPNG, title: 'Save a PNG snapshot of the map' },
            h(FileText, { size: 14 }), h('span', null, 'Snapshot')),
          h('button', { className: 'cirrus-btn', onClick: shareLink, title: 'Copy a link that restores this exact view' },
            h(Compass, { size: 14 }), h('span', null, 'Share'))
        ),
        h('button', { className: 'cirrus-btn cirrus-btn--ghost', onClick: downloadTemplate },
          h(Download, { size: 14 }), h('span', null, 'Sample CSV'))
      )
    ),

    h('main', { className: 'cirrus-main' },
      sidebarOpen && h('button', {
        className: 'cirrus-sidebar__backdrop',
        onClick: () => setSidebarOpen(false),
        'aria-label': 'Close base list',
      }),
      h('aside', { className: `cirrus-sidebar ${sidebarOpen ? 'cirrus-sidebar--open' : ''}` },

        h('section', { className: 'cirrus-upload-card' },
          h('div', { className: 'cirrus-section-label' },
            h(Upload, { size: 11 }),
            h('span', null, 'Registry Upload')
          ),
          h('label', { className: `cirrus-dropzone cirrus-dropzone--${uploadStatus}` },
            h('input', {
              type: 'file',
              accept: '.csv,.json,.xlsx,.xls',
              onChange: (e) => handleFile(e.target.files && e.target.files[0]),
              style: { display: 'none' },
              'aria-label': 'Upload registry file (CSV, JSON, or XLSX)',
            }),
            uploadStatus === 'idle' && h(Frag, null,
              h('div', { className: 'cirrus-dropzone__icon' }, h(FileText, { size: 22 })),
              h('div', { className: 'cirrus-dropzone__title' }, 'Drop registry file'),
              h('div', { className: 'cirrus-dropzone__sub' }, 'CSV · JSON · XLSX · or click to browse')
            ),
            uploadStatus === 'parsing' && h(Frag, null,
              h('div', { className: 'cirrus-dropzone__icon' }, h(Loader2, { size: 22, className: 'cirrus-spin' })),
              h('div', { className: 'cirrus-dropzone__title' }, 'Parsing roster…'),
              h('div', { className: 'cirrus-dropzone__sub' }, 'Validating columns + airport codes')
            ),
            uploadStatus === 'success' && uploadInfo && h(Frag, null,
              h('div', { className: 'cirrus-dropzone__icon cirrus-dropzone__icon--ok' }, h(CheckCircle2, { size: 22 })),
              h('div', { className: 'cirrus-dropzone__title' }, `${uploadInfo.count} owners loaded`),
              h('div', { className: 'cirrus-dropzone__sub', title: uploadInfo.fileName }, uploadInfo.fileName),
              h('div', { className: 'cirrus-dropzone__action' }, 'Click to upload a different file')
            ),
            uploadStatus === 'error' && h(Frag, null,
              h('div', { className: 'cirrus-dropzone__icon cirrus-dropzone__icon--err' }, h(AlertCircle, { size: 22 })),
              h('div', { className: 'cirrus-dropzone__title' }, 'Upload failed'),
              h('div', { className: 'cirrus-dropzone__sub' }, uploadError),
              h('div', { className: 'cirrus-dropzone__action' }, 'Click to try again')
            )
          ),

          lookupStatus === 'loading' && h('div', { className: 'cirrus-lookup-note' },
            h(Loader2, { size: 11, className: 'cirrus-spin' }),
            h('span', null, 'Resolving airport codes from the global directory…')
          ),

          uploadReport && (uploadReport.skipped > 0 || uploadReport.unmatched.length > 0) && h('div', { className: 'cirrus-upload-report', role: 'status' },
            h('div', { className: 'cirrus-upload-report__title' },
              h('span', null, 'Upload notes'),
              h('button', { className: 'cirrus-upload-report__close', onClick: () => setUploadReport(null), 'aria-label': 'Dismiss upload notes' }, h(X, { size: 12 }))
            ),
            uploadReport.skipped > 0 && h('div', null, `${uploadReport.skipped} row${uploadReport.skipped === 1 ? '' : 's'} skipped (missing owner name or airport code).`),
            uploadReport.resolved > 0 && h('div', null, `${uploadReport.resolved} airport${uploadReport.resolved === 1 ? '' : 's'} resolved from the global directory.`),
            uploadReport.unmatched.length > 0 && h(Frag, null,
              h('div', null, `${uploadReport.unmatched.length} code${uploadReport.unmatched.length === 1 ? '' : 's'} not recognized:`),
              h('div', { className: 'cirrus-upload-report__codes' }, uploadReport.unmatched.join(' · ')),
              h('div', { className: 'cirrus-upload-report__hint' }, 'These owners are loaded and counted, but not mapped. Check the codes are real IATA/ICAO identifiers.')
            )
          ),

          h('div', { className: 'cirrus-privacy' },
            h(ShieldCheck, { size: 12 }),
            h('span', null,
              'Files are processed entirely in your browser and saved only on this device — nothing is uploaded to any server. ',
              owners.length > 0 && h('button', { onClick: clearAllData, type: 'button' }, 'Clear saved data')
            )
          )
        ),

        owners.length > 0 && h('section', { className: 'cirrus-comp' },
          h('div', { className: 'cirrus-section-label' },
            h(Plane, { size: 11 }),
            h('span', null, 'Fleet Composition'),
            h('span', { style: { marginLeft: 'auto', fontSize: '9px', color: 'var(--text-3)', letterSpacing: '0.12em' } }, 'tap to inspect')
          ),
          h('div', { className: 'cirrus-comp__grid' },
            Object.entries(fleetStats.byModel).sort((a, b) => b[1] - a[1]).map(([m, n]) =>
              h('button', {
                key: m,
                type: 'button',
                className: `cirrus-comp__cell ${selectedModel === m ? 'cirrus-comp__cell--active' : ''}`,
                onClick: () => setSelectedModel(selectedModel === m ? null : m),
                'aria-expanded': selectedModel === m,
              },
                h('div', { className: 'cirrus-comp__model' }, m),
                h('div', { className: 'cirrus-comp__count' }, n)
              )
            )
          ),
          selectedModel && h(GenBreakdown, {
            model: selectedModel,
            generations: generationsByModel[selectedModel] || {},
            total: fleetStats.byModel[selectedModel] || 0,
            onClose: () => setSelectedModel(null),
          })
        ),

        owners.length > 0 && (activity.length > 0 || airborneStatus === 'live' || airborneStatus === 'demo') && h('section', { className: 'cirrus-activity' },
          h('div', { className: 'cirrus-section-label' },
            h(Activity, { size: 11 }),
            h('span', null, 'Fleet Activity'),
            h('span', { style: { marginLeft: 'auto', fontSize: '9px', color: 'var(--text-3)', letterSpacing: '0.12em' } }, 'this session')
          ),
          h('div', { className: 'cirrus-activity__row' },
            h('div', { className: 'cirrus-activity__metric' },
              h('div', { className: 'cirrus-activity__num' }, flightsToday),
              h('div', { className: 'cirrus-activity__lbl' }, 'flights observed')
            ),
            h('div', { className: 'cirrus-activity__metric' },
              h('div', { className: 'cirrus-activity__num' }, visibleAirborne.length),
              h('div', { className: 'cirrus-activity__lbl' }, 'airborne now')
            )
          ),
          h(Sparkline, { values: activity })
        ),

        h('section', { className: 'cirrus-bases' },
          h('div', { className: 'cirrus-section-label cirrus-section-label--row' },
            h('div', { className: 'cirrus-section-label__group' },
              h(Radar, { size: 11 }),
              h('span', null, 'Active Bases')
            ),
            h('button', {
              className: 'cirrus-toggle',
              title: showEmptyBases ? 'Hide empty bases' : 'Show empty bases',
              'aria-label': showEmptyBases ? 'Hide empty bases' : 'Show empty bases',
              'aria-pressed': showEmptyBases,
              onClick: () => setShowEmptyBases((v) => !v),
            }, showEmptyBases ? h(Eye, { size: 12 }) : h(EyeOff, { size: 12 }))
          ),

          owners.length > 0 && h('div', { className: 'cirrus-search' },
            h(Search, { size: 12 }),
            h('input', {
              type: 'text',
              placeholder: 'Search code, name, or city',
              'aria-label': 'Search bases by code, name, or city',
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
            })
          ),

          h('div', { className: 'cirrus-bases__list' },
            filteredAirports.length === 0 && h('div', { className: 'cirrus-empty' },
              owners.length === 0
                ? 'Upload a registry to populate active bases.'
                : 'No bases match your search.'
            ),
            filteredAirports.map((a) => {
              const isSelected = selectedAirport === a.iata;
              const flyingCount = flyingByAirport.get(a.iata) || 0;
              return h('button', {
                key: a.iata,
                className: `cirrus-base-row ${isSelected ? 'cirrus-base-row--active' : ''}`,
                'aria-pressed': isSelected,
                onClick: () => {
                  if (isSelected) {
                    setSelectedAirport(null);
                    setSelectedOwnerIdx(null);
                  } else {
                    setSelectedAirport(a.iata);
                    setSelectedOwnerIdx(null);
                    setSidebarOpen(false); // mobile: reveal the map
                  }
                },
              },
                h('div', { className: 'cirrus-base-row__codes' },
                  h('span', { className: 'cirrus-base-row__iata' }, a.iata),
                  h('span', { className: 'cirrus-base-row__icao' }, a.icao)
                ),
                h('div', { className: 'cirrus-base-row__name' },
                  h('div', null, a.name),
                  h('div', { className: 'cirrus-base-row__city' }, a.city)
                ),
                h('div', { className: 'cirrus-base-row__right' },
                  flyingCount > 0 && h('span', { className: 'cirrus-base-row__flying', title: `${flyingCount} currently flying` },
                    h('span', { className: 'cirrus-base-row__flying-dot' }),
                    flyingCount
                  ),
                  h('div', { className: 'cirrus-base-row__count' }, a.owners.length)
                )
              );
            })
          )
        )
      ),

      h('section', { className: 'cirrus-mapcol' },
        owners.length > 0 && h('div', { className: 'cirrus-filterbar' },
          h('div', { className: 'cirrus-filterbar__menu-wrap' },
            h('button', {
              type: 'button',
              className: `cirrus-filter-btn ${filtersActive ? 'cirrus-filter-btn--active' : ''} ${filterMenuOpen ? 'cirrus-filter-btn--open' : ''}`,
              onClick: () => setFilterMenuOpen((v) => !v),
              'aria-expanded': filterMenuOpen,
              'aria-haspopup': 'true',
            },
              h(Sliders, { size: 13 }),
              h('span', null, 'Filters'),
              filterCount > 0 && h('span', { className: 'cirrus-filter-btn__badge' }, filterCount),
              h(ChevronDown, { size: 13, className: `cirrus-filter-btn__chev ${filterMenuOpen ? 'cirrus-filter-btn__chev--open' : ''}` })
            ),
            filterMenuOpen && h(Frag, null,
              h('div', { className: 'cirrus-filter-menu__backdrop', onClick: () => setFilterMenuOpen(false) }),
              h('div', { className: 'cirrus-filter-menu', role: 'dialog', 'aria-label': 'Filter owners' },
                h(FilterChips, { label: 'Model', options: filterOptions.models, selected: filters.models, onToggle: (v) => toggleFilter('models', v) }),
                h(FilterChips, { label: 'Generation', options: filterOptions.gens, selected: filters.gens, onToggle: (v) => toggleFilter('gens', v) }),
                h(FilterChips, { label: 'Region', options: filterOptions.regions, selected: filters.regions, onToggle: (v) => toggleFilter('regions', v) }),
                h('div', { className: 'cirrus-fg cirrus-fg--col' },
                  h('span', { className: 'cirrus-fg__label' }, 'Status'),
                  h('div', { className: 'cirrus-fg__chips' },
                    h('button', {
                      type: 'button',
                      className: `cirrus-chip cirrus-chip--flying ${filters.flyingOnly ? 'cirrus-chip--on' : ''}`,
                      'aria-pressed': filters.flyingOnly,
                      onClick: () => setFilters((f) => Object.assign({}, f, { flyingOnly: !f.flyingOnly })),
                    }, '● Flying now')
                  )
                ),
                h('div', { className: 'cirrus-filter-menu__footer' },
                  h('button', { className: 'cirrus-filterbar__clear', onClick: clearFilters, disabled: !filtersActive },
                    h(X, { size: 11 }), ' Clear all'),
                  h('button', { className: 'cirrus-filter-menu__done', onClick: () => setFilterMenuOpen(false) }, 'Done')
                )
              )
            )
          ),
          h('div', { className: 'cirrus-filterbar__right' },
            watched.length > 0 && h('span', { className: 'cirrus-watching-pill', title: "Owners you're watching for takeoff" },
              h(Bell, { size: 11 }), ` ${watched.length} watched`),
            h('span', { className: 'cirrus-filterbar__count' },
              `${fleetStats.total}${filtersActive ? ` of ${fleetStats.grandTotal}` : ''} owners · ${fleetStats.bases} bases`),
            filtersActive ? h('button', { className: 'cirrus-filterbar__clear', onClick: clearFilters }, h(X, { size: 11 }), ' Clear') : null
          )
        ),
        h('div', { className: 'cirrus-maparea' },
          h('div', { ref: mapRef, className: 'cirrus-map', role: 'application', 'aria-label': 'Fleet map' }),

          h('div', { className: 'cirrus-map__overlay-top' },
            h('div', { className: 'cirrus-map__legend' },
              h('div', { className: 'cirrus-legend-item' },
                h('span', { className: 'cirrus-legend-dot cirrus-legend-dot--active' }),
                h('span', null, 'Active base · owners docked')
              ),
              h('div', { className: 'cirrus-legend-item' },
                h('span', { className: 'cirrus-legend-dot cirrus-legend-dot--ghost' }),
                h('span', null, 'Foundational airport')
              ),
              h('div', { className: 'cirrus-legend-item' },
                h('span', { className: 'cirrus-legend-icon' },
                  h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg' },
                    h('path', { d: 'M12 2 L12.8 7.5 L21 11.5 L21 12.8 L12.8 11 L12.8 17.3 L15.5 19.7 L15.5 20.7 L12 19.8 L8.5 20.7 L8.5 19.7 L11.2 17.3 L11.2 11 L3 12.8 L3 11.5 L11.2 7.5 Z', fill: '#0077c8', stroke: '#ffffff', strokeWidth: 0.8 })
                  )
                ),
                h('span', null, 'SR20 / 22 / 22T'),
                h('span', { className: 'cirrus-legend-icon', style: { marginLeft: '10px' } },
                  h('svg', { width: 15, height: 15, viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg' },
                    h('path', { d: 'M12 2 L12.7 8 L21 14.5 L21 15.7 L12.7 11.5 L12.7 16.5 L16.5 20.6 L15.7 21.4 L12 18 L8.3 21.4 L7.5 20.6 L11.3 16.5 L11.3 11.5 L3 15.7 L3 14.5 L11.3 8 Z', fill: '#c1272d', stroke: '#ffffff', strokeWidth: 0.8 })
                  )
                ),
                h('span', null, 'SF50 Vision · airborne (live)')
              )
            ),
            h('div', { className: 'cirrus-map__controls' },
              h('button', {
                className: `cirrus-airborne-toggle ${weatherOn ? 'cirrus-airborne-toggle--on' : ''}`,
                onClick: () => setWeatherOn((v) => !v),
                'aria-pressed': weatherOn,
                title: 'Toggle live METAR weather (color bases by flight category)',
              },
                h(Radio, { size: 11 }),
                h('span', null,
                  'Weather',
                  weatherOn && metarStatus === 'live' && ' · live',
                  weatherOn && metarStatus === 'demo' && ' · demo',
                  weatherOn && metarStatus === 'loading' && ' · …'
                )
              ),
              weatherOn && h('div', { className: 'cirrus-wx-legend' },
                ['VFR', 'MVFR', 'IFR', 'LIFR'].map((c) =>
                  h('span', { key: c, className: 'cirrus-wx-legend__item' },
                    h('span', { className: 'cirrus-wx-legend__dot', style: { background: WX_COLORS[c] } }), c
                  )
                )
              ),
              h('button', {
                className: `cirrus-airborne-toggle ${showAirborne ? 'cirrus-airborne-toggle--on' : ''}`,
                onClick: () => setShowAirborne((v) => !v),
                'aria-pressed': showAirborne,
                title: showAirborne ? 'Hide live traffic layer' : 'Show live traffic layer',
              },
                showAirborne ? h(Eye, { size: 11 }) : h(EyeOff, { size: 11 }),
                h('span', null,
                  'Live traffic',
                  airborneStatus === 'live' && ` · ${visibleAirborne.length}`,
                  airborneStatus === 'demo' && ` · ${visibleAirborne.length} (demo)`,
                  airborneStatus === 'loading' && ' · connecting…',
                  airborneStatus === 'error' && ' · feed unavailable'
                )
              ),
              showAirborne && dataAgeMs !== null && (airborneStatus === 'live' || airborneStatus === 'demo' || airborneStatus === 'error') && h('span', {
                className: `cirrus-data-age ${dataAgeMs > 60000 ? 'cirrus-data-age--stale' : ''}`,
                title: 'Age of the live traffic data',
              },
                h(Radio, { size: 10 }),
                `Updated ${formatAge(dataAgeMs)}`
              ),
              airborneStatus === 'error' && !demoMode && h('div', { className: 'cirrus-feed-note' },
                h('div', { className: 'cirrus-feed-note__title' },
                  h(AlertCircle, { size: 12 }), ' Live feed blocked here'),
                h('div', { className: 'cirrus-feed-note__body' },
                  'This preview sandbox blocks external data requests. The live ADS-B feed works once you download or host this dashboard.'),
                h('button', { className: 'cirrus-feed-note__btn', onClick: () => setDemoMode(true) }, 'Preview with sample data')
              ),
              demoMode && h('div', { className: 'cirrus-demo-banner' },
                h('span', null, h('span', { className: 'cirrus-live-dot cirrus-live-dot--demo' }), ' Demo data — simulated, not live'),
                h('button', { className: 'cirrus-demo-exit', onClick: () => { setDemoMode(false); setAirborneAircraft([]); setAirborneStatus('idle'); } },
                  h(X, { size: 11 }), ' Exit')
              )
            ),
            !leafletReady && h('div', { className: 'cirrus-map__loading' },
              h(Loader2, { size: 12, className: 'cirrus-spin' }), ' Initializing map engine…')
          ),

          selectedAirportData && h(AirportPanel, {
            airport: selectedAirportData,
            owners: selectedOwners,
            selectedOwnerIdx,
            onSelectOwner: setSelectedOwnerIdx,
            onClose: () => { setSelectedAirport(null); setSelectedOwnerIdx(null); },
            flyingMap,
            watched,
            onToggleWatch: toggleWatch,
            onToast: showToast,
          })
        )
      )
    ),

    isDragging && h('div', { className: 'cirrus-drop-overlay' },
      h('div', { className: 'cirrus-drop-overlay__inner' },
        h(Upload, { size: 42, strokeWidth: 1.5 }),
        h('div', { className: 'cirrus-drop-overlay__title' }, 'Release to load registry'),
        h('div', { className: 'cirrus-drop-overlay__sub' }, 'CSV · JSON · XLSX accepted')
      )
    ),
    toast && h('div', { className: 'cirrus-toast', role: 'status', 'aria-live': 'polite' }, toast)
  );
}

/* ---------------------------------------------------------------------------
 * SUB-COMPONENTS
 * ------------------------------------------------------------------------- */
function Sparkline({ values }) {
  if (!values || values.length < 2) return h('div', { className: 'cirrus-spark cirrus-spark--empty' }, 'Gathering activity…');
  const width = 220, height = 34;
  const max = Math.max.apply(null, values.concat([1]));
  const min = Math.min.apply(null, values.concat([0]));
  const range = (max - min) || 1;
  const stepX = width / (values.length - 1);
  const pts = values.map((v, i) => `${(i * stepX).toFixed(1)},${(height - 3 - ((v - min) / range) * (height - 6)).toFixed(1)}`).join(' ');
  const areaPts = `0,${height} ` + pts + ` ${width},${height}`;
  return h('svg', {
    className: 'cirrus-spark',
    viewBox: `0 0 ${width} ${height}`,
    preserveAspectRatio: 'none',
    width: '100%', height,
    'aria-label': 'Airborne aircraft count over this session',
    role: 'img',
  },
    h('polygon', { points: areaPts, fill: 'var(--accent)', opacity: '0.12' }),
    h('polyline', { points: pts, fill: 'none', stroke: 'var(--accent)', strokeWidth: '1.6', strokeLinejoin: 'round', strokeLinecap: 'round' })
  );
}

function FilterChips({ label, options, selected, onToggle }) {
  if (!options || options.length === 0) return null;
  return h('div', { className: 'cirrus-fg' },
    h('span', { className: 'cirrus-fg__label' }, label),
    h('div', { className: 'cirrus-fg__chips' },
      options.map((opt) =>
        h('button', {
          key: opt,
          type: 'button',
          className: `cirrus-chip ${selected.includes(opt) ? 'cirrus-chip--on' : ''}`,
          'aria-pressed': selected.includes(opt),
          onClick: () => onToggle(opt),
        }, opt)
      )
    )
  );
}

function Stat({ label, value, icon, suffix = '' }) {
  return h('div', { className: 'cirrus-stat' },
    h('div', { className: 'cirrus-stat__label' }, icon, h('span', null, label)),
    h('div', { className: 'cirrus-stat__value' },
      value, suffix && h('span', { className: 'cirrus-stat__suffix' }, suffix))
  );
}

function AirportPanel({ airport, owners, selectedOwnerIdx, onSelectOwner, onClose, flyingMap, watched, onToggleWatch, onToast }) {
  return h('div', { className: 'cirrus-panel', role: 'dialog', 'aria-label': `${airport.iata} — owners at this base` },
    h('div', { className: 'cirrus-panel__header' },
      h('div', null,
        h('div', { className: 'cirrus-panel__codes' },
          h('span', { className: 'cirrus-panel__iata' }, airport.iata),
          h('span', { className: 'cirrus-panel__icao' }, airport.icao),
          h('span', { className: 'cirrus-panel__count-pill' },
            h(Users, { size: 11 }), ` ${owners.length}`)
        ),
        h('div', { className: 'cirrus-panel__name' }, airport.name),
        h('div', { className: 'cirrus-panel__meta' },
          h('span', null, h(MapPin, { size: 11 }), ` ${airport.city}`),
          h('span', null, h(Compass, { size: 11 }), ` ${airport.fbo}`)
        ),
        h('div', { className: 'cirrus-panel__coords' },
          h(Navigation, { size: 10 }),
          `${airport.lat.toFixed(4)}°, ${airport.lng.toFixed(4)}°`
        )
      ),
      h('button', { className: 'cirrus-panel__close', onClick: onClose, 'aria-label': 'Close panel' },
        h(X, { size: 16 }))
    ),

    h('div', { className: 'cirrus-panel__divider' }),

    h('div', { className: 'cirrus-panel__section-label' },
      h(Sparkles, { size: 11 }),
      h('span', null, 'Owners at this base')
    ),

    h('div', { className: 'cirrus-panel__owners' },
      owners.map((o, i) => {
        const open = selectedOwnerIdx === i;
        const model = cleanModel(o.aircraft_model) || 'Unknown';
        const gen = cleanGen(o.aircraft_generation);
        const tailNorm = normalizeTail(o.tail_number);
        const flying = (flyingMap && tailNorm) ? flyingMap.get(tailNorm) : null;
        const isWatched = !!(watched && tailNorm && watched.includes(tailNorm));
        return h('div', { key: i, className: `cirrus-owner ${open ? 'cirrus-owner--open' : ''} ${flying ? 'cirrus-owner--flying' : ''}` },
          h('button', {
            className: 'cirrus-owner__row',
            onClick: () => onSelectOwner(open ? null : i),
            'aria-expanded': open,
          },
            h('div', { className: 'cirrus-owner__name' },
              h('div', { className: 'cirrus-owner__avatar', 'aria-hidden': 'true' }, initials(o.owner_name)),
              h('div', null,
                h('div', { className: 'cirrus-owner__name-text' },
                  o.owner_name,
                  flying && h('span', {
                    className: 'cirrus-owner__flying-badge',
                    title: `Airborne · ${Math.round(flying.alt).toLocaleString()} ft · ${Math.round(flying.speed)} kt`,
                  },
                    h('span', { className: 'cirrus-owner__flying-dot' }),
                    'FLYING'
                  )
                ),
                h('div', { className: 'cirrus-owner__model' }, `${model}${o.tail_number ? ` · ${o.tail_number.toUpperCase()}` : ''}`)
              )
            ),
            h('div', { className: 'cirrus-owner__right' },
              h(GenBadge, { gen, model }),
              open ? h(ChevronDown, { size: 14 }) : h(ChevronRight, { size: 14 })
            )
          ),

          open && h('div', { className: 'cirrus-owner__detail' },
            h(DetailField, { label: 'Pilot of Record', value: o.owner_name }),
            h(DetailField, { label: 'Tail Number', value: o.tail_number ? o.tail_number.toUpperCase() : '—', mono: true }),
            h(DetailField, { label: 'Airframe Model', value: `Cirrus ${model}`, mono: true }),
            h(DetailField, { label: 'Generation', value: gen || '—', mono: true }),
            h(DetailField, { label: 'Home Base', value: `${airport.iata} · ${airport.icao}`, mono: true }),
            h(DetailField, { label: 'Facility', value: o.facility_name || airport.fbo }),
            h(DetailField, { label: 'Facility Type', value: o.facility_type || '—' }),
            h(DetailField, { label: 'Phone', value: o.phone_number || '—', mono: true }),
            o.mailing_address && h(DetailField, { label: 'Mailing Address', value: o.mailing_address, fullWidth: true }),
            flying
              ? h(DetailField, {
                  label: 'Live Status',
                  value: `Airborne · ${Math.round(flying.alt).toLocaleString()} ft @ ${Math.round(flying.speed)} kt`,
                  mono: true,
                  highlight: true,
                })
              : h(DetailField, { label: 'Live Status', value: o.tail_number ? 'On ground / not tracking' : 'No tail number on file' }),
            h('div', { className: 'cirrus-owner__actions' },
              h('button', {
                type: 'button',
                className: `cirrus-owner__action ${isWatched ? 'cirrus-owner__action--watching' : ''}`,
                onClick: () => onToggleWatch && onToggleWatch(tailNorm),
                disabled: !tailNorm,
                'aria-pressed': isWatched,
                title: tailNorm ? 'Alert me when this aircraft goes airborne' : 'No tail number on file',
              },
                h(Bell, { size: 12 }), ` ${isWatched ? 'Watching' : 'Watch for takeoff'}`),
              h('a', {
                className: 'cirrus-owner__action',
                href: `https://app.hubspot.com/contacts/search?query=${encodeURIComponent(o.owner_name || '')}`,
                target: '_blank',
                rel: 'noopener noreferrer',
                title: 'Open this owner in HubSpot',
              },
                h(ExternalLink, { size: 12 }), ' HubSpot'),
              h('button', {
                type: 'button',
                className: 'cirrus-owner__action',
                onClick: () => {
                  const rec = ['Owner: ' + o.owner_name, 'Tail: ' + (o.tail_number ? o.tail_number.toUpperCase() : '—'), 'Aircraft: Cirrus ' + model + (gen ? ' ' + gen : ''), 'Base: ' + airport.iata + ' (' + airport.icao + ')', 'Phone: ' + (o.phone_number || '—'), 'Address: ' + (o.mailing_address || '—')].join(String.fromCharCode(10));
                  if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(rec).then(() => onToast && onToast('Owner record copied for CRM')).catch(() => onToast && onToast('Copy unavailable here'));
                  } else if (onToast) { onToast('Copy unavailable here'); }
                },
                title: 'Copy a CRM-ready record (paste into HubSpot, Salesforce, etc.)',
              },
                h(Copy, { size: 12 }), ' Copy for CRM')
            )
          )
        );
      })
    )
  );
}

function GenBadge({ gen, model }) {
  if (!gen) return h('span', { className: 'cirrus-genbadge cirrus-genbadge--empty' }, '—');
  const isVision = /SF50|VISION/i.test(model || '') || /SF50|VISION/i.test(gen);
  return h('span', { className: `cirrus-genbadge ${isVision ? 'cirrus-genbadge--vision' : ''}` }, gen);
}

function GenBreakdown({ model, generations, total, onClose }) {
  const entries = Object.entries(generations).sort((a, b) => {
    // Sort: real G-versions first by version number desc, then '—' last
    const av = a[0], bv = b[0];
    if (av === '—' && bv !== '—') return 1;
    if (bv === '—' && av !== '—') return -1;
    const an = parseInt(av.replace(/\D/g, ''), 10);
    const bn = parseInt(bv.replace(/\D/g, ''), 10);
    if (!isNaN(an) && !isNaN(bn)) return bn - an;
    return b[1] - a[1];
  });
  const max = Math.max.apply(null, entries.map((e) => e[1]).concat([1]));
  const isVision = /SF50|VISION/i.test(model);
  const onlyMissing = entries.length === 1 && entries[0][0] === '—';

  return h('div', { className: `cirrus-genbreak ${isVision ? 'cirrus-genbreak--vision' : ''}` },
    h('div', { className: 'cirrus-genbreak__header' },
      h('div', null,
        h('div', { className: 'cirrus-genbreak__title' }, `Cirrus ${model}`),
        h('div', { className: 'cirrus-genbreak__sub' }, `${total} airframe${total === 1 ? '' : 's'} · generation breakdown`)
      ),
      h('button', { className: 'cirrus-genbreak__close', onClick: onClose, 'aria-label': 'Close breakdown' },
        h(X, { size: 12 }))
    ),
    onlyMissing
      ? h('div', { className: 'cirrus-genbreak__empty' },
          'No generation data in this upload. Include an ',
          h('span', { className: 'cirrus-genbreak__code' }, 'aircraft_generation'),
          ` column to break ${model} down by airframe revision.`)
      : h('div', { className: 'cirrus-genbreak__rows' },
          entries.map(([gen, count]) =>
            h('div', { key: gen, className: 'cirrus-genbreak__row' },
              h('span', { className: `cirrus-genbadge ${isVision ? 'cirrus-genbadge--vision' : ''} ${gen === '—' ? 'cirrus-genbadge--empty' : ''}` }, gen),
              h('div', { className: 'cirrus-genbreak__bar' },
                h('div', {
                  className: `cirrus-genbreak__fill ${isVision ? 'cirrus-genbreak__fill--vision' : ''}`,
                  style: { width: `${(count / max) * 100}%` },
                })
              ),
              h('span', { className: 'cirrus-genbreak__count' }, count)
            )
          )
        )
  );
}

function DetailField({ label, value, mono, highlight, fullWidth }) {
  const cls = ['cirrus-detail'];
  if (highlight) cls.push('cirrus-detail--highlight');
  if (fullWidth) cls.push('cirrus-detail--full');
  return h('div', { className: cls.join(' ') },
    h('div', { className: 'cirrus-detail__label' }, label),
    h('div', { className: `cirrus-detail__value ${mono ? 'cirrus-detail__value--mono' : ''}` },
      highlight && h('span', { className: 'cirrus-detail__pulse' }),
      value
    )
  );
}

function initials(name) {
  if (!name) return '?';
  const parts = String(name).trim().split(/\s+/);
  return ((parts[0] && parts[0][0]) || '') + ((parts[1] && parts[1][0]) || '');
}

/* ---------------------------------------------------------------------------
 * MOUNT
 * ------------------------------------------------------------------------- */
const splash = document.getElementById('splash');
if (splash) splash.remove();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(CirrusFleetDashboard));
