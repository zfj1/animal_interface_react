import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Plot from 'react-plotly.js';

export default function Dashboard() {    
    const navigate = useNavigate();
    const location = useLocation();

    const totalAnimals = 310;  // Current number of animals
    const maxAnimals = 400;    // Maximum permitted number

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <h2>Animal Colony Stats</h2>

            {/* Gauge Chart: Total vs. Max Animals */}
            <div style={{ position: 'relative', textAlign: 'center' }}>
                <Plot
                    data={[
                        {
                            domain: { x: [0, 1], y: [0, 1] },
                            value: totalAnimals,
                            title: { text: 'Total Animals' },
                            type: 'indicator',
                            mode: 'gauge+number',
                            number: {
                            suffix: ` / ${maxAnimals} 🚨`,  // Adds "/ 400 🚨" next to the number
                        },
                            gauge: {
                                axis: { range: [0, maxAnimals] },
                                bar: { color: 'darkblue' }, // Indicator color
                                steps: [
                                    { range: [0, maxAnimals * 0.5], color: 'lightgray' },
                                    { range: [maxAnimals * 0.5, maxAnimals * 0.8], color: 'lightyellow' },
                                    { range: [maxAnimals * 0.8, maxAnimals], color: 'red' },
                                ],
                            },
                        },
                    ]}
                    layout={{ width: 400, height: 300 }}
                />
    
            </div>

            {/* Responsive Container for Pie Charts */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',  // Allows wrapping on smaller screens
                justifyContent: 'center',  // Centers items
                gap: '20px',
                maxWidth: '900px',  // Prevents stretching on large screens
            }}>
                {/* Pie Chart: Male vs. Female */}
                <Plot
                    data={[
                        {
                            labels: ['Male', 'Female'],
                            values: [45, 55],
                            type: 'pie',
                            marker: { colors: ['blue', 'pink'] }, 
                        },
                    ]}
                    layout={{ width: 400, height: 400, title: {text:'Sex Distribution'}}}
                />

                {/* Pie Chart: Genotype Distribution */}
                <Plot
                    data={[
                        {
                            labels: ['Genotype A', 'Genotype B', 'Genotype C'],
                            values: [30, 50, 20],
                            type: 'pie',
                        },
                    ]}
                    layout={{ width: 400, height: 400, title: {text:'Genotype Distribution'} }}
                />
            </div>
        </div>  
    );
};
