import React, { useState, useRef, useEffect } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';

const GOOGLE_API_KEY = 'AIzaSyAs0kh_tMgeH19DErLHhIKVAJ644V_UWrU';
const OFFICE_ADDRESS = '1408 SE 17th Avenue, Cape Coral, FL 33990';

const PricingCalculator = () => {
  const [manualSF, setManualSF] = useState('');
  const [manualMiles, setManualMiles] = useState('');
  const [googleAddress, setGoogleAddress] = useState('');
  const [googleMiles, setGoogleMiles] = useState(null);
  const [googleSF, setGoogleSF] = useState(10000); // Temporary default for testing
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries: ['places'],
  });

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      inputRef.current.placeholder = OFFICE_ADDRESS;
    }
  }, [isLoaded]);

  const calculateGoogleDistance = async (destination) => {
    try {
      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [OFFICE_ADDRESS],
          destinations: [destination],
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === 'OK') {
            const distanceText = response.rows[0].elements[0].distance.text;
            const miles = parseFloat(distanceText.replace(/[^0-9.]/g, ''));
            setGoogleMiles(miles);
          } else {
            console.error('Distance Matrix failed:', status);
            setGoogleMiles(null);
          }
        }
      );
    } catch (err) {
      console.error('Distance Matrix error:', err);
      setGoogleMiles(null);
    }
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.formatted_address) {
      setGoogleAddress(place.formatted_address);
      calculateGoogleDistance(place.formatted_address);
      setGoogleSF(10000); // Set a default SF for Google to test output
    }
  };

  const roundToNearest50 = (value) => {
    return Math.round(value / 50) * 50;
  };

const calculateQuote = (sfInput, milesInput) => {
  const sf = parseFloat(sfInput);
  const miles = parseFloat(milesInput);

  if (isNaN(sf) || isNaN(miles) || sf <= 0 || miles <= 0) return null;

  if (sf > 100000) return 'Over 100,000 - Contact Jim for pricing';

  const baseFee = 750;
  const extraSF = Math.max(0, sf - 5000);
  const sfFee = extraSF * 0.05;
  const mileageFee = miles * 1.5;
  const total = baseFee + sfFee + mileageFee;

  return `$${roundToNearest50(total)}`;
};

  const manualQuote = calculateQuote(Number(manualSF), Number(manualMiles));
  const googleQuote = calculateQuote(Number(googleSF), Number(googleMiles));

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded shadow-lg">
      <h1 className="text-4xl font-bold text-center text-[#0F4C81] mb-10 drop-shadow-sm">Pricing Calculator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-[#F5F8FA] p-6 rounded-lg shadow border-t-4 border-[#0F4C81]">
          <h2 className="text-xl font-semibold text-[#0F4C81] mb-4">Manual Input</h2>
          <label className="block mb-2 text-sm font-medium text-gray-700">Square Footage</label>
          <input
            type="number"
            placeholder="Enter square footage"
            className="w-full p-3 border border-gray-300 rounded mb-4 focus:ring-2 focus:ring-[#0F4C81]"
            value={manualSF}
            onChange={(e) => setManualSF(e.target.value)}
          />
          <label className="block mb-2 text-sm font-medium text-gray-700">Mileage</label>
          <input
            type="number"
            placeholder="Enter mileage"
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#0F4C81]"
            value={manualMiles}
            onChange={(e) => setManualMiles(e.target.value)}
          />
        </div>

        <div className="bg-[#F5F8FA] p-6 rounded-lg shadow border-t-4 border-[#6CA635]">
          <h2 className="text-xl font-semibold text-[#6CA635] mb-4">Lookup by Address</h2>
          {isLoaded ? (
            <Autocomplete
              onLoad={(ref) => (autocompleteRef.current = ref)}
              onPlaceChanged={handlePlaceChanged}
            >
              <input
                ref={inputRef}
                type="text"
                defaultValue=""
                placeholder="Start typing address..."
                className="w-full p-3 border border-gray-300 rounded mb-4 focus:ring-2 focus:ring-[#6CA635]"
              />
            </Autocomplete>
          ) : (
            <input
              type="text"
              disabled
              placeholder="Loading Google Maps..."
              className="w-full p-3 border border-gray-300 rounded bg-gray-100 text-gray-500 mb-4"
            />
          )}

          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Address:</strong> {googleAddress || '—'}</p>
            <p><strong>Mileage:</strong> {googleMiles !== null ? `${googleMiles} mi` : '—'}</p>
            <p><strong>Square Footage:</strong> {googleSF !== null ? `${googleSF} SF` : 'Not available'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="bg-[#0F4C81] text-white border border-[#0F4C81] p-6 rounded text-center shadow-sm">
          <h3 className="text-xl font-semibold">Manual Estimate</h3>
          <p className="text-4xl mt-3 font-bold">
            {manualQuote !== null ? manualQuote : '—'}
          </p>
        </div>

        <div className="bg-[#6CA635] text-white border border-[#6CA635] p-6 rounded text-center shadow-sm">
          <h3 className="text-xl font-semibold">Google-Based Estimate</h3>
          <p className="text-4xl mt-3 font-bold">
            {googleMiles && googleSF ? googleQuote : '—'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;
