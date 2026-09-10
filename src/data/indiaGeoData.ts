/**
 * VectorGuard AI - Comprehensive Indian Geographic & Administrative Geo-Data
 * 28 States + 8 Union Territories with verified State -> City hierarchical relationships,
 * Centroids, Bounding Boxes, and Deep Urban GIS Vector Layers for Municipal Operations.
 */

import { HotspotRecord } from '../types';
import { DEMO_EVIDENCE_IMAGES } from './evidenceImages';

export interface CityGeoInfo {
  name: string;
  state: string;
  lat: number;
  lng: number;
  zoom: number;
  district: string;
  tier: 'Tier-1' | 'Tier-2' | 'Tier-3' | 'Special Municipal Zone';
  monsoonVulnerability: 'Critical' | 'High' | 'Moderate' | 'Low';
  elevationMeters: number;
}

export interface StateGeoInfo {
  name: string;
  type: 'STATE' | 'UNION_TERRITORY';
  lat: number;
  lng: number;
  zoom: number;
  capital: string;
  cities: CityGeoInfo[];
}

export const ALL_INDIAN_STATES_AND_UTS: StateGeoInfo[] = [
  // ================= 28 STATES =================
  {
    name: 'Andhra Pradesh',
    type: 'STATE',
    lat: 15.9129,
    lng: 79.7400,
    zoom: 7,
    capital: 'Amaravati',
    cities: [
      { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185, zoom: 13, district: 'Visakhapatnam', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 45 },
      { name: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480, zoom: 13, district: 'NTR', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 23 },
      { name: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lng: 80.4365, zoom: 13, district: 'Guntur', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 33 },
      { name: 'Tirupati', state: 'Andhra Pradesh', lat: 13.6288, lng: 79.4192, zoom: 13, district: 'Tirupati', tier: 'Tier-2', monsoonVulnerability: 'Moderate', elevationMeters: 162 },
      { name: 'Nellore', state: 'Andhra Pradesh', lat: 14.4426, lng: 79.9865, zoom: 13, district: 'SPSR Nellore', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 18 },
      { name: 'Kurnool', state: 'Andhra Pradesh', lat: 15.8281, lng: 78.0373, zoom: 13, district: 'Kurnool', tier: 'Tier-2', monsoonVulnerability: 'Moderate', elevationMeters: 274 },
      { name: 'Kakinada', state: 'Andhra Pradesh', lat: 16.9891, lng: 82.2475, zoom: 13, district: 'Kakinada', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 10 },
      { name: 'Rajahmundry', state: 'Andhra Pradesh', lat: 17.0005, lng: 81.8040, zoom: 13, district: 'East Godavari', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 14 }
    ]
  },
  {
    name: 'Arunachal Pradesh',
    type: 'STATE',
    lat: 28.2180,
    lng: 94.7278,
    zoom: 7,
    capital: 'Itanagar',
    cities: [
      { name: 'Itanagar', state: 'Arunachal Pradesh', lat: 27.0844, lng: 93.6053, zoom: 13, district: 'Papum Pare', tier: 'Tier-3', monsoonVulnerability: 'High', elevationMeters: 320 },
      { name: 'Naharlagun', state: 'Arunachal Pradesh', lat: 27.1082, lng: 93.6934, zoom: 13, district: 'Papum Pare', tier: 'Tier-3', monsoonVulnerability: 'High', elevationMeters: 200 },
      { name: 'Pasighat', state: 'Arunachal Pradesh', lat: 28.0664, lng: 95.3268, zoom: 13, district: 'East Siang', tier: 'Tier-3', monsoonVulnerability: 'High', elevationMeters: 155 },
      { name: 'Tawang', state: 'Arunachal Pradesh', lat: 27.5861, lng: 91.8594, zoom: 13, district: 'Tawang', tier: 'Tier-3', monsoonVulnerability: 'Low', elevationMeters: 2669 }
    ]
  },
  {
    name: 'Assam',
    type: 'STATE',
    lat: 26.2006,
    lng: 92.9376,
    zoom: 7,
    capital: 'Dispur',
    cities: [
      { name: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362, zoom: 13, district: 'Kamrup Metropolitan', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 55 },
      { name: 'Silchar', state: 'Assam', lat: 24.8333, lng: 92.7789, zoom: 13, district: 'Cachar', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 22 },
      { name: 'Dibrugarh', state: 'Assam', lat: 27.4728, lng: 94.9120, zoom: 13, district: 'Dibrugarh', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 108 },
      { name: 'Jorhat', state: 'Assam', lat: 26.7509, lng: 94.2037, zoom: 13, district: 'Jorhat', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 116 },
      { name: 'Tezpur', state: 'Assam', lat: 26.6528, lng: 92.7926, zoom: 13, district: 'Sonitpur', tier: 'Tier-3', monsoonVulnerability: 'High', elevationMeters: 48 }
    ]
  },
  {
    name: 'Bihar',
    type: 'STATE',
    lat: 25.0961,
    lng: 85.3131,
    zoom: 7,
    capital: 'Patna',
    cities: [
      { name: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376, zoom: 13, district: 'Patna', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 53 },
      { name: 'Gaya', state: 'Bihar', lat: 24.7914, lng: 85.0002, zoom: 13, district: 'Gaya', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 111 },
      { name: 'Bhagalpur', state: 'Bihar', lat: 25.2425, lng: 86.9842, zoom: 13, district: 'Bhagalpur', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 52 },
      { name: 'Muzaffarpur', state: 'Bihar', lat: 26.1209, lng: 85.3647, zoom: 13, district: 'Muzaffarpur', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 60 },
      { name: 'Darbhanga', state: 'Bihar', lat: 26.1542, lng: 85.8918, zoom: 13, district: 'Darbhanga', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 52 }
    ]
  },
  {
    name: 'Chhattisgarh',
    type: 'STATE',
    lat: 21.2787,
    lng: 81.8661,
    zoom: 7,
    capital: 'Raipur',
    cities: [
      { name: 'Raipur', state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296, zoom: 13, district: 'Raipur', tier: 'Tier-1', monsoonVulnerability: 'High', elevationMeters: 298 },
      { name: 'Bhilai', state: 'Chhattisgarh', lat: 21.2144, lng: 81.3805, zoom: 13, district: 'Durg', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 297 },
      { name: 'Bilaspur', state: 'Chhattisgarh', lat: 22.0797, lng: 82.1409, zoom: 13, district: 'Bilaspur', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 264 },
      { name: 'Korba', state: 'Chhattisgarh', lat: 22.3595, lng: 82.7501, zoom: 13, district: 'Korba', tier: 'Tier-2', monsoonVulnerability: 'Moderate', elevationMeters: 252 },
      { name: 'Jagdalpur', state: 'Chhattisgarh', lat: 19.0744, lng: 82.0090, zoom: 13, district: 'Bastar', tier: 'Tier-3', monsoonVulnerability: 'High', elevationMeters: 552 }
    ]
  },
  {
    name: 'Goa',
    type: 'STATE',
    lat: 15.2993,
    lng: 74.1240,
    zoom: 9,
    capital: 'Panaji',
    cities: [
      { name: 'Panaji', state: 'Goa', lat: 15.4909, lng: 73.8278, zoom: 13, district: 'North Goa', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 7 },
      { name: 'Margao', state: 'Goa', lat: 15.2832, lng: 73.9862, zoom: 13, district: 'South Goa', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 10 },
      { name: 'Vasco da Gama', state: 'Goa', lat: 15.3982, lng: 73.8113, zoom: 13, district: 'South Goa', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 13 },
      { name: 'Mapusa', state: 'Goa', lat: 15.5937, lng: 73.8143, zoom: 13, district: 'North Goa', tier: 'Tier-3', monsoonVulnerability: 'High', elevationMeters: 15 }
    ]
  },
  {
    name: 'Gujarat',
    type: 'STATE',
    lat: 22.2587,
    lng: 71.1924,
    zoom: 7,
    capital: 'Gandhinagar',
    cities: [
      { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, zoom: 13, district: 'Ahmedabad', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 53 },
      { name: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311, zoom: 13, district: 'Surat', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 13 },
      { name: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812, zoom: 13, district: 'Vadodara', tier: 'Tier-1', monsoonVulnerability: 'High', elevationMeters: 39 },
      { name: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022, zoom: 13, district: 'Rajkot', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 128 },
      { name: 'Bhavnagar', state: 'Gujarat', lat: 21.7645, lng: 72.1519, zoom: 13, district: 'Bhavnagar', tier: 'Tier-2', monsoonVulnerability: 'Moderate', elevationMeters: 24 },
      { name: 'Jamnagar', state: 'Gujarat', lat: 22.4707, lng: 70.0577, zoom: 13, district: 'Jamnagar', tier: 'Tier-2', monsoonVulnerability: 'Moderate', elevationMeters: 20 },
      { name: 'Gandhinagar', state: 'Gujarat', lat: 23.2156, lng: 72.6369, zoom: 13, district: 'Gandhinagar', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 81 }
    ]
  },
  {
    name: 'Haryana',
    type: 'STATE',
    lat: 29.0588,
    lng: 76.0856,
    zoom: 7,
    capital: 'Chandigarh',
    cities: [
      { name: 'Gurugram', state: 'Haryana', lat: 28.4595, lng: 77.0266, zoom: 13, district: 'Gurugram', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 217 },
      { name: 'Faridabad', state: 'Haryana', lat: 28.4089, lng: 77.3178, zoom: 13, district: 'Faridabad', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 198 },
      { name: 'Panipat', state: 'Haryana', lat: 29.3909, lng: 76.9635, zoom: 13, district: 'Panipat', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 219 },
      { name: 'Ambala', state: 'Haryana', lat: 30.3782, lng: 76.7767, zoom: 13, district: 'Ambala', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 264 },
      { name: 'Karnal', state: 'Haryana', lat: 29.6857, lng: 76.9905, zoom: 13, district: 'Karnal', tier: 'Tier-2', monsoonVulnerability: 'Moderate', elevationMeters: 228 },
      { name: 'Rohtak', state: 'Haryana', lat: 28.8955, lng: 76.6066, zoom: 13, district: 'Rohtak', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 220 }
    ]
  },
  {
    name: 'Himachal Pradesh',
    type: 'STATE',
    lat: 31.1048,
    lng: 77.1734,
    zoom: 7,
    capital: 'Shimla',
    cities: [
      { name: 'Shimla', state: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734, zoom: 13, district: 'Shimla', tier: 'Tier-2', monsoonVulnerability: 'Moderate', elevationMeters: 2206 },
      { name: 'Dharamshala', state: 'Himachal Pradesh', lat: 32.2190, lng: 76.3234, zoom: 13, district: 'Kangra', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 1457 },
      { name: 'Solan', state: 'Himachal Pradesh', lat: 30.9045, lng: 77.0967, zoom: 13, district: 'Solan', tier: 'Tier-3', monsoonVulnerability: 'Moderate', elevationMeters: 1502 },
      { name: 'Mandi', state: 'Himachal Pradesh', lat: 31.7087, lng: 76.9320, zoom: 13, district: 'Mandi', tier: 'Tier-3', monsoonVulnerability: 'High', elevationMeters: 760 },
      { name: 'Kullu', state: 'Himachal Pradesh', lat: 31.9579, lng: 77.1095, zoom: 13, district: 'Kullu', tier: 'Tier-3', monsoonVulnerability: 'Moderate', elevationMeters: 1279 }
    ]
  },
  {
    name: 'Jharkhand',
    type: 'STATE',
    lat: 23.6102,
    lng: 85.2799,
    zoom: 7,
    capital: 'Ranchi',
    cities: [
      { name: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096, zoom: 13, district: 'Ranchi', tier: 'Tier-1', monsoonVulnerability: 'High', elevationMeters: 651 },
      { name: 'Jamshedpur', state: 'Jharkhand', lat: 22.8046, lng: 86.2029, zoom: 13, district: 'East Singhbhum', tier: 'Tier-1', monsoonVulnerability: 'High', elevationMeters: 135 },
      { name: 'Dhanbad', state: 'Jharkhand', lat: 23.7957, lng: 86.4304, zoom: 13, district: 'Dhanbad', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 227 },
      { name: 'Bokaro Steel City', state: 'Jharkhand', lat: 23.6693, lng: 86.1511, zoom: 13, district: 'Bokaro', tier: 'Tier-2', monsoonVulnerability: 'Moderate', elevationMeters: 210 },
      { name: 'Deoghar', state: 'Jharkhand', lat: 24.4826, lng: 86.7001, zoom: 13, district: 'Deoghar', tier: 'Tier-3', monsoonVulnerability: 'Moderate', elevationMeters: 254 }
    ]
  },
  {
    name: 'Karnataka',
    type: 'STATE',
    lat: 15.3173,
    lng: 75.7139,
    zoom: 7,
    capital: 'Bengaluru',
    cities: [
      { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946, zoom: 13, district: 'Bengaluru Urban', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 920 },
      { name: 'Mysuru', state: 'Karnataka', lat: 12.2958, lng: 76.6394, zoom: 13, district: 'Mysuru', tier: 'Tier-2', monsoonVulnerability: 'Moderate', elevationMeters: 770 },
      { name: 'Mangaluru', state: 'Karnataka', lat: 12.9141, lng: 74.8560, zoom: 13, district: 'Dakshina Kannada', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 22 },
      { name: 'Hubballi-Dharwad', state: 'Karnataka', lat: 15.3647, lng: 75.1240, zoom: 13, district: 'Dharwad', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 671 },
      { name: 'Belagavi', state: 'Karnataka', lat: 15.8497, lng: 74.4977, zoom: 13, district: 'Belagavi', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 762 },
      { name: 'Kalaburagi', state: 'Karnataka', lat: 17.3297, lng: 76.8343, zoom: 13, district: 'Kalaburagi', tier: 'Tier-2', monsoonVulnerability: 'Moderate', elevationMeters: 454 },
      { name: 'Shivamogga', state: 'Karnataka', lat: 13.9299, lng: 75.5681, zoom: 13, district: 'Shivamogga', tier: 'Tier-3', monsoonVulnerability: 'High', elevationMeters: 569 }
    ]
  },
  {
    name: 'Kerala',
    type: 'STATE',
    lat: 10.8505,
    lng: 76.2711,
    zoom: 7,
    capital: 'Thiruvananthapuram',
    cities: [
      { name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673, zoom: 13, district: 'Ernakulam', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 3 },
      { name: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366, zoom: 13, district: 'Thiruvananthapuram', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 10 },
      { name: 'Kozhikode', state: 'Kerala', lat: 11.2588, lng: 75.7804, zoom: 13, district: 'Kozhikode', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 1 },
      { name: 'Thrissur', state: 'Kerala', lat: 10.5276, lng: 76.2144, zoom: 13, district: 'Thrissur', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 2.8 },
      { name: 'Kollam', state: 'Kerala', lat: 8.8932, lng: 76.6141, zoom: 13, district: 'Kollam', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 3 },
      { name: 'Alappuzha', state: 'Kerala', lat: 9.4981, lng: 76.3388, zoom: 13, district: 'Alappuzha', tier: 'Tier-3', monsoonVulnerability: 'Critical', elevationMeters: 1 }
    ]
  },
  {
    name: 'Madhya Pradesh',
    type: 'STATE',
    lat: 22.9734,
    lng: 78.6569,
    zoom: 7,
    capital: 'Bhopal',
    cities: [
      { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, zoom: 13, district: 'Indore', tier: 'Tier-1', monsoonVulnerability: 'High', elevationMeters: 553 },
      { name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126, zoom: 13, district: 'Bhopal', tier: 'Tier-1', monsoonVulnerability: 'High', elevationMeters: 527 },
      { name: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864, zoom: 13, district: 'Jabalpur', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 411 },
      { name: 'Gwalior', state: 'Madhya Pradesh', lat: 26.2183, lng: 78.1828, zoom: 13, district: 'Gwalior', tier: 'Tier-2', monsoonVulnerability: 'Moderate', elevationMeters: 211 },
      { name: 'Ujjain', state: 'Madhya Pradesh', lat: 23.1765, lng: 75.7885, zoom: 13, district: 'Ujjain', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 494 },
      { name: 'Sagar', state: 'Madhya Pradesh', lat: 23.8388, lng: 78.7378, zoom: 13, district: 'Sagar', tier: 'Tier-3', monsoonVulnerability: 'Moderate', elevationMeters: 528 }
    ]
  },
  {
    name: 'Maharashtra',
    type: 'STATE',
    lat: 19.7515,
    lng: 75.7139,
    zoom: 7,
    capital: 'Mumbai',
    cities: [
      { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, zoom: 13, district: 'Mumbai Suburban', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 14 },
      { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, zoom: 13, district: 'Pune', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 560 },
      { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882, zoom: 13, district: 'Nagpur', tier: 'Tier-1', monsoonVulnerability: 'High', elevationMeters: 310 },
      { name: 'Thane', state: 'Maharashtra', lat: 19.2183, lng: 72.9781, zoom: 13, district: 'Thane', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 8 },
      { name: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898, zoom: 13, district: 'Nashik', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 600 },
      { name: 'Aurangabad', state: 'Maharashtra', lat: 19.8762, lng: 75.3433, zoom: 13, district: 'Chhatrapati Sambhajinagar', tier: 'Tier-2', monsoonVulnerability: 'Moderate', elevationMeters: 569 },
      { name: 'Solapur', state: 'Maharashtra', lat: 17.6599, lng: 75.9064, zoom: 13, district: 'Solapur', tier: 'Tier-2', monsoonVulnerability: 'Moderate', elevationMeters: 458 },
      { name: 'Kolhapur', state: 'Maharashtra', lat: 16.7050, lng: 74.2433, zoom: 13, district: 'Kolhapur', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 569 },
      { name: 'Navi Mumbai', state: 'Maharashtra', lat: 19.0330, lng: 73.0297, zoom: 13, district: 'Thane', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 10 }
    ]
  },
  {
    name: 'Manipur',
    type: 'STATE',
    lat: 24.6637,
    lng: 93.9063,
    zoom: 8,
    capital: 'Imphal',
    cities: [
      { name: 'Imphal', state: 'Manipur', lat: 24.8170, lng: 93.9368, zoom: 13, district: 'Imphal West', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 786 },
      { name: 'Churachandpur', state: 'Manipur', lat: 24.3333, lng: 93.6833, zoom: 13, district: 'Churachandpur', tier: 'Tier-3', monsoonVulnerability: 'Moderate', elevationMeters: 922 },
      { name: 'Thoubal', state: 'Manipur', lat: 24.6394, lng: 93.9998, zoom: 13, district: 'Thoubal', tier: 'Tier-3', monsoonVulnerability: 'High', elevationMeters: 770 }
    ]
  },
  {
    name: 'Meghalaya',
    type: 'STATE',
    lat: 25.4670,
    lng: 91.3662,
    zoom: 8,
    capital: 'Shillong',
    cities: [
      { name: 'Shillong', state: 'Meghalaya', lat: 25.5788, lng: 91.8933, zoom: 13, district: 'East Khasi Hills', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 1525 },
      { name: 'Tura', state: 'Meghalaya', lat: 25.5142, lng: 90.2033, zoom: 13, district: 'West Garo Hills', tier: 'Tier-3', monsoonVulnerability: 'High', elevationMeters: 349 },
      { name: 'Jowai', state: 'Meghalaya', lat: 25.4526, lng: 92.2035, zoom: 13, district: 'West Jaintia Hills', tier: 'Tier-3', monsoonVulnerability: 'High', elevationMeters: 1380 }
    ]
  },
  {
    name: 'Mizoram',
    type: 'STATE',
    lat: 23.1645,
    lng: 92.9376,
    zoom: 8,
    capital: 'Aizawl',
    cities: [
      { name: 'Aizawl', state: 'Mizoram', lat: 23.7271, lng: 92.7176, zoom: 13, district: 'Aizawl', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 1132 },
      { name: 'Lunglei', state: 'Mizoram', lat: 22.8878, lng: 92.7369, zoom: 13, district: 'Lunglei', tier: 'Tier-3', monsoonVulnerability: 'Moderate', elevationMeters: 722 },
      { name: 'Champhai', state: 'Mizoram', lat: 23.4756, lng: 93.3283, zoom: 13, district: 'Champhai', tier: 'Tier-3', monsoonVulnerability: 'Moderate', elevationMeters: 1334 }
    ]
  },
  {
    name: 'Nagaland',
    type: 'STATE',
    lat: 26.1584,
    lng: 94.5624,
    zoom: 8,
    capital: 'Kohima',
    cities: [
      { name: 'Kohima', state: 'Nagaland', lat: 25.6751, lng: 94.1086, zoom: 13, district: 'Kohima', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 1444 },
      { name: 'Dimapur', state: 'Nagaland', lat: 25.9090, lng: 93.7265, zoom: 13, district: 'Dimapur', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 145 },
      { name: 'Mokokchung', state: 'Nagaland', lat: 26.3250, lng: 94.5200, zoom: 13, district: 'Mokokchung', tier: 'Tier-3', monsoonVulnerability: 'Moderate', elevationMeters: 1325 }
    ]
  },
  {
    name: 'Odisha',
    type: 'STATE',
    lat: 20.9517,
    lng: 85.0985,
    zoom: 7,
    capital: 'Bhubaneswar',
    cities: [
      { name: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245, zoom: 13, district: 'Khurda', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 45 },
      { name: 'Cuttack', state: 'Odisha', lat: 20.4625, lng: 85.8828, zoom: 13, district: 'Cuttack', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 36 },
      { name: 'Rourkela', state: 'Odisha', lat: 22.2604, lng: 84.8536, zoom: 13, district: 'Sundargarh', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 219 },
      { name: 'Puri', state: 'Odisha', lat: 19.8135, lng: 85.8312, zoom: 13, district: 'Puri', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 0 },
      { name: 'Sambalpur', state: 'Odisha', lat: 21.4669, lng: 83.9812, zoom: 13, district: 'Sambalpur', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 135 },
      { name: 'Berhampur', state: 'Odisha', lat: 19.3150, lng: 84.7941, zoom: 13, district: 'Ganjam', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 26 }
    ]
  },
  {
    name: 'Punjab',
    type: 'STATE',
    lat: 31.1471,
    lng: 75.3412,
    zoom: 7,
    capital: 'Chandigarh',
    cities: [
      { name: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573, zoom: 13, district: 'Ludhiana', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 244 },
      { name: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723, zoom: 13, district: 'Amritsar', tier: 'Tier-1', monsoonVulnerability: 'High', elevationMeters: 234 },
      { name: 'Jalandhar', state: 'Punjab', lat: 31.3260, lng: 75.5762, zoom: 13, district: 'Jalandhar', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 228 },
      { name: 'Patiala', state: 'Punjab', lat: 30.3398, lng: 76.3869, zoom: 13, district: 'Patiala', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 250 },
      { name: 'Bathinda', state: 'Punjab', lat: 30.2110, lng: 74.9455, zoom: 13, district: 'Bathinda', tier: 'Tier-2', monsoonVulnerability: 'Moderate', elevationMeters: 201 }
    ]
  },
  {
    name: 'Rajasthan',
    type: 'STATE',
    lat: 27.0238,
    lng: 74.2179,
    zoom: 6,
    capital: 'Jaipur',
    cities: [
      { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, zoom: 13, district: 'Jaipur', tier: 'Tier-1', monsoonVulnerability: 'High', elevationMeters: 431 },
      { name: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243, zoom: 13, district: 'Jodhpur', tier: 'Tier-2', monsoonVulnerability: 'Moderate', elevationMeters: 231 },
      { name: 'Kota', state: 'Rajasthan', lat: 25.2138, lng: 75.8648, zoom: 13, district: 'Kota', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 271 },
      { name: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125, zoom: 13, district: 'Udaipur', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 598 },
      { name: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lng: 73.3119, zoom: 13, district: 'Bikaner', tier: 'Tier-2', monsoonVulnerability: 'Low', elevationMeters: 242 },
      { name: 'Ajmer', state: 'Rajasthan', lat: 26.4499, lng: 74.6399, zoom: 13, district: 'Ajmer', tier: 'Tier-2', monsoonVulnerability: 'Moderate', elevationMeters: 480 }
    ]
  },
  {
    name: 'Sikkim',
    type: 'STATE',
    lat: 27.5330,
    lng: 88.5122,
    zoom: 9,
    capital: 'Gangtok',
    cities: [
      { name: 'Gangtok', state: 'Sikkim', lat: 27.3389, lng: 88.6065, zoom: 13, district: 'East Sikkim', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 1650 },
      { name: 'Namchi', state: 'Sikkim', lat: 27.1667, lng: 88.3500, zoom: 13, district: 'South Sikkim', tier: 'Tier-3', monsoonVulnerability: 'Moderate', elevationMeters: 1315 },
      { name: 'Geyzing', state: 'Sikkim', lat: 27.2833, lng: 88.2500, zoom: 13, district: 'West Sikkim', tier: 'Tier-3', monsoonVulnerability: 'Moderate', elevationMeters: 1900 }
    ]
  },
  {
    name: 'Tamil Nadu',
    type: 'STATE',
    lat: 11.1271,
    lng: 78.6569,
    zoom: 7,
    capital: 'Chennai',
    cities: [
      { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, zoom: 13, district: 'Chennai', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 6 },
      { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558, zoom: 13, district: 'Coimbatore', tier: 'Tier-1', monsoonVulnerability: 'High', elevationMeters: 411 },
      { name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198, zoom: 13, district: 'Madurai', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 101 },
      { name: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.7905, lng: 78.7047, zoom: 13, district: 'Tiruchirappalli', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 85 },
      { name: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.1460, zoom: 13, district: 'Salem', tier: 'Tier-2', monsoonVulnerability: 'Moderate', elevationMeters: 278 },
      { name: 'Tirunelveli', state: 'Tamil Nadu', lat: 8.7139, lng: 77.7567, zoom: 13, district: 'Tirunelveli', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 47 },
      { name: 'Vellore', state: 'Tamil Nadu', lat: 12.9165, lng: 79.1325, zoom: 13, district: 'Vellore', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 216 }
    ]
  },
  {
    name: 'Telangana',
    type: 'STATE',
    lat: 18.1124,
    lng: 79.0193,
    zoom: 7,
    capital: 'Hyderabad',
    cities: [
      { name: 'Hyderabad', state: 'Telangana', lat: 17.4156, lng: 78.4352, zoom: 13, district: 'Hyderabad Urban', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 542 },
      { name: 'Warangal', state: 'Telangana', lat: 17.9689, lng: 79.5941, zoom: 13, district: 'Hanamkonda', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 266 },
      { name: 'Nizamabad', state: 'Telangana', lat: 18.6725, lng: 78.0941, zoom: 13, district: 'Nizamabad', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 395 },
      { name: 'Karimnagar', state: 'Telangana', lat: 18.4386, lng: 79.1288, zoom: 13, district: 'Karimnagar', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 265 },
      { name: 'Khammam', state: 'Telangana', lat: 17.2473, lng: 80.1514, zoom: 13, district: 'Khammam', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 107 },
      { name: 'Ramagundam', state: 'Telangana', lat: 18.7557, lng: 79.5134, zoom: 13, district: 'Peddapalli', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 179 },
      { name: 'Mahbubnagar', state: 'Telangana', lat: 16.7488, lng: 77.9856, zoom: 13, district: 'Mahabubnagar', tier: 'Tier-3', monsoonVulnerability: 'Moderate', elevationMeters: 498 }
    ]
  },
  {
    name: 'Tripura',
    type: 'STATE',
    lat: 23.9408,
    lng: 91.9882,
    zoom: 8,
    capital: 'Agartala',
    cities: [
      { name: 'Agartala', state: 'Tripura', lat: 23.8315, lng: 91.2868, zoom: 13, district: 'West Tripura', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 12.8 },
      { name: 'Dharmanagar', state: 'Tripura', lat: 24.3833, lng: 92.1667, zoom: 13, district: 'North Tripura', tier: 'Tier-3', monsoonVulnerability: 'High', elevationMeters: 21 },
      { name: 'Udaipur', state: 'Tripura', lat: 23.5333, lng: 91.4833, zoom: 13, district: 'Gomati', tier: 'Tier-3', monsoonVulnerability: 'High', elevationMeters: 22 }
    ]
  },
  {
    name: 'Uttar Pradesh',
    type: 'STATE',
    lat: 26.8467,
    lng: 80.9462,
    zoom: 6,
    capital: 'Lucknow',
    cities: [
      { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, zoom: 13, district: 'Lucknow', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 123 },
      { name: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319, zoom: 13, district: 'Kanpur Nagar', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 126 },
      { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, zoom: 13, district: 'Varanasi', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 80 },
      { name: 'Noida', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910, zoom: 13, district: 'Gautam Buddha Nagar', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 200 },
      { name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081, zoom: 13, district: 'Agra', tier: 'Tier-1', monsoonVulnerability: 'High', elevationMeters: 171 },
      { name: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463, zoom: 13, district: 'Prayagraj', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 98 },
      { name: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.6692, lng: 77.4538, zoom: 13, district: 'Ghaziabad', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 213 },
      { name: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lng: 77.7064, zoom: 13, district: 'Meerut', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 219 },
      { name: 'Bareilly', state: 'Uttar Pradesh', lat: 28.3670, lng: 79.4304, zoom: 13, district: 'Bareilly', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 166 },
      { name: 'Gorakhpur', state: 'Uttar Pradesh', lat: 26.7606, lng: 83.3732, zoom: 13, district: 'Gorakhpur', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 84 }
    ]
  },
  {
    name: 'Uttarakhand',
    type: 'STATE',
    lat: 30.0668,
    lng: 79.0193,
    zoom: 7,
    capital: 'Dehradun',
    cities: [
      { name: 'Dehradun', state: 'Uttarakhand', lat: 30.3165, lng: 78.0322, zoom: 13, district: 'Dehradun', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 435 },
      { name: 'Haridwar', state: 'Uttarakhand', lat: 29.9457, lng: 78.1642, zoom: 13, district: 'Haridwar', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 314 },
      { name: 'Roorkee', state: 'Uttarakhand', lat: 29.8543, lng: 77.8880, zoom: 13, district: 'Haridwar', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 268 },
      { name: 'Haldwani', state: 'Uttarakhand', lat: 29.2183, lng: 79.5130, zoom: 13, district: 'Nainital', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 424 },
      { name: 'Rishikesh', state: 'Uttarakhand', lat: 30.0869, lng: 78.2676, zoom: 13, district: 'Dehradun', tier: 'Tier-3', monsoonVulnerability: 'High', elevationMeters: 340 }
    ]
  },
  {
    name: 'West Bengal',
    type: 'STATE',
    lat: 22.9868,
    lng: 87.8550,
    zoom: 7,
    capital: 'Kolkata',
    cities: [
      { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, zoom: 13, district: 'Kolkata Urban', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 9 },
      { name: 'Howrah', state: 'West Bengal', lat: 22.5958, lng: 88.2636, zoom: 13, district: 'Howrah', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 12 },
      { name: 'Siliguri', state: 'West Bengal', lat: 26.7271, lng: 88.3953, zoom: 13, district: 'Darjeeling/Jalpaiguri', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 122 },
      { name: 'Durgapur', state: 'West Bengal', lat: 23.5204, lng: 87.3119, zoom: 13, district: 'Paschim Bardhaman', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 65 },
      { name: 'Asansol', state: 'West Bengal', lat: 23.6739, lng: 86.9524, zoom: 13, district: 'Paschim Bardhaman', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 97 },
      { name: 'Kharagpur', state: 'West Bengal', lat: 22.3460, lng: 87.2320, zoom: 13, district: 'Paschim Medinipur', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 61 }
    ]
  },

  // ================= 8 UNION TERRITORIES =================
  {
    name: 'Andaman and Nicobar Islands',
    type: 'UNION_TERRITORY',
    lat: 11.7401,
    lng: 92.6586,
    zoom: 8,
    capital: 'Port Blair',
    cities: [
      { name: 'Port Blair', state: 'Andaman and Nicobar Islands', lat: 11.6234, lng: 92.7265, zoom: 13, district: 'South Andaman', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 16 },
      { name: 'Diglipur', state: 'Andaman and Nicobar Islands', lat: 13.2667, lng: 93.0000, zoom: 13, district: 'North and Middle Andaman', tier: 'Tier-3', monsoonVulnerability: 'High', elevationMeters: 43 },
      { name: 'Mayabunder', state: 'Andaman and Nicobar Islands', lat: 12.9167, lng: 92.9333, zoom: 13, district: 'North and Middle Andaman', tier: 'Tier-3', monsoonVulnerability: 'High', elevationMeters: 12 }
    ]
  },
  {
    name: 'Chandigarh',
    type: 'UNION_TERRITORY',
    lat: 30.7333,
    lng: 76.7794,
    zoom: 12,
    capital: 'Chandigarh',
    cities: [
      { name: 'Chandigarh Capital City', state: 'Chandigarh', lat: 30.7333, lng: 76.7794, zoom: 13, district: 'Chandigarh', tier: 'Tier-1', monsoonVulnerability: 'High', elevationMeters: 321 },
      { name: 'Manimajra', state: 'Chandigarh', lat: 30.7167, lng: 76.8333, zoom: 13, district: 'Chandigarh', tier: 'Tier-3', monsoonVulnerability: 'High', elevationMeters: 310 }
    ]
  },
  {
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    type: 'UNION_TERRITORY',
    lat: 20.4283,
    lng: 72.8397,
    zoom: 9,
    capital: 'Daman',
    cities: [
      { name: 'Daman', state: 'Dadra and Nagar Haveli and Daman and Diu', lat: 20.3974, lng: 72.8328, zoom: 13, district: 'Daman', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 5 },
      { name: 'Silvassa', state: 'Dadra and Nagar Haveli and Daman and Diu', lat: 20.2763, lng: 73.0083, zoom: 13, district: 'Dadra and Nagar Haveli', tier: 'Tier-2', monsoonVulnerability: 'High', elevationMeters: 32 },
      { name: 'Diu', state: 'Dadra and Nagar Haveli and Daman and Diu', lat: 20.7144, lng: 70.9874, zoom: 13, district: 'Diu', tier: 'Tier-3', monsoonVulnerability: 'High', elevationMeters: 0 }
    ]
  },
  {
    name: 'Delhi',
    type: 'UNION_TERRITORY',
    lat: 28.7041,
    lng: 77.1025,
    zoom: 11,
    capital: 'New Delhi',
    cities: [
      { name: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090, zoom: 13, district: 'Central Delhi', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 216 },
      { name: 'New Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090, zoom: 13, district: 'New Delhi', tier: 'Tier-1', monsoonVulnerability: 'Critical', elevationMeters: 216 },
      { name: 'Dwarka', state: 'Delhi', lat: 28.5921, lng: 77.0460, zoom: 13, district: 'South West Delhi', tier: 'Tier-1', monsoonVulnerability: 'High', elevationMeters: 218 },
      { name: 'Rohini', state: 'Delhi', lat: 28.7160, lng: 77.1175, zoom: 13, district: 'North West Delhi', tier: 'Tier-1', monsoonVulnerability: 'High', elevationMeters: 214 },
      { name: 'Okhla', state: 'Delhi', lat: 28.5284, lng: 77.2792, zoom: 13, district: 'South East Delhi', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 212 }
    ]
  },
  {
    name: 'Jammu and Kashmir',
    type: 'UNION_TERRITORY',
    lat: 33.7782,
    lng: 76.5762,
    zoom: 7,
    capital: 'Srinagar / Jammu',
    cities: [
      { name: 'Srinagar', state: 'Jammu and Kashmir', lat: 34.0837, lng: 74.7973, zoom: 13, district: 'Srinagar', tier: 'Tier-1', monsoonVulnerability: 'High', elevationMeters: 1585 },
      { name: 'Jammu', state: 'Jammu and Kashmir', lat: 32.7266, lng: 74.8570, zoom: 13, district: 'Jammu', tier: 'Tier-1', monsoonVulnerability: 'High', elevationMeters: 327 },
      { name: 'Anantnag', state: 'Jammu and Kashmir', lat: 33.7311, lng: 75.1522, zoom: 13, district: 'Anantnag', tier: 'Tier-2', monsoonVulnerability: 'Moderate', elevationMeters: 1600 },
      { name: 'Baramulla', state: 'Jammu and Kashmir', lat: 34.1980, lng: 74.3636, zoom: 13, district: 'Baramulla', tier: 'Tier-2', monsoonVulnerability: 'Moderate', elevationMeters: 1593 }
    ]
  },
  {
    name: 'Ladakh',
    type: 'UNION_TERRITORY',
    lat: 34.1526,
    lng: 77.5771,
    zoom: 7,
    capital: 'Leh',
    cities: [
      { name: 'Leh', state: 'Ladakh', lat: 34.1526, lng: 77.5771, zoom: 13, district: 'Leh', tier: 'Tier-2', monsoonVulnerability: 'Low', elevationMeters: 3500 },
      { name: 'Kargil', state: 'Ladakh', lat: 34.5539, lng: 76.1349, zoom: 13, district: 'Kargil', tier: 'Tier-3', monsoonVulnerability: 'Low', elevationMeters: 2676 }
    ]
  },
  {
    name: 'Lakshadweep',
    type: 'UNION_TERRITORY',
    lat: 10.5667,
    lng: 72.6417,
    zoom: 9,
    capital: 'Kavaratti',
    cities: [
      { name: 'Kavaratti', state: 'Lakshadweep', lat: 10.5667, lng: 72.6417, zoom: 13, district: 'Lakshadweep', tier: 'Tier-3', monsoonVulnerability: 'Critical', elevationMeters: 1 },
      { name: 'Agatti', state: 'Lakshadweep', lat: 10.8533, lng: 72.1906, zoom: 13, district: 'Lakshadweep', tier: 'Tier-3', monsoonVulnerability: 'Critical', elevationMeters: 1 },
      { name: 'Andrott', state: 'Lakshadweep', lat: 10.8200, lng: 73.6800, zoom: 13, district: 'Lakshadweep', tier: 'Tier-3', monsoonVulnerability: 'High', elevationMeters: 1 }
    ]
  },
  {
    name: 'Puducherry',
    type: 'UNION_TERRITORY',
    lat: 11.9416,
    lng: 79.8083,
    zoom: 11,
    capital: 'Puducherry',
    cities: [
      { name: 'Puducherry', state: 'Puducherry', lat: 11.9416, lng: 79.8083, zoom: 13, district: 'Puducherry', tier: 'Tier-2', monsoonVulnerability: 'Critical', elevationMeters: 3 },
      { name: 'Karaikal', state: 'Puducherry', lat: 10.9254, lng: 79.8380, zoom: 13, district: 'Karaikal', tier: 'Tier-3', monsoonVulnerability: 'Critical', elevationMeters: 4 },
      { name: 'Mahe', state: 'Puducherry', lat: 11.7000, lng: 75.5333, zoom: 13, district: 'Mahe', tier: 'Tier-3', monsoonVulnerability: 'Critical', elevationMeters: 5 },
      { name: 'Yanam', state: 'Puducherry', lat: 16.7333, lng: 82.2167, zoom: 13, district: 'Yanam', tier: 'Tier-3', monsoonVulnerability: 'High', elevationMeters: 2 }
    ]
  }
];

/**
 * DEEP URBAN GIS GEODATA FOR HYDERABAD (HERO CITY)
 * Realistic urban geometry for Ward 12 Banjara Hills, Jubilee Hills, Khairatabad & surrounding corridors.
 */

// 1. Hyderabad Administrative Ward Boundaries
export interface WardBoundary {
  wardNumber: number;
  wardName: string;
  zone: string;
  populationDensity: string;
  riskRating: 'CRITICAL' | 'HIGH' | 'MODERATE';
  coordinates: [number, number][];
}

export const HYDERABAD_WARD_BOUNDARIES: WardBoundary[] = [
  {
    wardNumber: 12,
    wardName: 'Ward 12 (Banjara Hills / Road 12)',
    zone: 'Khairatabad Zone',
    populationDensity: 'High (18,400/sq.km)',
    riskRating: 'CRITICAL',
    coordinates: [
      [17.4260, 78.4230],
      [17.4285, 78.4410],
      [17.4190, 78.4490],
      [17.4080, 78.4430],
      [17.4060, 78.4270],
      [17.4140, 78.4210]
    ]
  },
  {
    wardNumber: 10,
    wardName: 'Ward 10 (Jubilee Hills / Road 36)',
    zone: 'Khairatabad Zone',
    populationDensity: 'Medium (12,800/sq.km)',
    riskRating: 'HIGH',
    coordinates: [
      [17.4380, 78.3980],
      [17.4420, 78.4210],
      [17.4280, 78.4230],
      [17.4200, 78.4060],
      [17.4250, 78.3940]
    ]
  },
  {
    wardNumber: 15,
    wardName: 'Ward 15 (Khairatabad / Somajiguda)',
    zone: 'Khairatabad Zone',
    populationDensity: 'Very High (24,200/sq.km)',
    riskRating: 'CRITICAL',
    coordinates: [
      [17.4240, 78.4520],
      [17.4320, 78.4680],
      [17.4150, 78.4720],
      [17.4050, 78.4550],
      [17.4120, 78.4480]
    ]
  },
  {
    wardNumber: 8,
    wardName: 'Ward 8 (Shaikpet / Tolichowki)',
    zone: 'Charminar / Golconda Zone',
    populationDensity: 'High (21,000/sq.km)',
    riskRating: 'HIGH',
    coordinates: [
      [17.4080, 78.3980],
      [17.4140, 78.4210],
      [17.4060, 78.4270],
      [17.3920, 78.4120],
      [17.3960, 78.3920]
    ]
  }
];

// 2. Real Hyderabad Water Bodies & Retention Lakes
export interface WaterBodyFeature {
  id: string;
  name: string;
  type: 'LAKE' | 'RETENTION_SUMP' | 'RESERVOIR';
  areaSqKm: number;
  overflowRisk: 'HIGH' | 'MODERATE' | 'LOW';
  coordinates: [number, number][];
}

export const HYDERABAD_WATER_BODIES: WaterBodyFeature[] = [
  {
    id: 'wb-hussain-sagar',
    name: 'Hussain Sagar Lake',
    type: 'LAKE',
    areaSqKm: 5.7,
    overflowRisk: 'HIGH',
    coordinates: [
      [17.4350, 78.4650],
      [17.4380, 78.4780],
      [17.4270, 78.4850],
      [17.4150, 78.4780],
      [17.4180, 78.4660]
    ]
  },
  {
    id: 'wb-durgam-cheruvu',
    name: 'Durgam Cheruvu (Secret Lake)',
    type: 'LAKE',
    areaSqKm: 0.65,
    overflowRisk: 'HIGH',
    coordinates: [
      [17.4380, 78.3840],
      [17.4430, 78.3910],
      [17.4340, 78.3950],
      [17.4300, 78.3880]
    ]
  },
  {
    id: 'wb-banjara-lake',
    name: 'Banjara Lake (Taj Banjara Catchment)',
    type: 'LAKE',
    areaSqKm: 0.12,
    overflowRisk: 'HIGH',
    coordinates: [
      [17.4180, 78.4420],
      [17.4200, 78.4460],
      [17.4160, 78.4475],
      [17.4145, 78.4435]
    ]
  },
  {
    id: 'wb-lotus-pond',
    name: 'Lotus Pond Natural Retention Sump',
    type: 'RETENTION_SUMP',
    areaSqKm: 0.05,
    overflowRisk: 'MODERATE',
    coordinates: [
      [17.4185, 78.4160],
      [17.4205, 78.4180],
      [17.4180, 78.4195],
      [17.4165, 78.4175]
    ]
  }
];

// 3. Real Arterial Roads & Neighborhood Street Network
export interface RoadNetworkFeature {
  id: string;
  name: string;
  category: 'EXPRESSWAY' | 'ARTERIAL' | 'COLLECTOR_STREET';
  coordinates: [number, number][];
}

export const HYDERABAD_ROAD_NETWORK: RoadNetworkFeature[] = [
  // Road No. 12 Banjara Hills (Directly passing hero VG-1042)
  {
    id: 'rd-banjara-12',
    name: 'Road No. 12, Banjara Hills',
    category: 'ARTERIAL',
    coordinates: [
      [17.4120, 78.4280],
      [17.4142, 78.4325],
      [17.4156, 78.4352],
      [17.4178, 78.4395],
      [17.4210, 78.4440]
    ]
  },
  // Road No. 1 Banjara Hills (Main Spine)
  {
    id: 'rd-banjara-1',
    name: 'Banjara Hills Main Road (Road No. 1)',
    category: 'ARTERIAL',
    coordinates: [
      [17.4230, 78.4480],
      [17.4215, 78.4420],
      [17.4200, 78.4350],
      [17.4190, 78.4280],
      [17.4180, 78.4200]
    ]
  },
  // Road No. 36 Jubilee Hills
  {
    id: 'rd-jubilee-36',
    name: 'Road No. 36 Jubilee Hills Corridor',
    category: 'ARTERIAL',
    coordinates: [
      [17.4320, 78.4020],
      [17.4345, 78.4090],
      [17.4370, 78.4170],
      [17.4390, 78.4240]
    ]
  },
  // Khairatabad Flyover & Raj Bhavan Road
  {
    id: 'rd-raj-bhavan',
    name: 'Raj Bhavan Road / Somajiguda Axis',
    category: 'ARTERIAL',
    coordinates: [
      [17.4150, 78.4550],
      [17.4200, 78.4580],
      [17.4260, 78.4610],
      [17.4320, 78.4630]
    ]
  },
  // PVNR / Inner Ring Road link
  {
    id: 'rd-inner-ring',
    name: 'Inner Ring Road / Mehdipatnam Arterial',
    category: 'EXPRESSWAY',
    coordinates: [
      [17.3950, 78.4300],
      [17.4020, 78.4360],
      [17.4080, 78.4420],
      [17.4140, 78.4490]
    ]
  }
];

// 4. Realistic 3D Building Massing & Urban Parcels (Banjara Hills Sector)
export interface BuildingMassingFeature {
  id: string;
  name: string;
  heightMeters: number;
  levels: string;
  type: 'COMMERCIAL_COMPLEX' | 'HOSPITAL_HUB' | 'RESIDENTIAL_HIGHRISE' | 'CONSTRUCTION_EXCAVATION';
  coordinates: [number, number][];
}

export const HYDERABAD_BUILDING_MASSING: BuildingMassingFeature[] = [
  {
    id: 'bldg-1',
    name: 'Road 12 Commercial Plaza (G+6)',
    heightMeters: 24,
    levels: 'G+6',
    type: 'COMMERCIAL_COMPLEX',
    coordinates: [
      [17.4162, 78.4344],
      [17.4167, 78.4344],
      [17.4167, 78.4351],
      [17.4162, 78.4351]
    ]
  },
  {
    id: 'bldg-2',
    name: 'NBT Nagar Residential Block A',
    heightMeters: 18,
    levels: 'G+4',
    type: 'RESIDENTIAL_HIGHRISE',
    coordinates: [
      [17.4151, 78.4340],
      [17.4155, 78.4340],
      [17.4155, 78.4347],
      [17.4151, 78.4347]
    ]
  },
  {
    id: 'bldg-3',
    name: 'Virinchi Healthcare & Diagnostic Wing',
    heightMeters: 38,
    levels: 'G+10',
    type: 'HOSPITAL_HUB',
    coordinates: [
      [17.4172, 78.4358],
      [17.4180, 78.4358],
      [17.4180, 78.4369],
      [17.4172, 78.4369]
    ]
  },
  {
    id: 'bldg-4',
    name: 'Banjara Heights Luxury Towers',
    heightMeters: 45,
    levels: 'G+12',
    type: 'RESIDENTIAL_HIGHRISE',
    coordinates: [
      [17.4144, 78.4356],
      [17.4150, 78.4356],
      [17.4150, 78.4365],
      [17.4144, 78.4365]
    ]
  },
  {
    id: 'bldg-excavation-vg1042',
    name: 'Target Excavation Pit (VG-1042 Site)',
    heightMeters: -4, // Sub-grade foundation pit
    levels: 'Basement Excavation (-4m)',
    type: 'CONSTRUCTION_EXCAVATION',
    coordinates: [
      [17.4154, 78.4350],
      [17.4158, 78.4350],
      [17.4158, 78.4354],
      [17.4154, 78.4354]
    ]
  }
];

// 5. Drainage & Municipal Stormwater Nala Network
export interface DrainageVectorFeature {
  id: string;
  name: string;
  condition: 'CRITICAL_BLOCKAGE' | 'MODERATE_SILT' | 'FREE_FLOW';
  flowDirection: string;
  coordinates: [number, number][];
}

export const HYDERABAD_DRAINAGE_VECTORS: DrainageVectorFeature[] = [
  {
    id: 'drain-banjara-nala-main',
    name: 'Banjara Hills Primary Stormwater Collector Nala',
    condition: 'CRITICAL_BLOCKAGE',
    flowDirection: 'NW → SE towards Hussain Sagar',
    coordinates: [
      [17.4220, 78.4280],
      [17.4180, 78.4330],
      [17.4155, 78.4352],
      [17.4125, 78.4390],
      [17.4100, 78.4450],
      [17.4160, 78.4620]
    ]
  },
  {
    id: 'drain-jubilee-feeder',
    name: 'Jubilee Hills Valley Storm Drain Interceptor',
    condition: 'MODERATE_SILT',
    flowDirection: 'W → E towards Banjara Nala',
    coordinates: [
      [17.4280, 78.4060],
      [17.4230, 78.4160],
      [17.4180, 78.4330]
    ]
  }
];

// 6. Construction Risk Zones & Excavation Sites (Hyderabad)
export interface ConstructionRiskZone {
  id: string;
  name: string;
  riskFactor: string;
  coordinates: [number, number][];
}

export const HYDERABAD_CONSTRUCTION_ZONES: ConstructionRiskZone[] = [
  {
    id: 'cz-road12-excavation',
    name: 'Road No. 12 Sub-Structure Foundation Excavation',
    riskFactor: 'Deep basement pit with exposed water table',
    coordinates: [
      [17.4150, 78.4346],
      [17.4162, 78.4346],
      [17.4162, 78.4358],
      [17.4150, 78.4358]
    ]
  },
  {
    id: 'cz-jubilee-metro-verge',
    name: 'Jubilee Hills Road 36 Metro Pillar Foundation Zone',
    riskFactor: 'Excavation perimeter retaining stormwater runoff',
    coordinates: [
      [17.4360, 78.4140],
      [17.4375, 78.4140],
      [17.4375, 78.4165],
      [17.4360, 78.4165]
    ]
  }
];

const STATE_FIXED_HOTSPOT_IDS: Record<string, string> = {
  'Arunachal Pradesh': 'VG-1050',
  'Chhattisgarh': 'VG-1051',
  'Goa': 'VG-1052',
  'Haryana': 'VG-1053',
  'Himachal Pradesh': 'VG-1054',
  'Jharkhand': 'VG-1055',
  'Manipur': 'VG-1056',
  'Meghalaya': 'VG-1057',
  'Mizoram': 'VG-1058',
  'Nagaland': 'VG-1059',
  'Punjab': 'VG-1060',
  'Sikkim': 'VG-1061',
  'Tripura': 'VG-1062',
  'Uttarakhand': 'VG-1063',
  'Andaman and Nicobar Islands': 'VG-1064',
  'Dadra and Nagar Haveli and Daman and Diu': 'VG-1065',
  'Jammu and Kashmir': 'VG-1066',
  'Ladakh': 'VG-1067',
  'Lakshadweep': 'VG-1068',
  'Puducherry': 'VG-1069',
};

/**
 * Ensures all 28 States and 8 Union Territories have realistic representative demo hotspots
 * distributed across their representative cities (e.g. Telangana across Hyderabad, Warangal, Nizamabad, Karimnagar, Khammam).
 * Preserves existing hero/detailed hotspots completely intact and guarantees unique IDs.
 */
export function getCompleteHotspotsDataset(existingHotspots: HotspotRecord[]): HotspotRecord[] {
  const result: HotspotRecord[] = [];
  const existingIds = new Set<string>();
  const coveredStateCities = new Map<string, Set<string>>();

  // 1. Add and normalize existing hotspots while filtering any pre-existing duplicates by ID
  for (const raw of existingHotspots) {
    if (!raw || !raw.hotspot_id || existingIds.has(raw.hotspot_id)) continue;
    existingIds.add(raw.hotspot_id);

    const score = Math.round(Number(raw.breeding_risk_score ?? (raw as any).risk_score ?? (raw as any).breedingRiskScore ?? 0));
    let level: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
    if (raw.risk_level && ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'].includes(raw.risk_level.toUpperCase())) {
      level = raw.risk_level.toUpperCase() as any;
    } else {
      if (score >= 81) level = 'CRITICAL';
      else if (score >= 61) level = 'HIGH';
      else if (score >= 31) level = 'MODERATE';
      else level = 'LOW';
    }

    const state = raw.state || 'Telangana';
    const city = raw.city || 'Hyderabad';
    const stateKey = state.trim().toLowerCase();
    const cityKey = city.trim().toLowerCase();

    if (!coveredStateCities.has(stateKey)) {
      coveredStateCities.set(stateKey, new Set());
    }
    coveredStateCities.get(stateKey)!.add(cityKey);

    const normalized: HotspotRecord = {
      ...raw,
      country: raw.country || 'India',
      state,
      city,
      local_area: raw.local_area || raw.locality || `${city} Central`,
      ward: raw.ward || `${city} Ward 01`,
      ward_number: Number(raw.ward_number || 1),
      location: raw.location || raw.local_area || `${city} Survey Site`,
      locality: raw.locality || raw.local_area || `${city} Urban`,
      latitude: Number(raw.latitude),
      longitude: Number(raw.longitude),
      rainfall: Number(raw.rainfall || 30),
      temperature: Number(raw.temperature || 29),
      humidity: Number(raw.humidity || 75),
      drainage_condition: raw.drainage_condition || (level === 'CRITICAL' ? 'Severely Blocked' : level === 'HIGH' ? 'Poor' : 'Moderate'),
      construction_activity: raw.construction_activity || 'None',
      historical_risk: Number(raw.historical_risk ?? Math.max(0, score - 5)),
      water_retention_prediction: Number(raw.water_retention_prediction ?? score),
      visual_score: Number(raw.visual_score ?? (raw as any).visual_condition_score ?? score),
      environmental_score: Number(raw.environmental_score ?? Math.max(0, score - 4)),
      breeding_risk_score: score,
      risk_level: level,
      imagery_source: raw.imagery_source || 'TARGETED DRONE',
      imagery_level: raw.imagery_level || 'LEVEL_3_DRONE',
      visual_detection: raw.visual_detection || `${raw.site_type || 'Site'} stormwater retention`,
      cv_result: raw.cv_result || {
        detectedCondition: level === 'CRITICAL' ? 'CRITICAL STAGNATION DETECTED' : 'SURFACE WATER RETENTION',
        confidence: 90,
        tags: ['Standing Water', 'Runoff Pool'],
        boundingAreaDescription: `${city} drainage area (~60 sq.m)`,
        surfaceType: 'Earth and masonry drainage channel',
        estimatedAreaSqMeters: 60
      },
      recommended_action: raw.recommended_action || (level === 'CRITICAL' ? 'Immediate de-watering + larvicide application' : 'Routine de-silting and larvicide spraying'),
      status: raw.status || 'OPEN',
      assigned_team: raw.assigned_team || null,
      assigned_officer: raw.assigned_officer || null,
      assigned_officer_id: raw.assigned_officer_id || null,
      site_type: raw.site_type || 'Stormwater Drain',
      before_image_url: raw.before_image_url || DEMO_EVIDENCE_IMAGES.vg1042_before,
      after_image_url: raw.after_image_url || DEMO_EVIDENCE_IMAGES.vg1042_after,
      created_at: raw.created_at || '2026-09-08T06:00:00Z',
      updated_at: raw.updated_at || '2026-09-08T07:00:00Z'
    };
    result.push(normalized);
  }

  let nextIdCounter = 1060;

  // 2. Iterate through all 28 States and 8 UTs (every city without truncating)
  ALL_INDIAN_STATES_AND_UTS.forEach(stateInfo => {
    const stateKey = stateInfo.name.trim().toLowerCase();
    const existingCitiesForState = coveredStateCities.get(stateKey) || new Set<string>();

    stateInfo.cities.forEach((cityInfo, index) => {
      const cityKey = cityInfo.name.trim().toLowerCase();

      // If this city already has a hotspot in this state, keep existing
      if (existingCitiesForState.has(cityKey)) {
        return;
      }

      // Mark city as covered
      existingCitiesForState.add(cityKey);
      if (!coveredStateCities.has(stateKey)) {
        coveredStateCities.set(stateKey, existingCitiesForState);
      }

      // Generate a collision-proof ID
      while (existingIds.has(`VG-${nextIdCounter}`)) {
        nextIdCounter++;
      }
      const newId = `VG-${nextIdCounter++}`;
      existingIds.add(newId);

      // Deterministic, balanced risk scoring ensuring all 4 risk levels exist in every state
      let baseScore = 50;
      const riskTier = index % 4;
      if (riskTier === 0) {
        // CRITICAL: 81-100 (Red)
        baseScore = 82 + ((index * 3) % 13); // 82 to 94
      } else if (riskTier === 1) {
        // HIGH: 61-80 (Orange)
        baseScore = 63 + ((index * 2) % 16); // 63 to 78
      } else if (riskTier === 2) {
        // MODERATE: 31-60 (Amber/Yellow)
        baseScore = 36 + ((index * 3) % 22); // 36 to 57
      } else {
        // LOW: 0-30 (Green)
        baseScore = 14 + ((index * 2) % 15); // 14 to 28
      }

      const isCritical = baseScore >= 81;
      const isHigh = baseScore >= 61 && baseScore < 81;
      const isModerate = baseScore >= 31 && baseScore < 61;
      const riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' = 
        isCritical ? 'CRITICAL' : isHigh ? 'HIGH' : isModerate ? 'MODERATE' : 'LOW';

      // Realistic site types & descriptions based on index
      const siteTypes: Array<HotspotRecord['site_type']> = [
        'Stormwater Drain', 
        'Construction Site', 
        'Low-Lying Vacant Plot', 
        'Roadside Depressions', 
        'Residential Basement'
      ];
      const selectedSiteType = siteTypes[index % siteTypes.length];

      result.push({
        hotspot_id: newId,
        country: 'India',
        region: stateInfo.type === 'UNION_TERRITORY' ? 'Union Territory' : `${stateInfo.name} Region`,
        state: stateInfo.name,
        city: cityInfo.name,
        local_area: `${cityInfo.name} Central Zone`,
        ward: `Ward 0${index + 1} (${cityInfo.name} ${index % 2 === 0 ? 'North' : 'South'} Sector)`,
        ward_number: index + 1,
        location: `${cityInfo.name} ${selectedSiteType} Sump #${index + 1}`,
        locality: `${cityInfo.district || cityInfo.name} Urban`,
        latitude: Number(cityInfo.lat),
        longitude: Number(cityInfo.lng),
        rainfall: 20 + (index * 4),
        temperature: 28.5 + (index % 3),
        humidity: 72 + (index % 15),
        drainage_condition: isCritical ? 'Severely Blocked' : isHigh ? 'Poor' : isModerate ? 'Moderate' : 'Good',
        construction_activity: selectedSiteType === 'Construction Site' ? 'Active Excavation' : 'None',
        historical_risk: Math.max(0, baseScore - 5),
        water_retention_prediction: baseScore,
        visual_score: baseScore,
        environmental_score: Math.max(0, baseScore - 2),
        breeding_risk_score: baseScore,
        risk_level: riskLevel,
        imagery_source: 'Targeted drone survey (DEMO / PILOT DATA — ILLUSTRATIVE)',
        imagery_level: 'LEVEL_3_DRONE',
        visual_detection: `${selectedSiteType} retaining surface runoff in municipal basin`,
        cv_result: {
          detectedCondition: isCritical 
            ? 'CRITICAL STAGNATION & FOUNDATION SUMP' 
            : isHigh 
            ? 'ELEVATED RUNOFF PONDING DETECTED'
            : isModerate
            ? 'MODERATE SURFACE WATER RETENTION'
            : 'NORMAL RUNOFF DISSIPATION PROFILE',
          confidence: 88 + (index % 8),
          tags: ['Standing Water', selectedSiteType, 'Monsoon Runoff', 'Drainage Sump'],
          supportingObservations: [
            'Visible municipal basin drainage line',
            'Runoff retention pattern recorded',
            'Sediment and surface water observation'
          ],
          boundingAreaDescription: `${cityInfo.name} collector depression (~${60 + index * 10} sq.m)`,
          surfaceType: selectedSiteType === 'Construction Site' ? 'Excavated soil foundation' : 'Asphalt and earth verge',
          estimatedAreaSqMeters: 60 + index * 10
        },
        recommended_action: isCritical 
          ? 'Urgent de-watering + debris clearance + Bti larvicide application' 
          : isHigh
          ? 'Channel desilting + prophylactic larvicide application'
          : isModerate
          ? 'Routine de-silting and bi-weekly vector surveillance'
          : 'Baseline monthly survey; no immediate intervention required',
        status: 'OPEN',
        assigned_team: null,
        assigned_officer: null,
        assigned_officer_id: null,
        ai_explanation: `AI evaluated water retention risk in ${cityInfo.name}, ${stateInfo.name} with score ${baseScore}/100 (${riskLevel}).`,
        site_type: selectedSiteType,
        before_image_url: DEMO_EVIDENCE_IMAGES.vg1042_before,
        after_image_url: DEMO_EVIDENCE_IMAGES.vg1042_after,
        created_at: '2026-09-08T06:00:00Z',
        updated_at: '2026-09-08T07:00:00Z'
      });
    });
  });

  return result;
}

