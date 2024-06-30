import { useState, useEffect } from 'react'
import axios from 'axios'
import Places from './Places.jsx'
import Error from './Error.jsx'
import { sortPlacesByDistance } from '../loc.js'

export default function AvailablePlaces({ onSelectPlace }) {
	const [isFetching, setIsFetching] = useState()
	const [availablePlaces, setAvaiablePlaces] = useState([])
	const [error, setError] = useState([])

	useEffect(() => {
		setIsFetching(true)
		const fetchPlaces = async () => {
			try {
				const response = await fetch('http://localhost:3000/places')
				const dataResponse = await response.json()

				if (!response.ok) {
					throw new Error('Failed to fetch placces')
				}

				navigator.geolocation.getCurrentPosition(position => {
					const sortedPlaces = sortPlacesByDistance(
						dataResponse.places,
						position.coords.latitude,
						position.coords.longitude
					)

					
					setAvaiablePlaces(sortedPlaces)
					setIsFetching(false)
				})
			} catch (error) {
				setError({ message: error.message || 'Could not fetch places, please try again later' })
				setIsFetching(false)
			}
		}

		fetchPlaces()
	}, [])

	if (!error) {
		return <Error title='An error occurend!' message={error.message}></Error>
	}

	return (
		<Places
			title='Available Places'
			places={availablePlaces}
			isLoading={false}
			loadingText='Fetching place data...'
			fallbackText='No places available.'
			onSelectPlace={onSelectPlace}
		/>
	)
}
