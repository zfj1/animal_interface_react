import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Plot from 'react-plotly.js';

export default function Dashboard() {    
    const navigate = useNavigate();
    const location = useLocation();

    const [data, setData] = useState([]);
    const [selectedStrain, setSelectedStrain] = useState("All");
    const [selectedProtocol, setSelectedProtocol] = useState("All");

    // Fetch strain data from the server
    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_ADDRESS}/strains`)
            .then(resp => resp.json())
            .then(resp => setData(resp.data));
    }, []);

    console.log("Full Data:", data);

    // Extract strain names dynamically
    const strains = ["All", ...new Set(data.map(strain => strain.strain_name))];

    // Fake protocol options
    const protocols = ["All", "Protocol 1", "Protocol 2", "Protocol 3"];

    // Filter data based on strain selection (protocol selection not applied yet)
    const filteredData = selectedStrain === "All" 
        ? data 
        : data.filter(strain => strain.strain_name === selectedStrain);

    // Compute total count dynamically
    const totalAnimals = filteredData.reduce((sum, strain) => sum + strain.count, 0);
    const maxAnimals = data.reduce((sum, strain) => sum + strain.count, 0); // Adjustable threshold

    // Compute male/female counts dynamically
    const totalMales = filteredData.reduce((sum, strain) => sum + strain.n_males, 0);
    const totalFemales = filteredData.reduce((sum, strain) => sum + strain.n_females, 0);

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            height: '100vh',  
            width: '100vw',   
            overflowY: 'auto', 
            justifyContent: 'flex-start',
            padding: '5px'
        }}>
            <h3 style={{ marginBottom: '10px' }}>Colony Stats</h3>

            {/* Filter Bar */}
            <div style={{ 
                display: 'flex', 
                gap: '15px', 
                marginBottom: '15px', 
                justifyContent: 'center', 
                alignItems: 'center' 
            }}>
                <label>
                    <strong>Filter by Strain:</strong>
                    <select value={selectedStrain} onChange={(e) => setSelectedStrain(e.target.value)}>
                        {strains.map((strain) => (
                            <option key={strain} value={strain}>{strain}</option>
                        ))}
                    </select>
                </label>

                <label>
                    <strong>Filter by Protocol:</strong>
                    <select value={selectedProtocol} onChange={(e) => setSelectedProtocol(e.target.value)}>
                        {protocols.map((protocol) => (
                            <option key={protocol} value={protocol}>{protocol}</option>
                        ))}
                    </select>
                </label>
            </div>

            {/* Dynamic Gauge Chart: Total vs. Max Animals */}
            <Plot
                data={[
                    {
                        domain: { x: [0, 1], y: [0, 1] },
                        value: totalAnimals,
                        title: { text: `Total Animals (${selectedStrain})`, font: { size: 16 } },
                        type: 'indicator',
                        mode: 'gauge+number',
                        number: {
                            suffix: ` / ${maxAnimals} 🚨`, 
                            font: { size: 16, color: 'black' }
                        },
                        gauge: {
                            axis: { range: [0, maxAnimals] },
                            bar: { color: 'darkblue' },
                            steps: [
                                { range: [0, maxAnimals * 0.5], color: 'lightgray' },
                                { range: [maxAnimals * 0.5, maxAnimals * 0.8], color: 'lightyellow' },
                                { range: [maxAnimals * 0.8, maxAnimals], color: 'red' },
                            ],
                        },
                    },
                ]}
                layout={{ width: 320, height: 250, margin: { t: 20, b: 20 } }}
            />

            {/* Row for Pie Charts and Histogram */}
            <div style={{
                display: 'flex',
                flexWrap: 'nowrap', 
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px', 
                maxWidth: '900px',
                paddingBottom: '5px',
                flexDirection: window.innerWidth < 800 ? 'column' : 'row',
            }}>

                {/* Dynamic Pie Chart: Male vs. Female */}
                <div style={{ flex: '1 1 33%', maxWidth: '33%' }}>
                    <Plot
                        data={[
                            {
                                labels: ['Male', 'Female'],
                                values: [totalMales, totalFemales],
                                type: 'pie',
                                marker: { colors: ['blue', 'pink'] }, 
                            },
                        ]}
                        layout={{ 
                            title: { text: `Sex Distribution (${selectedStrain})`}, 
                            width: 250, 
                            height: 220,
                            margin: { t: 25, l: 5, r: 5, b: 5 }
                        }}
                    />
                </div>

                {/* Pie Chart: Genotype Distribution (Static for Now) */}
                <div style={{ flex: '1 1 33%', maxWidth: '33%' }}>
                    <Plot
                        data={[
                            {
                                labels: ['Genotype A', 'Genotype B', 'Genotype C'],
                                values: [30, 50, 20], // Placeholder values
                                type: 'pie',
                            },
                        ]}
                        layout={{ 
                            title: { text: 'Genotype Distribution'}, 
                            width: 250, 
                            height: 220,
                            margin: { t: 25, l: 5, r: 5, b: 5 }
                        }}
                    />
                </div>

                {/* Histogram: Age Distribution (Placeholder) */}
                <div style={{ flex: '1 1 33%', maxWidth: '33%' }}>
                    <Plot
                        data={[
                            {
                                x: Array.from({ length: 500 }, () => Math.floor(Math.random() * 24)), // Fake age data
                                type: 'histogram',
                                marker: { color: 'magenta' },
                                autobinx: true,
                            },
                        ]}
                        layout={{ 
                            title: { text: 'Age Distribution (Fake Data)'}, 
                            xaxis: { title: { text: "Age (Months)" } },
                            yaxis: { title: { text: "Count" } },
                            width: 250, 
                            height: 220,
                            margin: { t: 25, l: 35, r: 6, b: 40 }
                        }}
                    />
                </div>
            </div>
        </div>  
    );
}
