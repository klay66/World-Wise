import CountryItem from "./countryItem"
import styles from "./CountryList.module.css"
import Spinner from './Spinner';
import Message from './Message';
import City from "./City";
import { useCities } from "../contexts/CitiesContext";
export default function CountrList() {
    const { cities, isLoading } = useCities()

    if (isLoading) return <Spinner />;

    if (!cities.length) return <Message message='Add your first city' />

    const countries = cities.reduce((arr, city) => {
        if (!arr.map((el) => el.country).includes(city.country))
            return [...arr, { country: city.country, emoji: city.emoji }];
        else return arr;
    }, []);

    return (
        <ul className={styles.countrList}>
            {countries.map((country) => (<CountryItem country={country} key={country.country} />))}
        </ul>
    )
}
