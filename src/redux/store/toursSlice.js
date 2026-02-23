import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  tours: [
    {
      id: 1,
      title: "Ausflüge ab Hurghada",
      description:
        "Erleben Sie einen unvergesslichen Tagesausflug nach Luxor – privat und ohne Verkaufsveranstaltungen",
      image: "/images/Cities/makadi bay.jpg",
      features: [
        "Online buchen und vor Ort bezahlen",
        "Abholung von der Lobby Ihres Hotels",
        "Inklusive Versicherung",
        "Keine Verkaufsveranstaltungen",
      ],
      price: "187",
      isLiked: false,
      route:"Hurghada"
    },
    {
      id: 2,
      title: "DOLPHIN WATCH und Schnorcheln",
      description: "Erlebe Sie hautnah die faszinierende Welt der Delfine bei einem Schnorchelausflug ab Hurghada",
      image: "/images/Cities/el guna.jpg",
      features: [
        "Kostenlose Stornierung",
        "Dauer 7 Stunden",
        "jetzt buchen und vor Ort bezahlen",
        "Abholung von der Lobby Ihres Hotels",
      ],
      price: "187",
      isLiked: false,
      route:"Guna"
    },
    {
      id: 3,
      title: "Hurghada Stadtrundfahrt",
      description: "Entdecken Sie das authentische Hurghada mit travelpro Hurghada stadtrundfahrt Privat",
      image: "/images/Cities/soma bay.jpg",
      features: [
        "Deutschsprechender Reiseleiter",
        "Dauer 4 Stunden",
        "Abholung von der Lobby Ihres Hotels",
        "Keine Kaffeefahrt",
      ],
      price: "187",
      isLiked: false,
      route:"SomaBay"
    },
    {
      id: 4,
      title: "Luxor Tagesausflug",
      description: "Erleben Sie einen unvergesslichen Tagesausflug nach Luxor – privat und ohne Verkaufsveranstaltungen",
      image: "/images/Cities/makadi bay.jpg",
      features: [
        "Hotelabholung und Rückfahrt",
        "Deutschsprachige Reiseleitung",
        "Mittagessen inklusive",
        "Tal der Könige",
        "Karnak Tempel",
      ],
      price: "187",
      isLiked: false,
      route:"MakadiBay"
    },
    {
      id: 5,
      title: "Schnorcheln im Roten Meer",
      description: "Erleben Sie einen unvergesslichen Tagesausflug nach Luxor – privat und ohne Verkaufsveranstaltungen",
      image: "/images/Cities/el guna.jpg",
      features: [
        "Hotelabholung und Rückfahrt",
        "Deutschsprachige Reiseleitung",
        "Mittagessen inklusive",
        "Schnorchelausrüstung",
        "2 Schnorchelstopps",
      ],
      price: "187",
      isLiked: false,
      route:"Hurghada2"
    },
    {
      id: 6,
      title: "Kairo und Pyramiden",
      description: "Erleben Sie einen unvergesslichen Tagesausflug nach Luxor – privat und ohne Verkaufsveranstaltungen",
      image: "/images/Cities/soma bay.jpg",
      features: [
        "Hotelabholung und Rückfahrt",
        "Deutschsprachige Reiseleitung",
        "Mittagessen inklusive",
        "Pyramiden von Gizeh",
        "Ägyptisches Museum",
      ],
      price: "187",
      isLiked: false,
      route:"Hurghada"
    },
  ],
  loading: false,
  wishlistCount: 0,
}

const toursSlice = createSlice({
  name: "tours",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    bookTour: (state, action) => {
      console.log(`Booking tour with ID: ${action.payload}`)
    },
    toggleWishlist: (state, action) => {
      const tour = state.tours.find((tour) => tour.id === action.payload)
      if (tour) {
        tour.isLiked = !tour.isLiked
        if (tour.isLiked) {
          state.wishlistCount += 1
        } else {
          state.wishlistCount -= 1
        }
      }
    },
  },
})

export const { setLoading, bookTour, toggleWishlist } = toursSlice.actions
export default toursSlice.reducer
