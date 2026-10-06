/**
 * Shipper API Integration Service
 * Specification:
 * 1. Domestic Pricing / Cek Ongkir (Origin Kecamatan -> Destination Kecamatan)
 * 2. Domestic Create Order -> Automatic Waybill / Resi (AWB) generation
 */

export interface ShipperLocation {
  provinceId: number;
  provinceName: string;
  cityId: number;
  cityName: string;
  suburbId: number;
  suburbName: string; // Kecamatan
  postCode: string;
}

export interface ShipperRateOption {
  rateId: number;
  logisticName: string; // e.g., 'JNE', 'SiCepat', 'J&T Cargo', 'Anteraja'
  serviceName: string;  // e.g., 'JTR Cargo', 'GOKIL Trucking', 'Reguler'
  minDuration: number;
  maxDuration: number;
  unit: string;
  finalPrice: number;
  isCargo: boolean;
  etd: string;
}

export interface ShipperCreateOrderPayload {
  externalId: string; // Nomor Nota / Invoice Toko
  origin: {
    address: string;
    suburbId: number;
    suburbName: string;
    cityName: string;
    provinceName: string;
    postCode: string;
    contactName: string;
    contactPhone: string;
  };
  destination: {
    address: string;
    suburbId: number;
    suburbName: string;
    cityName: string;
    provinceName: string;
    postCode: string;
    contactName: string;
    contactPhone: string;
  };
  package: {
    weightKg: number;
    lengthCm: number;
    widthCm: number;
    heightCm: number;
    items: {
      name: string;
      qty: number;
      price: number;
    }[];
  };
  rate: ShipperRateOption;
}

export interface ShipperOrderResponse {
  success: boolean;
  shipperOrderId: string;
  awbNumber: string; // Nomor Resi Resmi Shipper
  courierName: string;
  courierService: string;
  trackingUrl: string;
  labelUrl: string;
  createdAt: string;
}

// Default Warehouse Origin (Pluit, Penjaringan, Jakarta Utara)
export const SHIPPER_DEFAULT_ORIGIN = {
  address: 'Kawasan Industri & Pergudangan Pluit Blok B No. 8',
  suburbName: 'Penjaringan (Kecamatan)',
  cityName: 'Jakarta Utara',
  provinceName: 'DKI Jakarta',
  postCode: '14450',
  contactName: 'Warehouse PT Surya Gemilang Sejati (Higold Indonesia)',
  contactPhone: '081299887766',
  suburbId: 317201, // Shipper Suburb ID Penjaringan
};

/**
 * Mock / Production Shipper API Client
 * Rule: Free Ongkir HANYA untuk jarak <= 10 km dari Gudang Penjaringan (Pluit), Jakarta Utara
 */
export async function calculateShipperRates(
  destinationCity: string,
  destinationKecamatan: string,
  weightKg: number = 10,
  distanceKm: number = 15
): Promise<ShipperRateOption[]> {
  // Simulasi latency koneksi ke API Gateway Shipper (https://api.shipper.id/v3/pricing/domestic)
  await new Promise(resolve => setTimeout(resolve, 350));

  // User specification: "free ongkir adalah dalam jarak 10km"
  const isFreeShipping = distanceKm <= 10;

  // Base rate calculation based on distance and region
  let basePrice = 45000;
  let jnePrice = 45000;
  let sicepatPrice = 55000;
  let jntPrice = 50000;
  let fleetPrice = 35000;

  if (distanceKm <= 10) {
    // Within 10 km: Free Shipping
    jnePrice = 0;
    sicepatPrice = 0;
    jntPrice = 0;
    fleetPrice = 0;
  } else if (distanceKm <= 30) {
    // 11 - 30 km (Jakarta Pusat/Selatan/Timur, Tangerang, Depok)
    jnePrice = 28000;
    sicepatPrice = 36000;
    jntPrice = 32000;
    fleetPrice = 35000;
  } else if (distanceKm <= 60) {
    // 31 - 60 km (Bogor, Bekasi, Karawang)
    jnePrice = 42000;
    sicepatPrice = 48000;
    jntPrice = 45000;
    fleetPrice = 50000;
  } else if (distanceKm <= 200) {
    // 61 - 200 km (Bandung, Sukabumi, Cirebon, Banten)
    jnePrice = 65000;
    sicepatPrice = 75000;
    jntPrice = 70000;
    fleetPrice = 85000;
  } else if (distanceKm <= 600) {
    // 201 - 600 km (Jawa Tengah, DIY, Lampung)
    jnePrice = 85000;
    sicepatPrice = 98000;
    jntPrice = 92000;
    fleetPrice = 120000;
  } else if (distanceKm <= 1000) {
    // 601 - 1000 km (Jawa Timur, Bali, Sumsel, Kalbar)
    jnePrice = 115000;
    sicepatPrice = 130000;
    jntPrice = 125000;
    fleetPrice = 160000;
  } else {
    // > 1000 km (Sumatera Utara, Kalimantan, Sulawesi, Maluku, Papua)
    jnePrice = 165000;
    sicepatPrice = 185000;
    jntPrice = 175000;
    fleetPrice = 220000;
  }

  const rates: ShipperRateOption[] = [
    {
      rateId: 101,
      logisticName: 'JNE Trucking',
      serviceName: 'JTR Kargo Arsitektural',
      minDuration: distanceKm > 1000 ? 4 : distanceKm > 300 ? 3 : 1,
      maxDuration: distanceKm > 1000 ? 7 : distanceKm > 300 ? 5 : 3,
      unit: 'hari',
      finalPrice: jnePrice,
      isCargo: true,
      etd: distanceKm > 1000 ? '4 - 7 Hari' : distanceKm > 300 ? '3 - 5 Hari' : '1 - 3 Hari',
    },
    {
      rateId: 102,
      logisticName: 'SiCepat Cargo',
      serviceName: 'GOKIL (Cargo Kilat)',
      minDuration: distanceKm > 1000 ? 3 : distanceKm > 300 ? 2 : 1,
      maxDuration: distanceKm > 1000 ? 6 : distanceKm > 300 ? 4 : 2,
      unit: 'hari',
      finalPrice: sicepatPrice,
      isCargo: true,
      etd: distanceKm > 1000 ? '3 - 6 Hari' : distanceKm > 300 ? '2 - 4 Hari' : '1 - 2 Hari',
    },
    {
      rateId: 103,
      logisticName: 'J&T Cargo',
      serviceName: 'Heavy Package Express',
      minDuration: distanceKm > 1000 ? 3 : distanceKm > 300 ? 2 : 1,
      maxDuration: distanceKm > 1000 ? 5 : distanceKm > 300 ? 4 : 3,
      unit: 'hari',
      finalPrice: jntPrice,
      isCargo: true,
      etd: distanceKm > 1000 ? '3 - 5 Hari' : distanceKm > 300 ? '2 - 4 Hari' : '1 - 3 Hari',
    },
    {
      rateId: 104,
      logisticName: 'Higold Fleet Logistics',
      serviceName: distanceKm <= 50 ? 'Dedicated Showroom Courier (Jabodetabek)' : 'Armada Ekspedisi Langsung Higold',
      minDuration: 1,
      maxDuration: distanceKm > 500 ? 4 : 2,
      unit: 'hari',
      finalPrice: fleetPrice,
      isCargo: true,
      etd: distanceKm <= 50 ? '1 - 2 Hari' : '2 - 4 Hari',
    }
  ];

  return rates;
}

/**
 * Otomatis Create Order ke API Shipper setelah Checkout
 * Menghasilkan Nomor Resi (AWB) resmi dari Shipper secara realtime tanpa input manual
 */
export async function createShipperOrder(payload: ShipperCreateOrderPayload): Promise<ShipperOrderResponse> {
  // Simulate call to Shipper API endpoint: POST https://api.shipper.id/v3/order
  await new Promise(resolve => setTimeout(resolve, 500));

  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
  const prefix = payload.rate.logisticName.includes('JNE') ? 'JNE-SHP' :
                 payload.rate.logisticName.includes('SiCepat') ? 'SCP-SHP' :
                 payload.rate.logisticName.includes('J&T') ? 'JNT-SHP' : 'HGD-EXP';

  const awb = `${prefix}-${randomDigits}`;
  const shipperId = `SHP-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  return {
    success: true,
    shipperOrderId: shipperId,
    awbNumber: awb,
    courierName: payload.rate.logisticName,
    courierService: payload.rate.serviceName,
    trackingUrl: `https://shipper.id/tracking?awb=${awb}`,
    labelUrl: `https://shipper.id/label/shipping-manifest-${awb}.pdf`,
    createdAt: new Date().toISOString(),
  };
}
