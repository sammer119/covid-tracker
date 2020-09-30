import React, { useState, useEffect } from "react";
import "./App.css";
import {
    FormControl,
    Menu,
    MenuItem,
    Select,
    Card,
    CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";

function App() {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState("worldwide");
    const [countryInfo, setCountryInfo] = useState({});

    useEffect(() => {
        const getCountriesData = async () => {
            await fetch("https://disease.sh/v3/covid-19/countries")
                .then((response) => response.json())
                .then((data) => {
                    const countries = data.map((country) => ({
                        name: country.country, // eg. United Kingdom
                        value: country.countryInfo.iso2, // eg. UK
                    }));

                    setCountries(countries);
                });
        };

        getCountriesData();
    }, []);

    const onCountryChange = async (event) => {
        const countryCode = event.target.value;
        setCountry(countryCode);

        const url =
            countryCode === "worldwide"
                ? "https://disease.sh/v3/covid-19/all"
                : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setCountry(countryCode);
                // all of the data from the country response
                setCountryInfo(data);
            });
    };

    console.log(countryInfo);

    return (
        // BEM naming convention
        <div className="app">
            <div className="app__left">
                <div className="app__header">
                    <h1>COVID-19 TRACKER</h1>
                    <FormControl className="app__dropdown">
                        <Select
                            variant="outlined"
                            onChange={onCountryChange}
                            value={country}
                        >
                            <MenuItem value="worldwide">Worldwide</MenuItem>
                            {countries.map((country) => (
                                <MenuItem
                                    value={country.value}
                                    key={Math.random() * 100}
                                >
                                    {country.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <div className="app__stats">
                    <InfoBox
                        title="Coronavirus Cases"
                        total={countryInfo.cases}
                        cases={countryInfo.todayCases}
                    />
                    <InfoBox
                        title="Recovered"
                        total={countryInfo.recovered}
                        cases={countryInfo.todayRecovered}
                    />
                    <InfoBox
                        title="Deaths"
                        total={countryInfo.deaths}
                        cases={countryInfo.todayDeaths}
                    />
                </div>

                <Map />
            </div>
            <Card className="app__right">
                <CardContent>
                    <h3>Live Cases By Country</h3>
                    <h3>Worldwide new cases</h3>
                    {/* Table */}
                    {/* Graph */}
                </CardContent>
            </Card>
        </div>
    );
}

export default App;
