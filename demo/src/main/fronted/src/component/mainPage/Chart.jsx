import React, { useState, useEffect } from "react";
import { createChart } from 'lightweight-charts';
import styled from "styled-components";

const ChartContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
`;

const ChartWrapper = styled.div`
    width: 90%;
    height: 400px;
    background-color: white;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 10px;
    position: absolute;
    bottom: 10px;
    right: 10px;
`;

const Button = styled.button`
    padding: 10px 15px;
    font-size: 14px;
    font-weight: bold;
    color: white;
    background-color: black;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        color: black;
        background-color: #ffffff;
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgb(12, 11, 11);
    }

    &:active {
        background-color: #0c0b0b;
    }
`;

const Chart = () => {
    const [chart, setChart] = useState(null);
    const [sYear, setsYear] = useState(2017);

    useEffect(() => {
        const chart = createChart("container", {
            width: 800,
            height: 400,
            layout: {
                textColor: "black",
                backgroundColor: "#ffffff"
            }
        });

        setChart(chart);

        return () => {
            chart?.remove();
        };
    }, []);

    useEffect(() => {
        const fetchData = async (year) => {
            try {
                const response = await fetch(`http://localhost:8080/api/data/${year}`);
                const data = await response.json();

                const candlestickData = data.map(entry => ({
                    time: new Date(entry.datetime).getTime() / 1000, // 시간을 UNIX 타임스탬프로 변환
                    open: entry.open,
                    high: entry.high,
                    low: entry.low,
                    close: entry.close
                }));

                if (chart) {
                    const candlestickSeries = chart.addCandlestickSeries({
                        upColor: '#26a69a',
                        downColor: '#ef5350',
                        borderVisible: false,
                        wickUpColor: '#26a69a',
                        wickDownColor: '#ef5350'
                    });

                    candlestickSeries.setData(candlestickData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData(sYear);
    }, [chart, sYear]);

    return (
        <ChartContainer>
            <ChartWrapper id="container" />
            <ButtonContainer>
                {[2017, 2018, 2019, 2020, 2021, 2022, 2023].map(year => (
                    <Button key={year} onClick={() => {
                        setsYear(year);
                    }}>{year}</Button>
                ))}
            </ButtonContainer>
        </ChartContainer>
    );
};

export default Chart;
