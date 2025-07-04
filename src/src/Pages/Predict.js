// Predict.js

import React, { useState, useEffect, useRef } from 'react';
import '../styles/Predict.css';
import Header from '../components/header';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';
import cibLogo from '../assets/companies/cib.png';
import abuKirLogo from '../assets/companies/abu-kir.gif';
import telecomLogo from '../assets/companies/telecom-egypt.jpg';
import orascomLogo from '../assets/companies/Orascom.jpg';
import tmgLogo from '../assets/companies/TMG.png';
import palmHillsLogo from '../assets/companies/palm-hills.png';
import easternLogo from '../assets/companies/Eastern.png';
import cleopatraLogo from '../assets/companies/Cleopatra.jpg';
import fawryLogo from '../assets/companies/fawry.jpg';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(utc);
dayjs.extend(isSameOrAfter);

const Predict = ({ darkMode, setDarkMode }) => {
  const [selectedStock, setSelectedStock] = useState({ id: 2, name: 'CIB Bank', ticker: 'EGX:CIB' });
  const [search, setSearch] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [actualData, setActualData] = useState([]);
  const [timeScale, setTimeScale] = useState('minute');
  const [nextMove, setNextMove] = useState(null);
  const intervalRef = useRef(null);
  const actualIntervalRef = useRef(null);
  const lastPredictionTimeRef = useRef(null);
  const csvDataRef = useRef([]);
  const actualPointerRef = useRef(0);

  const stocks = [
    { id: 2, name: 'CIB Bank', ticker: 'EGX:CIB', logo: cibLogo },
    { id: 3, name: 'Abu Qir Fertilizers', ticker: 'EGX:ABUK', logo: abuKirLogo },
    { id: 4, name: 'Telecom Egypt', ticker: 'EGX:ETEL', logo: telecomLogo },
    { id: 5, name: 'Orascom Construction', ticker: 'EGX:ORAS', logo: orascomLogo },
    { id: 6, name: 'TMG Holding', ticker: 'EGX:TMGH', logo: tmgLogo },
    { id: 7, name: 'Palm Hills Developments', ticker: 'EGX:PHDC', logo: palmHillsLogo },
    { id: 8, name: 'Eastern Company', ticker: 'EGX:EAST', logo: easternLogo },
    { id: 9, name: 'Cleopatra Hospitals Group', ticker: 'EGX:CLHO', logo: cleopatraLogo },
    { id: 10, name: 'Fawry', ticker: 'EGX:FWRY', logo: fawryLogo }
  ];

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    clearInterval(intervalRef.current);
    clearInterval(actualIntervalRef.current);
    setPredictions([]);
    setActualData([]);
    lastPredictionTimeRef.current = null;
    actualPointerRef.current = 0;
    csvDataRef.current = [];

    const fetchPrediction = () => {
      let url = `http://localhost:3000/api/v1/companies/2/prediction_after`;
      url += lastPredictionTimeRef.current ? `?after=${encodeURIComponent(lastPredictionTimeRef.current)}` : `?after=2025-04-03 12:00:00`;
      axios.get(url).then(res => {
        const pred = res.data?.prediction;
        if (pred?.predicted_open_price && pred?.predicted_for) {
          const formatted = dayjs(pred.predicted_for).format('YYYY-MM-DD HH:mm:ss');
          setPredictions(prev => [...prev, {
            datetime: formatted,
            predicted_open_price: Number(pred.predicted_open_price)
          }]);
          lastPredictionTimeRef.current = formatted;
          setNextMove(pred.predicted_next_move === 1 ? 'UP' : 'DOWN');
        }
      });
    };

    const loadCsvData = async () => {
      const res = await fetch('/data/cib_stock.csv');
      const text = await res.text();
      const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
      const headers = lines[0].split(',');
      const datetimeIndex = headers.findIndex(h => h.toLowerCase().includes('datetime'));
      const openIndex = headers.findIndex(h => h.toLowerCase() === 'open');
      const rawData = lines.slice(1).map(row => {
        const cols = row.split(',');
        const dt = dayjs(cols[datetimeIndex]).format('YYYY-MM-DD HH:mm:ss');
        const open = parseFloat(cols[openIndex]);
        return { datetime: dt, actual_open_price: isNaN(open) ? null : open };
      });
      const startTime = dayjs('2025-04-03 12:01:00');
      csvDataRef.current = rawData.filter(r => r.actual_open_price !== null && dayjs(r.datetime).isSameOrAfter(startTime));
    };

    const streamActualData = () => {
      const row = csvDataRef.current[actualPointerRef.current];
      if (row) {
        setActualData(prev => [...prev, row]);
        actualPointerRef.current++;
      }
    };

    fetchPrediction();
    intervalRef.current = setInterval(fetchPrediction, 2000);

    loadCsvData().then(() => {
      setTimeout(() => streamActualData(), 2000);
      actualIntervalRef.current = setInterval(streamActualData, 2000);
    });

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(actualIntervalRef.current);
    };
  }, [selectedStock]);

  const mergeAndGroupData = () => {
    const allTimestamps = new Set([...predictions.map(p => p.datetime), ...actualData.map(a => a.datetime)]);
    const merged = Array.from(allTimestamps).map(ts => {
      const pred = predictions.find(p => p.datetime === ts);
      const act = actualData.find(a => a.datetime === ts);
      return {
        datetime: ts,
        predicted_open_price: pred?.predicted_open_price,
        actual_open_price: act?.actual_open_price
      };
    });
    const sorted = merged.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    if (timeScale === 'minute') return sorted;

    const grouped = {};
    sorted.forEach(item => {
      const dt = dayjs(item.datetime);
      let hourGroupKey;
      if (timeScale === '1h') hourGroupKey = dt.format('YYYY-MM-DD HH:00');
      else if (timeScale === '2h') hourGroupKey = dt.startOf('hour').subtract(dt.hour() % 2, 'hour').format('YYYY-MM-DD HH:00');
      else if (timeScale === '3h') hourGroupKey = dt.startOf('hour').subtract(dt.hour() % 3, 'hour').format('YYYY-MM-DD HH:00');
      else hourGroupKey = dt.format('YYYY-MM-DD');

      if (!grouped[hourGroupKey]) grouped[hourGroupKey] = { datetime: hourGroupKey, predicted_open_price: [], actual_open_price: [] };

      if (item.predicted_open_price !== undefined) grouped[hourGroupKey].predicted_open_price.push(item.predicted_open_price);
      if (item.actual_open_price !== undefined) grouped[hourGroupKey].actual_open_price.push(item.actual_open_price);
    });

    return Object.values(grouped).map(g => ({
      datetime: g.datetime,
      predicted_open_price: g.predicted_open_price.length ? (g.predicted_open_price.reduce((a, b) => a + b, 0) / g.predicted_open_price.length) : undefined,
      actual_open_price: g.actual_open_price.length ? (g.actual_open_price.reduce((a, b) => a + b, 0) / g.actual_open_price.length) : undefined
    }));
  };

  const chartData = mergeAndGroupData();

  return (
    <div className="predict-page">
      <div className={`app ${darkMode ? 'dark' : ''}`}>
        <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
        <div className="main-container">
          <aside className="sidebar">
            <h2 data-aos="fade-right"><span className="stocks-icon">📈</span> Available Stocks</h2>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search companies..."
              className="search-input"
            />
            <ul className="stock-list">
              {stocks.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map(s => (
                <li key={s.id} className="stock-item" onClick={() => setSelectedStock(s)}>
                  <img src={s.logo} alt={s.name} className="stock-logo" />
                  <span>{s.name}</span>
                </li>
              ))}
            </ul>
          </aside>

          <section className="content-area">
            <h1>{selectedStock.name} Prediction</h1>
            <div className="scale-buttons">
              <button onClick={() => setTimeScale('minute')}>Minute</button>
              <button onClick={() => setTimeScale('1h')}>1 Hour</button>
              <button onClick={() => setTimeScale('2h')}>2 Hour</button>
              <button onClick={() => setTimeScale('3h')}>3 Hour</button>
            </div>
            <div className="next-move" style={{ marginTop: '10px', color: nextMove === 'UP' ? 'green' : 'red' }}>
              {nextMove && <h3>Expected Next Move: {nextMove}</h3>}
            </div>
            {chartData.length > 0 && (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="datetime"
                    tickFormatter={t => dayjs(t).format(timeScale === 'minute' ? 'HH:mm:ss' : 'HH:mm')}
                    angle={-30}
                    textAnchor="end"
                    tick={{ fontSize: 11, fill: darkMode ? '#fff' : '#333' }}
                  />
                  <YAxis
                    domain={[60, 100]}
                    ticks={Array.from({ length: 41 }, (_, i) => 60 + i)}
                    tick={{ fontSize: 12, fill: darkMode ? '#fff' : '#333' }}
                    tickFormatter={v => `${v} EGP`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: darkMode ? '#2a2a2a' : '#fff' }}
                    formatter={(val, name) => [`${val?.toFixed(2)} EGP`, name === 'predicted_open_price' ? 'Predicted Price' : 'Actual Price']}
                    labelFormatter={label => `Time: ${label}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="predicted_open_price" stroke="#ff0000" dot={{ r: 2 }} name="Predicted Price" />
                  <Line type="monotone" dataKey="actual_open_price" stroke="#007bff" dot={{ r: 2 }} name="Actual Price" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </section>
        </div>
        <footer data-aos="fade-up">
          <p>&copy; 2025 Egyptian Stock Predictor. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Predict;
