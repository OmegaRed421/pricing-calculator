const [inputText, setInputText] = useState('');

...

<Autocomplete
  onLoad={(ref) => (autocompleteRef.current = ref)}
  onPlaceChanged={() => {
    handlePlaceChanged();
    // Optional: lock the text once a valid place is selected
    const place = autocompleteRef.current.getPlace();
    if (place && place.formatted_address) {
      setInputText(place.formatted_address);
    }
  }}
>
  <input
    ref={inputRef}
    type="text"
    value={inputText}
    onChange={(e) => setInputText(e.target.value)}
    placeholder="Enter property address"
    className="w-full p-3 border border-gray-300 rounded mb-4 focus:ring-2 focus:ring-[#6CA635]"
  />
</Autocomplete>
🔁 And update your handlePlaceChanged to:
js
Copy
Edit
const handlePlaceChanged = () => {
  const place = autocompleteRef.current.getPlace();
  if (place && place.formatted_address) {
    setGoogleAddress(place.formatted_address);
    calculateGoogleDistance(place.formatted_address);
    setGoogleSF(10000);
  }
};
🧠 Why this works
By binding the input field to inputText, you stop Google from hijacking the input box — React remains in control. Then when a full place is selected, you update both the visual field (inputText) and the internal state (googleAddress, googleMiles, etc.).

Let me know if you want it to revert back to a blank input after selection or keep the chosen address shown (both are easy tweaks).








You said:
can you just recreate that code please, Im not comfortable just editing a piece of it


ChatGPT said:
Absolutely — here is the fully updated PricingCalculator.jsx file, fully integrated with the fix for the Google address input glitch.

This version:

Adds a inputText state for controlling the address input box.

Updates onChange to keep typing smooth.

Updates onPlaceChanged to finalize the address after selection.

Preserves the design and structure you already had.

✅ Updated Full Code
jsx
Copy
Edit
import React, { useState, useRef, useEffect } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';

const GOOGLE_API_KEY = 'AIzaSyAs0kh_tMgeH19DErLHhIKVAJ644V_UWrU';
const OFFICE_ADDRESS = '1408 SE 17th Avenue, Cape Coral, FL 33990';

const PricingCalculator = () => {
  const [manualSF, setManualSF] = useState('');
  const [manualMiles, setManualMiles] = useState('');
  const [inputText, setInputText] = useState('');
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
      const formatted = place.formatted_address;
      setGoogleAddress(formatted);
      setInputText(formatted); // Set text box to show chosen place
      calculateGoogleDistance(formatted);
      setGoogleSF(10000); // Placeholder SF value
    }
  };

  const calculateQuote = (sf, miles) => {
    if (!sf || !miles) return null;
    if (sf > 100000) return 'Over 100,000 - Contact Jim for pricing';

    let baseFee = 750;
    const extraSF = Math.max(0, sf - 5000);
    const sfFee = extraSF * 0.05;
    const mileageFee = miles * 1.5;
    return `$${(baseFee + sfFee + mileageFee).toFixed(2)}`;
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
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter property address"
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
        <div className="bg-[#E3EDF5] border border-[#B3C8DD] p-6 rounded text-center shadow-sm">
          <h3 className="text-xl font-semibold text-[#0F4C81]">Manual Estimate</h3>
          <p className="text-4xl mt-3 font-bold text-[#0F4C81]">
            {manualQuote !== null ? manualQuote : '—'}
          </p>
        </div>

        <div className="bg-[#F0F8EB] border border-[#A7D28D] p-6 rounded text-center shadow-sm">
          <h3 className="text-xl font-semibold text-[#6CA635]">Google-Based Estimate</h3>
          <p className="text-4xl mt-3 font-bold text-[#6CA635]">
            {googleMiles && googleSF ? googleQuote : '—'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;