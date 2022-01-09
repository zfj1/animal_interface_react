import BarcodeScannerComponent from 'react-qr-barcode-scanner';

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


export default function Scanner() {    
    // const [code, setCode] = useState('Scan a barcode or QR code');
    const navigate = useNavigate();
    const location = useLocation();

    return (
            <BarcodeScannerComponent
        // captureSize = {{width: 1280, height: 720}}
        onUpdate = {(err, res) => {
            if (res.text !== undefined) {
                // set(res.text);
                navigate(`/cages/${res.text}`, {state: {from: location.pathname}});
                // TODO: should just navigate to /cages with cage as state
            }
        }}
      />
    );
};

