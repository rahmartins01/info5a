import React, { useState, useEffect } from "react";

export const fetcher = (url) => fetch(url).then((res) => res.json());

export default function App() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cotacoes, setCotacoes] = useState([]);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");

  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${year}${month}${day}`;
  };

  const buscarCotacoes = () => {
    if (!startDate || !endDate) {
      setError("Por favor selecione as datas, isso é necessário para continuarmos.");
      return;
    }
    setError("");
    const formattedStart = formatDate(startDate);
    const formattedEnd = formatDate(endDate);
    setUrl(
      `https://economia.awesomeapi.com.br/json/daily/USD-BRL/365?start_date=${formattedStart}&end_date=${formattedEnd}`
    );
  };

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      try {
        const data = await fetcher(url);
        setCotacoes(data);
      } catch (err) {
        setError("Erro ao buscar cotações :(");
      }
    };

    fetchData();
  }, [url]);

  return (
    <div className="container">
      <h1>Buscar Cotação USD/BRL</h1>
      <div>
        <label>Data Início:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label>Data Fim:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button onClick={buscarCotacoes}>Buscar</button>

      {cotacoes.length > 0 && (
        <div className="results">
          <h2>Resultados:</h2>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Cotação (R$)</th>
              </tr>
            </thead>
            <tbody>
              {cotacoes.map((item) => (
                <tr key={item.timestamp}>
                  <td>{item.create_date}</td>
                  <td>R$ {Number(item.bid).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
