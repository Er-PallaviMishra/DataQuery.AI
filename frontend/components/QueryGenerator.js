import { useState } from 'react';

const QueryGenerator = () => {
    const [query, setQuery] = useState('');
    const [sqlQuery, setSqlQuery] = useState('');

    const handleGenerate = async () => {
        const response = await fetch('/api/generate_sql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ natural_language_query: query })
        });
        
        const data = await response.json();
        setSqlQuery(data.sql_query);
    };

    return (
        <div>
            <input 
                type="text" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder="Enter your query in natural language"
            />
            <button onClick={handleGenerate}>Generate SQL</button>
            {sqlQuery && <pre>{sqlQuery}</pre>}
        </div>
    );
};

export default QueryGenerator;
