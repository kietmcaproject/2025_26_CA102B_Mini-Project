// import React, { useRef, useState } from 'react'
// import { Link } from 'react-router-dom'
// import CaptainDetails from '../components/CaptainDetails'
// import RidePopUp from '../components/RidePopUp'
// import { useGSAP } from '@gsap/react'
// import gsap from 'gsap'
// import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
// import { useEffect, useContext } from 'react'
// import { SocketContext } from '../context/SocketContext'
// import { CaptainDataContext } from '../context/CapatainContext'
// import axios from 'axios'

// const CaptainHome = () => {

//     const [ ridePopupPanel, setRidePopupPanel ] = useState(false)
//     const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)

//     const ridePopupPanelRef = useRef(null)
//     const confirmRidePopupPanelRef = useRef(null)
//     const [ ride, setRide ] = useState(null)

//     const { socket } = useContext(SocketContext)
//     const { captain } = useContext(CaptainDataContext)

//     useEffect(() => {
//         socket.emit('join', {
//             userId: captain._id,
//             userType: 'captain'
//         })
//         const updateLocation = () => {
//             if (navigator.geolocation) {
//                 navigator.geolocation.getCurrentPosition(position => {

//                     socket.emit('update-location-captain', {
//                         userId: captain._id,
//                         location: {
//                             ltd: position.coords.latitude,
//                             lng: position.coords.longitude
//                         }
//                     })
//                 })
//             }
//         }

//         const locationInterval = setInterval(updateLocation, 10000)
//         updateLocation()

//         // return () => clearInterval(locationInterval)
//     }, [])

//     socket.on('new-ride', (data) => {

//         setRide(data)
//         setRidePopupPanel(true)

//     })

//     async function confirmRide() {

//         const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {

//             rideId: ride._id,
//             captainId: captain._id,


//         }, {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem('token')}`
//             }
//         })

//         setRidePopupPanel(false)
//         setConfirmRidePopupPanel(true)

//     }


//     useGSAP(function () {
//         if (ridePopupPanel) {
//             gsap.to(ridePopupPanelRef.current, {
//                 transform: 'translateY(0)'
//             })
//         } else {
//             gsap.to(ridePopupPanelRef.current, {
//                 transform: 'translateY(100%)'
//             })
//         }
//     }, [ ridePopupPanel ])

//     useGSAP(function () {
//         if (confirmRidePopupPanel) {
//             gsap.to(confirmRidePopupPanelRef.current, {
//                 transform: 'translateY(0)'
//             })
//         } else {
//             gsap.to(confirmRidePopupPanelRef.current, {
//                 transform: 'translateY(100%)'
//             })
//         }
//     }, [ confirmRidePopupPanel ])

//     return (
//         <div className='h-screen'>
//             <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
//                 <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
//                 <Link to='/captain-home' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
//                     <i className="text-lg font-medium ri-logout-box-r-line"></i>
//                 </Link>
//             </div>
//             <div className='h-3/5'>
//                 <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />

//             </div>
//             <div className='h-2/5 p-6'>
//                 <CaptainDetails />
//             </div>
//             <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
//                 <RidePopUp
//                     ride={ride}
//                     setRidePopupPanel={setRidePopupPanel}
//                     setConfirmRidePopupPanel={setConfirmRidePopupPanel}
//                     confirmRide={confirmRide}
//                 />
//             </div>
//             <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
//                 <ConfirmRidePopUp
//                     ride={ride}
//                     setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
//             </div>
//         </div>
//     )
// }

// export default CaptainHome


import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'

const CaptainHome = () => {

    const [ ridePopupPanel, setRidePopupPanel ] = useState(false)
    const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const [ ride, setRide ] = useState(null)

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)

    useEffect(() => {
        socket.emit('join', {
            userId: captain._id,
            userType: 'captain'
        })
        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {

                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    })
                })
            }
        }

        const locationInterval = setInterval(updateLocation, 10000)
        updateLocation()

        // return () => clearInterval(locationInterval)
    }, [])

    socket.on('new-ride', (data) => {

        setRide(data)
        setRidePopupPanel(true)

    })

    async function confirmRide() {

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {

            rideId: ride._id,
            captainId: captain._id,


        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        setRidePopupPanel(false)
        setConfirmRidePopupPanel(true)

    }


    useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ ridePopupPanel ])

    useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ confirmRidePopupPanel ])

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-orange-100 to-orange-200 text-gray-800">
            {/* TOP NAV — modern glass style */}
            <div className='fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl bg-white/40 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 flex items-center justify-between shadow-lg'>
                <div className="flex items-center gap-4">
                    <img className='w-14' src="./src/assets/QuickRide_logo_1.jpeg" alt="" />
                    <div>
                        <div className="text-sm text-orange-700">Welcome,</div>
                        <div className="text-base font-semibold">{captain?.fullname?.firstname || 'Captain'}</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link to='/captain-home' className='h-10 w-10 bg-white/20 hover:bg-white/30 flex items-center justify-center rounded-full transition'>
                        <i className="text-lg font-medium ri-logout-box-r-line"></i>
                    </Link>
                </div>
            </div>

            {/* HERO MAP / VISUAL */}
            <div className='h-[58vh] w-full relative overflow-hidden mt-6 rounded-b-3xl shadow-lg'>
                <div className="absolute inset-0 rounded-b-3xl overflow-hidden">
                    <img className='h-full w-full object-cover filter contrast-90 opacity-90' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-200/70 to-transparent"></div>
                </div>

                {/* Captain details card overlay */}
                <div className="absolute left-6 bottom-6 z-30">
                    <div className="bg-white/50 backdrop-blur-md border border-orange-200 rounded-2xl p-4 w-80 shadow-xl">
                        <CaptainDetails />
                    </div>
                </div>
            </div>

            {/* BOTTOM PANEL AREA (keeps original layout and panels) */}
            <div className='px-6 py-8 lg:px-12 lg:py-12 max-w-5xl mx-auto'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    {/* Left: quick actions */}
                    <div className="col-span-1 bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-orange-300">
                        <div className="text-sm text-orange-700 mb-2">Status</div>
                        <div className="flex items-center gap-3">
                            <div className="h-3 w-3 rounded-full bg-green-500" />
                            <div className="font-semibold">Online</div>
                        </div>

                        <div className="mt-6">
                            <Link to="/captain-home" className="inline-block w-full text-center py-3 rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold shadow-sm hover:scale-[1.02] transition">
                                Go to Dashboard
                            </Link>
                        </div>
                    </div>

                    {/* Middle: live feed */}
                    <div className="col-span-2 bg-white/30 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-orange-300">
                        <div className="text-lg font-semibold mb-2 text-orange-700">Live Feed</div>
                        <div className="text-sm text-orange-600 mb-4">Real-time ride requests and location updates appear here.</div>
                        <div className="h-40 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg border border-orange-300 flex items-center justify-center text-orange-500">
                            Live tracking & ride requests
                        </div>
                    </div>
                </div>
            </div>

            {/* ORIGINAL POPUP PANELS — preserved exactly, only styling modernized */}
            <div ref={ridePopupPanelRef} className='fixed w-full z-50 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 rounded-t-3xl shadow-2xl'>
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>
            <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-50 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 rounded-t-3xl shadow-2xl'>
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
            </div>
        </div>
    )
}

export default CaptainHome
