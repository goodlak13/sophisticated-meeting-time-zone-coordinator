import { TimeZoneData } from '../types';

export const timeZones: TimeZoneData[] = [
  {
    name: 'America/New_York',
    offset: 'UTC-5/-4',
    cities: ['New York', 'Washington DC', 'Miami', 'Toronto'],
    flag: '🇺🇸'
  },
  {
    name: 'America/Los_Angeles',
    offset: 'UTC-8/-7',
    cities: ['Los Angeles', 'San Francisco', 'Seattle', 'Vancouver'],
    flag: '🇺🇸'
  },
  {
    name: 'Europe/London',
    offset: 'UTC+0/+1',
    cities: ['London', 'Dublin', 'Edinburgh', 'Cardiff'],
    flag: '🇬🇧'
  },
  {
    name: 'Europe/Paris',
    offset: 'UTC+1/+2',
    cities: ['Paris', 'Berlin', 'Rome', 'Madrid'],
    flag: '🇫🇷'
  },
  {
    name: 'Asia/Tokyo',
    offset: 'UTC+9',
    cities: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama'],
    flag: '🇯🇵'
  },
  {
    name: 'Asia/Shanghai',
    offset: 'UTC+8',
    cities: ['Shanghai', 'Beijing', 'Shenzhen', 'Hong Kong'],
    flag: '🇨🇳'
  },
  {
    name: 'Asia/Kolkata',
    offset: 'UTC+5:30',
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'],
    flag: '🇮🇳'
  },
  {
    name: 'Australia/Sydney',
    offset: 'UTC+10/+11',
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Canberra'],
    flag: '🇦🇺'
  },
  {
    name: 'Europe/Berlin',
    offset: 'UTC+1/+2',
    cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt'],
    flag: '🇩🇪'
  },
  {
    name: 'America/Chicago',
    offset: 'UTC-6/-5',
    cities: ['Chicago', 'Dallas', 'Houston', 'Denver'],
    flag: '🇺🇸'
  }
];

export const popularCities = [
  { name: 'New York', timeZone: 'America/New_York', flag: '🇺🇸' },
  { name: 'Los Angeles', timeZone: 'America/Los_Angeles', flag: '🇺🇸' },
  { name: 'London', timeZone: 'Europe/London', flag: '🇬🇧' },
  { name: 'Paris', timeZone: 'Europe/Paris', flag: '🇫🇷' },
  { name: 'Tokyo', timeZone: 'Asia/Tokyo', flag: '🇯🇵' },
  { name: 'Sydney', timeZone: 'Australia/Sydney', flag: '🇦🇺' },
  { name: 'Berlin', timeZone: 'Europe/Berlin', flag: '🇩🇪' },
  { name: 'Mumbai', timeZone: 'Asia/Kolkata', flag: '🇮🇳' },
  { name: 'Shanghai', timeZone: 'Asia/Shanghai', flag: '🇨🇳' },
  { name: 'Singapore', timeZone: 'Asia/Singapore', flag: '🇸🇬' }
];