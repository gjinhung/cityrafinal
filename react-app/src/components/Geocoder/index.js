// import Geocoder from "react-geocoder";
// import React, { useState } from "react";

// export function Geocode() {
//     const [city, setCity] = useState("");
//     const [state, setState] = useState("");
//     const [lat, setLat] = useState("");
//     const [lng, setLng] = useState("");

//     const handleChange = (e) => {
//         setCity(e.target.value);
//     };

//     const handleStateChange = (e) => {
//         setState(e.target.value);
//     };

//     const validateAddress = async () => {

//         const fullAddress = `${address}, ${city}, ${state}, ${zip_code}`;
//         const apiKey = API_KEY;
//         const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${apiKey}`;

//         try {
//             const response = await fetch(url);

//             const data = await response.json();
//             return data.status === 'OK';
//         } catch (error) {
//             console.error('Error:', error);
//             return false;
//         }
//     };

//     return (
//         <div>
//             <input
//                 type="text"
//                 placeholder="City"
//                 value={city}
//                 onChange={handleChange}
//             />
//             <input
//                 type="text"
//                 placeholder="State"
//                 value={state}
//                 onChange={handleStateChange}
//             />
//             <button onClick={handleGeocode}>Geocode</button>
//             <p>Latitude: {lat}</p>
//             <p>Longitude: {lng}</p>
//         </div>
//     );
// };