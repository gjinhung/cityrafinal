import React, { useEffect, useRef, useState } from "react";
import LanguageSelection from './Language copy'
import CitySelection from './City copy'
import SpecialtySelection from "./Type";
import { useSearch } from "../../context/SearchBar";
import { cityByName } from "../../store/city";
import { langByName } from "../../store/language";
import { dateByName } from "../../store/date";
import { useDispatch, useSelector } from "react-redux";
import { typeByName } from "../../store/type";
import './SearchBar.css'
import DateSelection from "./Date";
import { NavLink } from "react-router-dom";
import SearchedTour from "./SearchedTour";
import vietnam_streets from '../../images/vietnam_streets.jpg'
import wallstreet from "../../images/wallstreet.jpg"
import greek_statues from '../../images/greek_statues.jpg'
import neon_signs from '../../images/neon_signs.jpg'
import { useNavScroll } from "../../context/NavScrollToggle"
import dual_underline from '../../images/dual-underline.png'

export default function SearchBar({ loaded }) {
    const searchRef = useRef(null)
    const users = useSelector((state) => state.users)
    const students = []
    const normalizedUsers = Object.values(users)
    const current_user = useSelector((state) => state.session.user)
    normalizedUsers.forEach((user) => {
        if (user.student) {
            students.push(user.id)
        }
    })
    const tours = useSelector((state) => (state.tours))
    const { searchTerms, submitSearch, setSubmit } = useSearch()
    const dispatch = useDispatch()
    const [tourIds, setTour_ids] = useState([])
    const { scrollTop, setScrollTop } = useNavScroll(0)
    let imgs = [vietnam_streets, wallstreet, greek_statues, neon_signs]
    const [banner, setBanner] = useState('')
    const { language, city, type, date } = searchTerms


    useEffect(() => {
        setScrollTop(0)
        handleSearch()
        setBanner(imgs[Math.floor(Math.random() * imgs.length)])
    }, [])

    const handleScroll = (event) => {

        setScrollTop(event.currentTarget.scrollTop);
    };

    async function handleSearch() {
        setSubmit(searchTerms)
        console.log(searchTerms)
        const tours_id = Object.keys(tours)
        //fill each category with all tours
        const tour_ids = []
        tours_id.forEach((id) => {
            tour_ids.push(+id)
        })

        let city_tours = tour_ids
        let type_tours = tour_ids
        let language_tours = tour_ids
        let date_tours = tour_ids

        // if there is a city fetch tours of that city
        if (city) {
            const city_id = await dispatch(cityByName(city)).catch((response) => {
                const data = response.json()
                return data
            });
            city_tours = (Object.values(city_id)[0].tours_id)
        }
        //if there is a language fetch tours with that language
        if (language) {
            console.log('yes language')
            const language_id = await dispatch(langByName(language)).catch((response) => {
                const data = response.json()
                return data
            });
            let resLanguage = []
            let guide_array = (Object.values(language_id)[0].guides_id)
            guide_array.forEach((user_id) => {
                let tours = users[user_id].tours_given_ids
                tours.forEach((tour_id) => {
                    resLanguage.push(tour_id)
                })
            })
            language_tours = resLanguage
        }
        // if there is a specialty fetch tours with that specialty
        if (type) {
            const type_id = await dispatch(typeByName(type)).catch((response) => {
                const data = response.json()
                return data
            });
            type_tours = (Object.values(type_id)[0].tours_id)
        }
        // if a date was select get tours of that date
        if (date) {
            const weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

            let year = date.substring(0, 4);
            let month = date.substring(5, 7);
            let day = date.substring(8, 10);
            let newDate = new Date(`${year}-${month}-${day}`);

            let dayOfWeek = weekday[newDate.getDay()]
            // console.log(dayOfWeek)

            const date_id = await dispatch(dateByName(dayOfWeek)).catch((response) => {
                const data = response.json()
                return data
            });

            date_tours = (Object.values(date_id)[0].tours_id)
        }

        const firstFilter = city_tours.filter(value => language_tours.includes(value));
        const secondFilter = firstFilter.filter(value => type_tours.includes(value))
        const thirdFilter = secondFilter.filter(value => date_tours.includes(value))

        if (current_user) {
            const userFilter = thirdFilter.filter(value => tours[value].guide_id != current_user.id)
            setTour_ids(userFilter)
        } else {
            setTour_ids(thirdFilter)
        }

        searchRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    if (!loaded) {
        return (
            <div className="loading-style">
                <div className='loading-font'>
                    Loading......
                </div>
            </div>

        )
    } else {

        return (
            <div className="wrap"
                onScroll={(e) => handleScroll(e)}>
                <img src={banner} className="background" alt="background_image"></img>
                <div className="header">
                    <div className="book_tour_container">
                        <div>BOOK A TOUR </div>
                        <div className="today">TODAY</div>
                        <img src={dual_underline} className="underline"></img>
                    </div>
                    <div className="book_tour_sub">
                        Local Tours by Local Students
                    </div>
                    {scrollTop <= 60 &&
                        <div className="searchBarContainerCont">
                            <div className="searchBarContainer" >
                                <div className="searchBar" >
                                    <DateSelection />
                                    {/* <LanguageSelection /> */}
                                    <CitySelection />
                                    {/* <SpecialtySelection /> */}
                                    <div className="searchButton-container">
                                        <button
                                            type='submit'
                                            onClick={handleSearch}
                                            className={"search-button"}>
                                            SEARCH
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div >
                    }
                </div>

                {submitSearch.date && <div
                    className="section">
                    {scrollTop > 60 &&
                        <div
                            className="filter_searchBarContainerCont">
                            <div className="filter_searchBarContainer" >
                                <div className="searchBar" >
                                    <DateSelection />
                                    {/* <LanguageSelection /> */}
                                    <CitySelection />
                                    <SpecialtySelection />
                                    <div className="searchButton-container">
                                        <button
                                            type='submit'
                                            onClick={(e) => handleSearch(e)}
                                            className={"search-button"}>
                                            FILTER
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div >}
                    {!tourIds.length ?
                        <div className="nosearch-container">
                            <div ref={searchRef} className="nosearch">
                                Sorry but no tours are available for your search criteria. Try another search parameter.
                            </div>
                        </div> :
                        <div ref={searchRef} className="image_container">
                            {tourIds.map((tour_id, idx) => {
                                if (current_user) {
                                    return (

                                        tours[tour_id].guide_id !== current_user.id &&

                                        <SearchedTour
                                            key={idx}
                                            tour_id={tour_id} />

                                    )
                                }
                                else {
                                    return (
                                        <SearchedTour
                                            key={idx}
                                            tour_id={tour_id} />
                                    )
                                }
                            }
                            )}
                        </div>
                    }
                </div>}

            </div >
        )
    }
}