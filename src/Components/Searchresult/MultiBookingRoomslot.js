// import React from 'react'

// export const MultiBookingRoomslot = () => {
//     return (
//         <Tabs
//             defaultActiveKey="bed-Rooms1"
//             id="uncontrolled-tab-example2"
//             className="mb-3 mt-3 search-result-list-tab"
//         >

//             <Tab eventKey="bed-Rooms1" title={<TabTitle1 />} tabClassName="custom-tab" >

//                 <Tabs
//                     defaultActiveKey="private-Rooms"
//                     id="uncontrolled-tab-example"
//                     className="mb-3 mt-3 compnay-detail-tabs tab-50-50"
//                     onSelect={(k) => {
//                         if (k === "private-Rooms") {
//                             setRoomType("Private");
//                         }
//                         if (k === "twin-sharing-rooms") {
//                             setRoomType("Shared");
//                         }
//                     }}
//                 >
//                     <Tab eventKey="private-Rooms" title="Private Rooms">
//                         {!isSmartSearchEnabled && (
//                             <>
//                                 <div className="property-results">
//                                     <div className="property-card mb-4">
//                                         <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
//                                             <label className='mb-0 d-flex gap-2 align-items-center' >
//                                                 <input type="checkbox" className="mx-2 custom-checkbox" checked={showPrices} onChange={(e) => setShowPrices(e.target.checked)} />
//                                                 Show room prices
//                                             </label>

//                                             <div className='filter-right-option d-flex gap-3'>
//                                                 <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>


//                                                     <Button variant="" className='btn-sort'> Sort by :
//                                                         <Select
//                                                             name="aria-role-select"
//                                                             options={sortoption}
//                                                             placeholder="Name"
//                                                             className="react_selectbox"
//                                                             isSearchable={false}
//                                                             styles={customStyles}
//                                                         />

//                                                     </Button>

//                                                 </div>

//                                             </div>

//                                         </div>

//                                         {bookingRoomsData.map((item, i) => (<div key={i}>
//                                             <p className='text-right p-title position-relative' >
//                                                 <span>Property {i + 1} </span>  </p>


//                                             {/* Room Card 1 */}
//                                             {item?.properties.map((prop, ind) => (<div key={ind} className="room-card mt-4">
//                                                 <Link href="./PropertyDetails" className='text-black text-decoration-none' >
//                                                     <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>

//                                                         <Image
//                                                             src={prop?.cover_photo ? `https://alicedevapi.casamelhor.in${prop?.cover_photo}` : `/images/icons/No-Image.svg`}
//                                                             alt="Room"
//                                                             width={56}
//                                                             height={56}
//                                                             className="img-fluid"
//                                                         />

//                                                         <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >{prop?.property_name}</p>
//                                                     </div>
//                                                 </Link>

//                                                 {prop.rooms.length > 0 && prop.rooms.map((room, index) => (<div key={index} className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
//                                                     <Row className="align-items-center">

//                                                         <Col md={9}>
//                                                             <div className='d-flex gap-3 room-booking-card'>
//                                                                 <div className="room-image position-relative">

//                                                                     <Link href="./ViewDetailsResult">
//                                                                         <Image
//                                                                             src={room?.cover_photo ? `https://alicedevapi.casamelhor.in${room?.cover_photo}` : `/images/icons/No-Image.svg`}
//                                                                             alt="Room"
//                                                                             width={104}
//                                                                             height={192}
//                                                                             className="img-fluid"
//                                                                         />

//                                                                     </Link>

//                                                                     <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> {room.rooms_photo.length}</span>
//                                                                 </div>
//                                                                 <div className="room-details">
//                                                                     <div className='r-detail-1'>
//                                                                         <h4 className='room-title'> {room?.room_name}   {room?.room_type === roomType && <span className='room-type-badge' >Private Room</span>} </h4>
//                                                                         <div className="room-specs mb-2">
//                                                                             <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps {room?.max_guests}</span>
//                                                                             <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> {room.beds.length} bed</span>
//                                                                             <span className="spec-item">{room?.room_size_sqft} sq ft</span>
//                                                                         </div>
//                                                                         <div className="amenities mb-2">
//                                                                             {room?.room_amenities.map((amenity, inde) => (<span key={inde} className="amenity-item">{amenity}</span>))}
//                                                                         </div>

//                                                                         <Link href="#" onClick={() => { filterShow(room) }} className="room-details-link ">Room Details</Link>

//                                                                     </div>

//                                                                     {room?.bedroom_preference === "Female" && <p className='female-preferred'>
//                                                                         Female PREFERRED
//                                                                     </p>}
//                                                                     {room?.bedroom_preference === "Male" && <span className='male-preferred'>
//                                                                         Male PREFERRED
//                                                                     </span>}
//                                                                 </div>
//                                                             </div>
//                                                         </Col>
//                                                         {room.is_available ? <Col md={3}>
//                                                             <div className="booking-section  text-end">
//                                                                 {showPrices && (
//                                                                     <p className='room-price' >From <br />
//                                                                         <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹{room.price_per_night}</span> <br />
//                                                                         / night
//                                                                     </p>
//                                                                 )}
//                                                                 {/* <Link href='./ReserveBooking' className="reserve-btn">Reserve</Link> */}
//                                                                 <Link onClick={() => setShowCart(true)} href='#' className="reserve-btn-add"><Image src="./images/icons/Plus.svg" className="img-fluid" alt="add" width={16} height={16} />
//                                                                     Add</Link>

//                                                             </div>
//                                                         </Col>
//                                                             :
//                                                             <Col md={3} className='h-100' >
//                                                                 <div className="booking-section text-end">
//                                                                     <p className='mb-0' >Adjust your dates for availability.</p>
//                                                                     <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Change Dates</Button>
//                                                                     <p className='mb-0' >or</p>
//                                                                     <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Book Hotel
//                                                                         <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
//                                                                     </Button>


//                                                                 </div>
//                                                             </Col>}
//                                                     </Row>
//                                                 </div>))}
//                                                 <>

//                                                 </>

//                                             </div>))}
//                                         </div>))}


//                                     </div>
//                                 </div>

//                                 <p className='fs-20 mb-1'>Selected room type is not available for your dates.</p>
//                                 <p className='mb-3' >Adjust your dates for availability or enable smart search for our suggestions.</p>

//                                 <Button variant='' className='edit-btn py-2 px-4'>Enable Smart Search</Button>
//                             </>

//                         )}


//                         {isSmartSearchEnabled && (
//                             <>
//                                 <div className="property-results">
//                                     <div className="property-card mb-4">
//                                         <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
//                                             <label className='mb-0 d-flex gap-2 align-items-center' >
//                                                 <input type="checkbox" className="mx-2 custom-checkbox" checked={showPrices} onChange={(e) => setShowPrices(e.target.checked)} />
//                                                 Show room prices
//                                             </label>

//                                             <div className='filter-right-option d-flex gap-3'>
//                                                 <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>


//                                                     <Button variant="" className='btn-sort'> Sort by :
//                                                         <Select
//                                                             name="aria-role-select"
//                                                             options={sortoption}
//                                                             placeholder="Name"
//                                                             className="react_selectbox"
//                                                             isSearchable={false}
//                                                             styles={customStyles}
//                                                         />

//                                                     </Button>

//                                                 </div>

//                                             </div>

//                                         </div>

//                                         {/* <p className='text-right p-title position-relative' >
//                                                                 <span>Property 1 </span>  </p> */}


//                                         <p className='fs-20 mb-0' >Mixed room options</p>
//                                         <p>A twin room option is available on one of your rooms.</p>



//                                         <div className="room-card mt-4 ">
//                                             <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>
//                                                 <Image
//                                                     src="/images/icons/amentiy.jpg"
//                                                     alt="Room"
//                                                     width={56}
//                                                     height={56}
//                                                     className="img-fluid"
//                                                 />
//                                                 <p className="property-name fw-medium mb-0">Casa Melhor Yayati Tulip 17th Floor</p>
//                                             </div>

//                                             <div className='border-bottom-custom mb-3 pb-3' style={{ borderColor: '#463527' }} >
//                                                 <Row className="align-items-center">

//                                                     <Col md={9}>
//                                                         <div className=' room-booking-card w-100 pe-3'>

//                                                             <div className="room-details">

//                                                                 <div className='d-flex justify-between W-100 mb-3 '>
//                                                                     <div className='r2'>
//                                                                         <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
//                                                                         <h4>Room 4</h4>
//                                                                         <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
//                                                                     </div>

//                                                                     <div className='r2 text-center'>
//                                                                         <Image src='./images/icons/swicth-acess.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
//                                                                         Room change on <br></br>
//                                                                         Tue, 5 Aug, 2025
//                                                                     </div>


//                                                                     <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center' }} >
//                                                                         <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
//                                                                         <h4>Room 4</h4>
//                                                                         <span style={{ color: '#463527', lineHeight: '20px' }} >Checkout</span>
//                                                                     </div>

//                                                                 </div>

//                                                                 <div className='d-flex justify-between align-items-start'>
//                                                                     <div className='colum-1'>

//                                                                         <div className="room-specs mb-2">
//                                                                             <span className="spec-item">Room 3</span>
//                                                                             <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

//                                                                         </div>

//                                                                         <div className="room-specs mb-2 ">

//                                                                             <span className='female-preferred'>
//                                                                                 Female PREFERRED
//                                                                             </span>

//                                                                             <span className=" badge-grey" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px', textTransform: 'uppercase' }}>Only 1 bed left!</span>

//                                                                         </div>

//                                                                         <div className="room-specs mb-2">
//                                                                             <span className="spec-item">Room 2</span>
//                                                                             <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

//                                                                         </div>



//                                                                         <p className='mb-0' >Rooms in the same property</p>

//                                                                     </div>

//                                                                     <div className='colum-2'>

//                                                                         <Link href="#" className='edit-btn py-2 px-4' onClick={filterShow1}  >View Details</Link>

//                                                                     </div>

//                                                                 </div>




//                                                             </div>
//                                                         </div>
//                                                     </Col>
//                                                     <Col md={3}>
//                                                         <div className="booking-section  text-end">
//                                                             {showPrices && (
//                                                                 <>

//                                                                     <p className='room-price border-bottom-custom pb-2 mb-0' style={{ lineHeight: 'auto' }} >From <br />
//                                                                         <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine', lineHeight: 'auto' }} >₹3939</span> <br />
//                                                                         / night
//                                                                     </p>


//                                                                     <p className='room-price border-bottom-custom pb-2 mb-0' style={{ lineHeight: 'auto' }} >From <br />
//                                                                         <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine', lineHeight: 'auto' }} >₹3939</span> <br />
//                                                                         / night
//                                                                     </p>
//                                                                 </>

//                                                             )}
//                                                             <Link href='#' onClick={() => setShowCart2(true)} className="reserve-btn-add"><Image src="./images/icons/Plus.svg" className="img-fluid" alt="add" width={16} height={16} />
//                                                                 Add</Link>

//                                                         </div>
//                                                     </Col>
//                                                 </Row>
//                                             </div>



//                                         </div>



//                                         <hr style={{ margin: '40px 0' }} ></hr>


//                                         <p className='fs-20 mb-0' >Mixed BR options</p>
//                                         <p>Single room option is available on one of your rooms upon BR Switch.</p>


//                                         {/* Room Card 1 */}
//                                         <div className="room-card mt-4">
//                                             <div className='border-bottom-custom1 pb-3 mb-3'>
//                                                 <Row>
//                                                     <Col md={5}>
//                                                         <div className='d-flex gap-2 align-items-center  '>
//                                                             <Image
//                                                                 src="/images/icons/amentiy.jpg"
//                                                                 alt="Room"
//                                                                 width={56}
//                                                                 height={56}
//                                                                 className="img-fluid"
//                                                             />
//                                                             <p className="property-name fw-medium mb-0">Casa Melhor Yayati Tulip 17th Floor</p>
//                                                         </div>
//                                                     </Col>

//                                                     <Col md={5}>
//                                                         <div className='d-flex gap-2 align-items-center '>
//                                                             <Image
//                                                                 src="/images/icons/amentiy.jpg"
//                                                                 alt="Room"
//                                                                 width={56}
//                                                                 height={56}
//                                                                 className="img-fluid"
//                                                             />
//                                                             <p className="property-name fw-medium mb-0">Yayati Apartments 6th Floor</p>
//                                                         </div>
//                                                     </Col>
//                                                 </Row>

//                                             </div>


//                                             <div className='border-bottom-custom mb-3 pb-3' style={{ borderColor: '#463527' }} >
//                                                 <Row className="align-items-center">

//                                                     <Col md={9}>
//                                                         <div className=' room-booking-card w-100 pe-3'>

//                                                             <div className="room-details">

//                                                                 <div className='d-flex align-items-center justify-between W-100 mb-3 '>
//                                                                     <div className='r2' style={{ maxWidth: '130px' }}  >
//                                                                         <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
//                                                                         <h4>Room 4</h4>
//                                                                         <p className='mb-0'>Casa Melhor Yayati Tulip 17th Floor</p>
//                                                                         <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
//                                                                     </div>

//                                                                     <div className='r2 text-center'>
//                                                                         <Image src='./images/icons/move-mistry.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
//                                                                         Room change on <br></br>
//                                                                         Tue, 5 Aug, 2025
//                                                                     </div>


//                                                                     <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '130px' }} >
//                                                                         <span style={{ color: '#73615F' }} >Sun, 7 Aug, 2025</span>
//                                                                         <h4>Room 4</h4>
//                                                                         <p className='mb-0'>Yayati Apartments 6th Floor</p>
//                                                                         <span style={{ color: '#463527', lineHeight: '20px' }} >Checkout</span>
//                                                                     </div>

//                                                                 </div>

//                                                                 <div className='d-flex justify-between align-items-start'>
//                                                                     <div className='colum-1'>

//                                                                         <div className="room-specs mb-2">
//                                                                             <span className="spec-item">Room 3</span> |
//                                                                             <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

//                                                                         </div>

//                                                                         <div className="room-specs mb-2 ">

//                                                                             <span className='female-preferred'>
//                                                                                 Female PREFERRED
//                                                                             </span>

//                                                                             <span className=" badge-grey" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>Only 1 bed left!</span>

//                                                                         </div>

//                                                                         <div className="room-specs mb-2">
//                                                                             <span className="spec-item">Room 2</span> |
//                                                                             <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

//                                                                         </div>



//                                                                         <p className='mb-0' >Rooms in the same property</p>

//                                                                     </div>

//                                                                     <div className='colum-2'>

//                                                                         <Link href="#" onClick={filterShow2} className='edit-btn py-2 px-4' >View Details</Link>

//                                                                     </div>

//                                                                 </div>




//                                                             </div>
//                                                         </div>
//                                                     </Col>
//                                                     <Col md={3}>
//                                                         <div className="booking-section  text-end">
//                                                             {showPrices && (
//                                                                 <p className='room-price' >From <br />
//                                                                     <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹3939</span> <br />
//                                                                     / night
//                                                                 </p>
//                                                             )}
//                                                             <Link href='#' onClick={() => setShowCart2(true)} className="reserve-btn-add"><Image src="./images/icons/Plus.svg" className="img-fluid" alt="add" width={16} height={16} />
//                                                                 Add</Link>

//                                                         </div>
//                                                     </Col>
//                                                 </Row>
//                                             </div>



//                                         </div>




//                                         <hr style={{ margin: '40px 0' }} ></hr>


//                                         <p className='fs-20 mb-0' >Other options</p>
//                                         <p>Single room option is partially available on one of your rooms.</p>


//                                         {/* Room Card 1 */}
//                                         <div className="room-card mt-4">

//                                             <Row  >
//                                                 <Col md={5}>
//                                                     <div className='d-flex gap-2 align-items-center mb-3 '>
//                                                         <Image
//                                                             src="/images/icons/amentiy.jpg"
//                                                             alt="Room"
//                                                             width={56}
//                                                             height={56}
//                                                             className="img-fluid"
//                                                         />
//                                                         <p className="property-name fw-medium mb-0">Casa Melhor Yayati Tulip 17th Floor</p>
//                                                     </div>
//                                                 </Col>


//                                             </Row>


//                                             <div className='border-bottom-custom  mb-3  pb-3' style={{ borderColor: '#463527' }} >
//                                                 <Row className="align-items-center">

//                                                     <Col md={9}>
//                                                         <div className=' room-booking-card w-100 pe-3'>

//                                                             <div className="room-details">

//                                                                 <div className='d-flex align-items-center justify-between W-100 mb-3 '>
//                                                                     <div className='r2' style={{ maxWidth: '130px' }}  >
//                                                                         <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
//                                                                         <h4>N/A</h4>


//                                                                     </div>

//                                                                     <div className='r2 text-center'>
//                                                                         <Image src='./images/icons/no-avaible.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />
//                                                                         No availability
//                                                                     </div>


//                                                                     <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '130px' }} >
//                                                                         <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
//                                                                         <h4>N/A</h4>


//                                                                     </div>

//                                                                 </div>






//                                                             </div>
//                                                         </div>
//                                                     </Col>
//                                                     <Col md={3} className='h-100' >
//                                                         <div className="booking-section text-end">

//                                                             <p className='mb-0' >This room is already booked for your selected dates.</p>
//                                                             <Button onClick={marknoShowModal} variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Change Dates</Button>
//                                                             <p className='mb-0' >or</p>
//                                                             <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Book Hotel
//                                                                 <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
//                                                             </Button>

//                                                         </div>
//                                                     </Col>
//                                                 </Row>
//                                             </div>


//                                             <div className='border-bottom-custom mb-3 pb-3' style={{ borderColor: '#463527' }} >
//                                                 <Row className="align-items-center">

//                                                     <Col md={9}>
//                                                         <div className=' room-booking-card w-100 pe-3'>

//                                                             <div className="room-details">

//                                                                 <div className='d-flex align-items-center justify-between W-100 mb-3 '>
//                                                                     <div className='r2' style={{ maxWidth: '130px' }}  >
//                                                                         <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
//                                                                         <h4>Room 4</h4>

//                                                                         <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
//                                                                     </div>

//                                                                     <div className='r2 text-center'>
//                                                                         <Image src='./images/icons/line-long.svg' className='img-fluid mb-2' alt="switch" width={200} height={40} />

//                                                                     </div>


//                                                                     <div className='r2' style={{ justifyContent: 'end', textAlign: 'right', alignItems: 'center', maxWidth: '130px' }} >
//                                                                         <span style={{ color: '#73615F' }} >Sun, 3 Aug, 2025</span>
//                                                                         <h4>Room 4</h4>

//                                                                         <span style={{ color: '#463527', lineHeight: '20px' }} >Check-in</span>
//                                                                     </div>

//                                                                 </div>

//                                                                 <div className='d-flex justify-between align-items-start'>
//                                                                     <div className='colum-1'>

//                                                                         <div className="room-specs mb-2">
//                                                                             <span className="spec-item">Room 3</span> |
//                                                                             <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>

//                                                                         </div>







//                                                                     </div>

//                                                                     <div className='colum-2'>

//                                                                         <Link href="#" onClick={filterShow2} className='edit-btn py-2 px-4' >View Details</Link>

//                                                                     </div>

//                                                                 </div>




//                                                             </div>
//                                                         </div>
//                                                     </Col>
//                                                     <Col md={3}>
//                                                         <div className="booking-section  text-end">
//                                                             {showPrices && (
//                                                                 <p className='room-price' >From <br />
//                                                                     <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹3939</span> <br />
//                                                                     / night
//                                                                 </p>
//                                                             )}
//                                                             <Link href='./TwinBedroomReserve2' className="reserve-btn">Reserve</Link>

//                                                         </div>
//                                                     </Col>
//                                                 </Row>
//                                             </div>



//                                         </div>






//                                     </div>
//                                 </div>











//                             </>
//                         )}




//                     </Tab>


//                     <Tab eventKey="twin-sharing-rooms" title="Shared Rooms">

//                         <div className="property-results">
//                             <div className="property-card mb-4">
//                                 <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
//                                     <label className='mb-0 d-flex gap-2 align-items-center' >
//                                         <input type="checkbox" className="mx-2 custom-checkbox" checked={showPrices} onChange={(e) => setShowPrices(e.target.checked)} />
//                                         Show room prices
//                                     </label>

//                                     <div className='filter-right-option d-flex gap-3'>
//                                         <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>


//                                             <Button variant="" className='btn-sort'> Sort by :
//                                                 <Select
//                                                     name="aria-role-select"
//                                                     options={sortoption}
//                                                     placeholder="Name"
//                                                     className="react_selectbox"
//                                                     isSearchable={false}
//                                                     styles={customStyles}
//                                                 />

//                                             </Button>

//                                         </div>

//                                     </div>

//                                 </div>

//                                 {/* <p className='text-right p-title position-relative' >
//                                                         <span>Property 1 </span>  </p>
                                                    
//                                                     <div className="room-card mt-4">
//                                                         <Link href="./PropertyDetails" className='text-black text-decoration-none' >
//                                                             <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>

//                                                                 <Image
//                                                                     src="/images/icons/amentiy.jpg"
//                                                                     alt="Room"
//                                                                     width={56}
//                                                                     height={56}
//                                                                     className="img-fluid"
//                                                                 />

//                                                                 <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >Casa Melhor Yayati Tulip 17th Floor</p>
//                                                             </div>
//                                                         </Link>

//                                                         <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
//                                                             <Row className="align-items-center">

//                                                                 <Col md={9}>
//                                                                     <div className='d-flex gap-3 room-booking-card'>
//                                                                         <div className="room-image position-relative">

//                                                                             <Link href="./ViewDetailsResult">
//                                                                                 <Image
//                                                                                     src="/images/icons/room-img1.jpg"
//                                                                                     alt="Room"
//                                                                                     width={104}
//                                                                                     height={192}
//                                                                                     className="img-fluid"
//                                                                                 />

//                                                                             </Link>

//                                                                             <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
//                                                                         </div>
//                                                                         <div className="room-details">
//                                                                             <div className='r-detail-1'>
//                                                                                 <h4 className='room-title'> Room 4   <span className='room-type-badge' >Shared Rooms</span> </h4>
//                                                                                 <div className="room-specs mb-2">
//                                                                                     <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span>
//                                                                                     <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>
//                                                                                     <span className="spec-item">538 sq ft</span>
//                                                                                 </div>
//                                                                                 <div className="amenities mb-2">
//                                                                                     <span className="amenity-item">36&quot; flat-screen TV</span>
//                                                                                     <span className="amenity-item">Ceiling fans</span>
//                                                                                     <span className="amenity-item">Coffee maker</span>
//                                                                                     <span className="amenity-item">Robes</span>
//                                                                                     <span className="amenity-item">Hair dryer</span>
//                                                                                     <span className="amenity-item">Iron and ironing board</span>
//                                                                                 </div>

//                                                                                 <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>

//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 </Col>
//                                                                 <Col md={3}>
//                                                                     <div className="booking-section  text-end">
//                                                                         {showPrices && (
//                                                                             <p className='room-price' >From <br />
//                                                                                 <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹3939</span> <br />
//                                                                                 / night
//                                                                             </p>
//                                                                         )}

//                                                                         {!showCart && !reserved && (
//                                                                             <Link
//                                                                                 href="#"
//                                                                                 onClick={() => setShowCart(true)}
//                                                                                 className="reserve-btn-add"
//                                                                             >
//                                                                                 <Image
//                                                                                     src="/images/icons/Plus.svg"
//                                                                                     className="img-fluid"
//                                                                                     alt="add"
//                                                                                     width={16}
//                                                                                     height={16}
//                                                                                 />
//                                                                                 Add
//                                                                             </Link>
//                                                                         )}

                                                                        
//                                                                         {showCart && !reserved && (
//                                                                             <div className='counter-box'>

//                                                                                 <button
//                                                                                     className='btn'
//                                                                                     onClick={() => setCount4(count4 > 1 ? count4 - 1 : 1)}
//                                                                                 >
//                                                                                     −
//                                                                                 </button>

//                                                                                 <span className='count'>{count4}</span>

//                                                                                 <button
//                                                                                     className='btn'
//                                                                                     onClick={() => setCount4(count4 + 1)}
//                                                                                 >
//                                                                                     +
//                                                                                 </button>

                                                                                


//                                                                             </div>
//                                                                         )}

                                                                        
//                                                                         {reserved && (
//                                                                             <p className="reserved-label">Reserved</p>
//                                                                         )}



//                                                                     </div>
//                                                                 </Col>
//                                                             </Row>
//                                                         </div>

//                                                         <div className='border-bottom-custom1 disabled-room mb-3  pb-3' style={{ borderColor: '#463527' }} >
//                                                             <Row className="align-items-center">

//                                                                 <Col md={9}>
//                                                                     <div className='d-flex gap-3 room-booking-card'>
//                                                                         <div className="room-image position-relative">
//                                                                             <Link href="./ViewDetailsResult">
//                                                                                 <Image
//                                                                                     src="/images/icons/room-img1.jpg"
//                                                                                     alt="Room"
//                                                                                     width={104}
//                                                                                     height={192}
//                                                                                     className="img-fluid"
//                                                                                 />


//                                                                                 <p>Booked on your dates</p>
//                                                                             </Link>
//                                                                             <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
//                                                                         </div>
//                                                                         <div className="room-details">
//                                                                             <div className='r-detail-1'>
//                                                                                 <h4 className='room-title'> Room 4   <span className='room-type-badge' >Shared Rooms</span> </h4>
//                                                                                 <div className="room-specs mb-2">
//                                                                                     <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span>
//                                                                                     <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>
//                                                                                     <span className="spec-item">538 sq ft</span>
//                                                                                 </div>
//                                                                                 <div className="amenities mb-2">
//                                                                                     <span className="amenity-item">36&quot; flat-screen TV</span>
//                                                                                     <span className="amenity-item">Ceiling fans</span>
//                                                                                     <span className="amenity-item">Coffee maker</span>
//                                                                                     <span className="amenity-item">Robes</span>
//                                                                                     <span className="amenity-item">Hair dryer</span>
//                                                                                     <span className="amenity-item">Iron and ironing board</span>
//                                                                                 </div>

//                                                                                 <Link href="#" className="room-details-link ">Room Details</Link>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 </Col>
//                                                                 <Col md={3} className='h-100' >
//                                                                     <div className="booking-section text-end">
//                                                                         {showPrices && (
//                                                                             <p className='room-price' >From <br />
//                                                                                 <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹3939</span> <br />
//                                                                                 / night
//                                                                             </p>
//                                                                         )}
//                                                                         <p className='mb-0' >This room is already booked for your selected dates.</p>
//                                                                         <Button onClick={marknoShowModal} variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Change Dates</Button>
//                                                                         <p className='mb-0' >or</p>
//                                                                         <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Book Hotel
//                                                                             <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
//                                                                         </Button>

//                                                                     </div>
//                                                                 </Col>
//                                                             </Row>
//                                                         </div>

//                                                     </div> */}
//                                 {bookingRoomsData.map((item, i) => (<div key={i}>
//                                     <p className='text-right p-title position-relative' >
//                                         <span>Property {i + 1} </span>  </p>


//                                     {/* Room Card 1 */}
//                                     {item?.properties.map((prop, ind) => (<div key={ind} className="room-card mt-4">
//                                         <Link href="./PropertyDetails" className='text-black text-decoration-none' >
//                                             <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>

//                                                 <Image
//                                                     src={prop?.cover_photo ? `https://alicedevapi.casamelhor.in${prop?.cover_photo}` : `/images/icons/No-Image.svg`}
//                                                     alt="Room"
//                                                     width={56}
//                                                     height={56}
//                                                     className="img-fluid"
//                                                 />

//                                                 <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >{prop?.property_name}</p>
//                                             </div>
//                                         </Link>

//                                         {prop.rooms.length > 0 && prop.rooms.map((room, index) => (<div key={index} className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
//                                             <Row className="align-items-center">

//                                                 <Col md={9}>
//                                                     <div className='d-flex gap-3 room-booking-card'>
//                                                         <div className="room-image position-relative">
//                                                             <Link href="./ViewDetailsResult">
//                                                                 <Image
//                                                                     src={room?.cover_photo ? `https://alicedevapi.casamelhor.in${room?.cover_photo}` : `/images/icons/No-Image.svg`}
//                                                                     alt="Room"
//                                                                     width={104}
//                                                                     height={192}
//                                                                     className="img-fluid"
//                                                                 />

//                                                             </Link>

//                                                             <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" />{room.rooms_photo.length}</span>
//                                                         </div>
//                                                         <div className="room-details">
//                                                             <div className='r-detail-1'>
//                                                                 <h4 className='room-title'> {room?.room_name}   {room?.room_type === roomType && <span className='room-type-badge' >Shared Room</span>} </h4>
//                                                                 <div className="room-specs mb-2">
//                                                                     <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps {room?.max_guests}</span>
//                                                                     <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> {room.beds.length} bed</span>
//                                                                     <span className="spec-item">{room?.room_size_sqft} sq ft</span>
//                                                                 </div>
//                                                                 <div className="amenities mb-2">
//                                                                     {room?.room_amenities.map((amenity, inde) => (<span key={inde} className="amenity-item">{amenity}</span>))}
//                                                                 </div>

//                                                                 <Link href="#" onClick={() => { filterShow(room) }} className="room-details-link ">Room Details</Link>
//                                                             </div>
//                                                             <div className="room-specs mb-2 ">

//                                                                 {room?.bedroom_preference === "Female" && <span className='female-preferred'>
//                                                                     Female PREFERRED
//                                                                 </span>}
//                                                                 {room?.bedroom_preference === "Male" && <span className='male-preferred'>
//                                                                     Male PREFERRED
//                                                                 </span>}

//                                                                 <span className=" badge-grey text-uppercase" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>Only 1 bed left!</span>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </Col>
//                                                 {room.is_available ? <Col md={3}>
//                                                     <div className="booking-section  text-end">
//                                                         {showPrices && (
//                                                             <p className='room-price' >From <br />
//                                                                 <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹{room.price_per_night}</span> <br />
//                                                                 / night
//                                                             </p>
//                                                         )}
//                                                         <Link href='./ReserveBooking' className="reserve-btn">Reserve</Link>

//                                                     </div>
//                                                 </Col>
//                                                     :
//                                                     <Col md={3} className='h-100' >
//                                                         <div className="booking-section text-end">
//                                                             <p className='mb-0' >Adjust your dates for availability.</p>
//                                                             <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Change Dates</Button>
//                                                             <p className='mb-0' >or</p>
//                                                             <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Book Hotel
//                                                                 <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
//                                                             </Button>


//                                                         </div>
//                                                     </Col>}
//                                             </Row>
//                                         </div>))}
//                                     </div>))}
//                                 </div>))}


//                             </div>
//                         </div>

//                     </Tab>

//                 </Tabs>
//             </Tab>

//             <Tab eventKey="bed-Rooms2" title={<TabTitle2 />} tabClassName="custom-tab">

//                 <Tabs
//                     defaultActiveKey="private-Rooms"
//                     id="uncontrolled-tab-example"
//                     className="mb-3 mt-3 compnay-detail-tabs tab-50-50"
//                 >
//                     <Tab eventKey="private-Rooms" title="Private Rooms">




//                         <div className="property-results">
//                             <div className="property-card mb-4">
//                                 <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
//                                     <label className='mb-0 d-flex gap-2 align-items-center' >
//                                         <input type="checkbox" className="mx-2 custom-checkbox" checked={showPrices} onChange={(e) => setShowPrices(e.target.checked)} />
//                                         Show room prices
//                                     </label>

//                                     <div className='filter-right-option d-flex gap-3'>
//                                         <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>


//                                             <Button variant="" className='btn-sort'> Sort by :
//                                                 <Select
//                                                     name="aria-role-select"
//                                                     options={sortoption}
//                                                     placeholder="Name"
//                                                     className="react_selectbox"
//                                                     isSearchable={false}
//                                                     styles={customStyles}
//                                                 />

//                                             </Button>

//                                         </div>

//                                     </div>

//                                 </div>

//                                 <p className='text-right p-title position-relative' >
//                                     <span>Property 1 </span>  </p>


//                                 {/* Room Card 1 */}
//                                 <div className="room-card mt-4">
//                                     <Link href="./PropertyDetails" className='text-black text-decoration-none' >
//                                         <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>

//                                             <Image
//                                                 src="/images/icons/amentiy.jpg"
//                                                 alt="Room"
//                                                 width={56}
//                                                 height={56}
//                                                 className="img-fluid"
//                                             />

//                                             <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >Casa Melhor Yayati Tulip 17th Floor</p>
//                                         </div>
//                                     </Link>

//                                     <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
//                                         <Row className="align-items-center">

//                                             <Col md={9}>
//                                                 <div className='d-flex gap-3 room-booking-card'>
//                                                     <div className="room-image position-relative">

//                                                         <Link href="./ViewDetailsResult">
//                                                             <Image
//                                                                 src="/images/icons/room-img1.jpg"
//                                                                 alt="Room"
//                                                                 width={104}
//                                                                 height={192}
//                                                                 className="img-fluid"
//                                                             />

//                                                         </Link>

//                                                         <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
//                                                     </div>
//                                                     <div className="room-details">
//                                                         <div className='r-detail-1'>
//                                                             <h4 className='room-title'> Room 4   <span className='room-type-badge' >Private Room</span> </h4>
//                                                             <div className="room-specs mb-2">
//                                                                 <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span>
//                                                                 <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>
//                                                                 <span className="spec-item">538 sq ft</span>
//                                                             </div>
//                                                             <div className="amenities mb-2">
//                                                                 <span className="amenity-item">36&quot; flat-screen TV</span>
//                                                                 <span className="amenity-item">Ceiling fans</span>
//                                                                 <span className="amenity-item">Coffee maker</span>
//                                                                 <span className="amenity-item">Robes</span>
//                                                                 <span className="amenity-item">Hair dryer</span>
//                                                                 <span className="amenity-item">Iron and ironing board</span>
//                                                             </div>

//                                                             <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>

//                                                         </div>

//                                                         <div className="room-specs mb-2 ">

//                                                             <span className='female-preferred'>
//                                                                 Female PREFERRED
//                                                             </span>

//                                                             <span className=" badge-grey text-uppercase" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>Only 2 bed left!</span>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </Col>
//                                             <Col md={3}>
//                                                 <div className="booking-section  text-end">
//                                                     {showPrices && (
//                                                         <p className='room-price' >From <br />
//                                                             <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹3939</span> <br />
//                                                             / night
//                                                         </p>
//                                                     )}
//                                                     <Link onClick={() => setShowCart(true)} href='#' className="reserve-btn-add"><Image src="./images/icons/Plus.svg" className="img-fluid" alt="add" width={16} height={16} />
//                                                         Add</Link>

//                                                 </div>
//                                             </Col>
//                                         </Row>
//                                     </div>

//                                     <div className='border-bottom-custom1 disabled-room mb-3  pb-3' style={{ borderColor: '#463527' }} >
//                                         <Row className="align-items-center">

//                                             <Col md={9}>
//                                                 <div className='d-flex gap-3 room-booking-card'>
//                                                     <div className="room-image position-relative">
//                                                         <Link href="./ViewDetailsResult">
//                                                             <Image
//                                                                 src="/images/icons/room-img1.jpg"
//                                                                 alt="Room"
//                                                                 width={104}
//                                                                 height={192}
//                                                                 className="img-fluid"
//                                                             />


//                                                             <p>Booked on your dates</p>
//                                                         </Link>
//                                                         <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
//                                                     </div>
//                                                     <div className="room-details">
//                                                         <div className='r-detail-1'>
//                                                             <h4 className='room-title'> Room 4   <span className='room-type-badge' >Private Room</span> </h4>
//                                                             <div className="room-specs mb-2">
//                                                                 <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span>
//                                                                 <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>
//                                                                 <span className="spec-item">538 sq ft</span>
//                                                             </div>
//                                                             <div className="amenities mb-2">
//                                                                 <span className="amenity-item">36&quot; flat-screen TV</span>
//                                                                 <span className="amenity-item">Ceiling fans</span>
//                                                                 <span className="amenity-item">Coffee maker</span>
//                                                                 <span className="amenity-item">Robes</span>
//                                                                 <span className="amenity-item">Hair dryer</span>
//                                                                 <span className="amenity-item">Iron and ironing board</span>
//                                                             </div>

//                                                             <Link href="#" className="room-details-link ">Room Details</Link>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </Col>
//                                             <Col md={3} className='h-100' >
//                                                 <div className="booking-section text-end">
//                                                     {showPrices && (
//                                                         <p className='room-price' >From <br />
//                                                             <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹3939</span> <br />
//                                                             / night
//                                                         </p>
//                                                     )}
//                                                     <p className='mb-0' >This room is already booked for your selected dates.</p>
//                                                     <Button onClick={marknoShowModal} variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Change Dates</Button>
//                                                     <p className='mb-0' >or</p>
//                                                     <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Book Hotel
//                                                         <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
//                                                     </Button>

//                                                 </div>
//                                             </Col>
//                                         </Row>
//                                     </div>

//                                 </div>


//                                 <p className='text-right p-title position-relative' >
//                                     <span>Property 3 </span>  </p>


//                                 <div className="room-card mt-4">
//                                     <Link href="./PropertyDetails" className='text-black text-decoration-none' >
//                                         <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>

//                                             <Image
//                                                 src="/images/icons/amentiy.jpg"
//                                                 alt="Room"
//                                                 width={56}
//                                                 height={56}
//                                                 className="img-fluid"
//                                             />

//                                             <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >Casa Melhor Yayati Tulip 17th Floor</p>
//                                         </div>
//                                     </Link>

//                                     <div className='border-bottom-custom mb-3 pb-3' style={{ borderColor: '#463527' }} >
//                                         <Row className="align-items-center">

//                                             <Col md={9}>
//                                                 <div className='d-flex gap-3 room-booking-card'>
//                                                     <div className="room-image position-relative">
//                                                         <Image
//                                                             src="/images/icons/room-img1.jpg"
//                                                             alt="Room"
//                                                             width={104}
//                                                             height={192}
//                                                             className="img-fluid"
//                                                         />

//                                                         <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
//                                                     </div>
//                                                     <div className="room-details">
//                                                         <div className='r-detail-1'>
//                                                             <h4>Room 1</h4>
//                                                             <div className="room-specs mb-2">
//                                                                 <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span>
//                                                                 <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>
//                                                                 <span className="spec-item">538 sq ft</span>
//                                                             </div>
//                                                             <div className="amenities mb-2">
//                                                                 <span className="amenity-item">36&quot; flat-screen TV</span>
//                                                                 <span className="amenity-item">Ceiling fans</span>
//                                                                 <span className="amenity-item">Coffee maker</span>
//                                                                 <span className="amenity-item">Robes</span>
//                                                                 <span className="amenity-item">Hair dryer</span>
//                                                                 <span className="amenity-item">Iron and ironing board</span>
//                                                             </div>

//                                                             <Link href="#" className="room-details-link ">Room Details</Link>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </Col>
//                                             <Col md={3}>
//                                                 <div className="booking-section text-end">
//                                                     {showPrices && (
//                                                         <p className='room-price' >From <br />
//                                                             <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }}>₹3939</span> <br />
//                                                             / night
//                                                         </p>
//                                                     )}
//                                                     <Link onClick={() => setShowCart2(true)} href='#' className="reserve-btn-add"><Image src="./images/icons/Plus.svg" className="img-fluid" alt="add" width={16} height={16} />
//                                                         Add</Link>

//                                                 </div>
//                                             </Col>
//                                         </Row>
//                                     </div>


//                                     <div className='border-bottom-custom mb-3 pb-3' style={{ borderColor: '#463527' }} >
//                                         <Row className="align-items-center">

//                                             <Col md={9}>
//                                                 <div className='d-flex gap-3 room-booking-card'>
//                                                     <div className="room-image position-relative">
//                                                         <Image
//                                                             src="/images/icons/room-img1.jpg"
//                                                             alt="Room"
//                                                             width={104}
//                                                             height={192}
//                                                             className="img-fluid"
//                                                         />

//                                                         <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
//                                                     </div>
//                                                     <div className="room-details">
//                                                         <div className='r-detail-1'>
//                                                             <h4>Room 2</h4>
//                                                             <div className="room-specs mb-2">
//                                                                 <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span>
//                                                                 <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>
//                                                                 <span className="spec-item">538 sq ft</span>
//                                                             </div>
//                                                             <div className="amenities mb-2">
//                                                                 <span className="amenity-item">36&quot; flat-screen TV</span>
//                                                                 <span className="amenity-item">Ceiling fans</span>
//                                                                 <span className="amenity-item">Coffee maker</span>
//                                                                 <span className="amenity-item">Robes</span>
//                                                                 <span className="amenity-item">Hair dryer</span>
//                                                                 <span className="amenity-item">Iron and ironing board</span>
//                                                             </div>

//                                                             <Link href="#" className="room-details-link ">Room Details</Link>
//                                                         </div>
//                                                         <p className='male-preferred'>
//                                                             Male PREFERRED
//                                                         </p>

//                                                     </div>
//                                                 </div>
//                                             </Col>
//                                             <Col md={3}>
//                                                 <div className="booking-section text-end">
//                                                     {showPrices && (
//                                                         <p className='room-price' >From <br />
//                                                             <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }}>₹3939</span> <br />
//                                                             / night
//                                                         </p>
//                                                     )}
//                                                     <Link href='#' className="reserve-btn-add"><Image src="./images/icons/Plus.svg" className="img-fluid" alt="add" width={16} height={16} />
//                                                         Add</Link>

//                                                 </div>
//                                             </Col>
//                                         </Row>
//                                     </div>


//                                     <div className='border-bottom-custom mb-3 pb-3' style={{ borderColor: '#463527' }} >
//                                         <Row className="align-items-center">

//                                             <Col md={9}>
//                                                 <div className='d-flex gap-3 room-booking-card'>
//                                                     <div className="room-image position-relative">
//                                                         <Image
//                                                             src="/images/icons/room-img1.jpg"
//                                                             alt="Room"
//                                                             width={104}
//                                                             height={192}
//                                                             className="img-fluid"
//                                                         />

//                                                         <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
//                                                     </div>
//                                                     <div className="room-details">
//                                                         <div className='r-detail-1'>
//                                                             <h4>Room 3</h4>
//                                                             <div className="room-specs mb-2">
//                                                                 <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span>
//                                                                 <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>
//                                                                 <span className="spec-item">538 sq ft</span>
//                                                             </div>
//                                                             <div className="amenities mb-2">
//                                                                 <span className="amenity-item">36&quot; flat-screen TV</span>
//                                                                 <span className="amenity-item">Ceiling fans</span>
//                                                                 <span className="amenity-item">Coffee maker</span>
//                                                                 <span className="amenity-item">Robes</span>
//                                                                 <span className="amenity-item">Hair dryer</span>
//                                                                 <span className="amenity-item">Iron and ironing board</span>
//                                                             </div>

//                                                             <Link href="#" className="room-details-link ">Room Details</Link>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </Col>
//                                             <Col md={3}>
//                                                 <div className="booking-section text-end">
//                                                     {showPrices && (
//                                                         <p className='room-price' >From <br />
//                                                             <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }}>₹3939</span> <br />
//                                                             / night
//                                                         </p>
//                                                     )}
//                                                     <Link href='#' className="reserve-btn-add"><Image src="./images/icons/Plus.svg" className="img-fluid" alt="add" width={16} height={16} />
//                                                         Add</Link>

//                                                 </div>
//                                             </Col>
//                                         </Row>
//                                     </div>

//                                     <div className='border-bottom-custom mb-3 pb-3' style={{ borderColor: '#463527' }} >
//                                         <Row className="align-items-center">

//                                             <Col md={9}>
//                                                 <div className='d-flex gap-3 room-booking-card'>
//                                                     <div className="room-image position-relative">
//                                                         <Image
//                                                             src="/images/icons/room-img1.jpg"
//                                                             alt="Room"
//                                                             width={104}
//                                                             height={192}
//                                                             className="img-fluid"
//                                                         />

//                                                         <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
//                                                     </div>
//                                                     <div className="room-details">
//                                                         <div className='r-detail-1'>
//                                                             <h4>Room 4</h4>
//                                                             <div className="room-specs mb-2">
//                                                                 <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span>
//                                                                 <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>
//                                                                 <span className="spec-item">538 sq ft</span>
//                                                             </div>
//                                                             <div className="amenities mb-2">
//                                                                 <span className="amenity-item">36&quot; flat-screen TV</span>
//                                                                 <span className="amenity-item">Ceiling fans</span>
//                                                                 <span className="amenity-item">Coffee maker</span>
//                                                                 <span className="amenity-item">Robes</span>
//                                                                 <span className="amenity-item">Hair dryer</span>
//                                                                 <span className="amenity-item">Iron and ironing board</span>
//                                                             </div>

//                                                             <Link href="#" className="room-details-link ">Room Details</Link>


//                                                         </div>

//                                                         <p className='female-preferred'>
//                                                             Female PREFERRED
//                                                         </p>
//                                                     </div>

//                                                 </div>
//                                             </Col>
//                                             <Col md={3}>
//                                                 <div className="booking-section text-end">
//                                                     {showPrices && (
//                                                         <p className='room-price' >From <br />
//                                                             <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }}>₹3939</span> <br />
//                                                             / night
//                                                         </p>
//                                                     )}
//                                                     <Link href='#' className="reserve-btn-add"><Image src="./images/icons/Plus.svg" className="img-fluid" alt="add" width={16} height={16} />
//                                                         Add</Link>

//                                                 </div>
//                                             </Col>
//                                         </Row>
//                                     </div>



//                                 </div>



//                                 <p className='text-right p-title position-relative' >
//                                     <span>Property 3 </span>  </p>


//                                 {/* Room Card 1 */}
//                                 <div className="room-card mt-4">
//                                     <div className='d-flex gap-2 align-items-center border-bottom-custom1 pb-3 mb-3'>
//                                         <Image
//                                             src="/images/icons/amentiy.jpg"
//                                             alt="Room"
//                                             width={56}
//                                             height={56}
//                                             className="img-fluid"
//                                         />
//                                         <p className="property-name fw-medium mb-0">Casa Melhor Yayati Tulip 17th Floor</p>
//                                     </div>


//                                     <div className='border-bottom-custom disabled-room mb-3  pb-3' style={{ borderColor: '#463527' }} >
//                                         <Row className="align-items-center">

//                                             <Col md={9}>
//                                                 <div className='d-flex gap-3 room-booking-card'>
//                                                     <p className='fs-20' >No rooms available</p>
//                                                 </div>
//                                             </Col>
//                                             <Col md={3} className='h-100' >
//                                                 <div className="booking-section text-end">
//                                                     <p className='mb-0' >Adjust your dates for availability.</p>
//                                                     <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Change Dates</Button>
//                                                     <p className='mb-0' >or</p>
//                                                     <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Book Hotel
//                                                         <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
//                                                     </Button>


//                                                 </div>
//                                             </Col>
//                                         </Row>
//                                     </div>




//                                 </div>


//                             </div>
//                         </div>




//                     </Tab>


//                     <Tab eventKey="twin-sharing-rooms" title="Shared Rooms">

//                         <div className="property-results">
//                             <div className="property-card mb-4">
//                                 <div className='mobile-column-filter-1 d-flex justify-content-between align-items-center mb-4 pt-3'>
//                                     <label className='mb-0 d-flex gap-2 align-items-center' >
//                                         <input type="checkbox" className="mx-2 custom-checkbox" checked={showPrices} onChange={(e) => setShowPrices(e.target.checked)} />
//                                         Show room prices
//                                     </label>

//                                     <div className='filter-right-option d-flex gap-3'>
//                                         <div className='pagination-list d-flex gap-3 align-items-center justify-content-end'>


//                                             <Button variant="" className='btn-sort'> Sort by :
//                                                 <Select
//                                                     name="aria-role-select"
//                                                     options={sortoption}
//                                                     placeholder="Name"
//                                                     className="react_selectbox"
//                                                     isSearchable={false}
//                                                     styles={customStyles}
//                                                 />

//                                             </Button>

//                                         </div>

//                                     </div>

//                                 </div>

//                                 <p className='text-right p-title position-relative' >
//                                     <span>Property 1 </span>  </p>


//                                 {/* Room Card 1 */}
//                                 <div className="room-card mt-4">
//                                     <Link href="./PropertyDetails" className='text-black text-decoration-none' >
//                                         <div className='d-flex gap-2 align-items-center mb-3 border-bottom-custom1 pb-3'>

//                                             <Image
//                                                 src="/images/icons/amentiy.jpg"
//                                                 alt="Room"
//                                                 width={56}
//                                                 height={56}
//                                                 className="img-fluid"
//                                             />

//                                             <p className="property-name fw-medium mb-0" style={{ textDecoration: 'none' }} >Casa Melhor Yayati Tulip 17th Floor</p>
//                                         </div>
//                                     </Link>

//                                     <div className='border-bottom-custom1 mb-3 pb-3' style={{ borderColor: '#463527' }} >
//                                         <Row className="align-items-center">

//                                             <Col md={9}>
//                                                 <div className='d-flex gap-3 room-booking-card'>
//                                                     <div className="room-image position-relative">

//                                                         <Link href="./ViewDetailsResult">
//                                                             <Image
//                                                                 src="/images/icons/room-img1.jpg"
//                                                                 alt="Room"
//                                                                 width={104}
//                                                                 height={192}
//                                                                 className="img-fluid"
//                                                             />

//                                                         </Link>

//                                                         <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
//                                                     </div>
//                                                     <div className="room-details">
//                                                         <div className='r-detail-1'>
//                                                             <h4 className='room-title'> Room 4   <span className='room-type-badge' >Shared Rooms</span> </h4>
//                                                             <div className="room-specs mb-2">
//                                                                 <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span>
//                                                                 <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>
//                                                                 <span className="spec-item">538 sq ft</span>
//                                                             </div>
//                                                             <div className="amenities mb-2">
//                                                                 <span className="amenity-item">36&quot; flat-screen TV</span>
//                                                                 <span className="amenity-item">Ceiling fans</span>
//                                                                 <span className="amenity-item">Coffee maker</span>
//                                                                 <span className="amenity-item">Robes</span>
//                                                                 <span className="amenity-item">Hair dryer</span>
//                                                                 <span className="amenity-item">Iron and ironing board</span>
//                                                             </div>

//                                                             <Link href="#" onClick={filterShow} className="room-details-link ">Room Details</Link>

//                                                         </div>


//                                                         <div className="room-specs mb-2 ">

//                                                             <span className='female-booked '>
//                                                                 Female Booked
//                                                             </span>

//                                                             <span className=" badge-grey text-uppercase" style={{ background: '#F2EAFA', color: '#7F32CD', fontSize: '12px', padding: '6px 10px', borderRadius: '4px', lineHeight: '12px' }}>Only 2 bed left!</span>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </Col>
//                                             <Col md={3}>
//                                                 <div className="booking-section  text-end">
//                                                     {showPrices && (
//                                                         <p className='room-price' >From <br />
//                                                             <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹3939</span> <br />
//                                                             / night
//                                                         </p>
//                                                     )}


//                                                     <Link onClick={() => setShowCart2(true)} href='#' className="reserve-btn-add"><Image src="./images/icons/Plus.svg" className="img-fluid" alt="add" width={16} height={16} />
//                                                         Add</Link>

//                                                 </div>
//                                             </Col>
//                                         </Row>
//                                     </div>

//                                     <div className='border-bottom-custom1 disabled-room mb-3  pb-3' style={{ borderColor: '#463527' }} >
//                                         <Row className="align-items-center">

//                                             <Col md={9}>
//                                                 <div className='d-flex gap-3 room-booking-card'>
//                                                     <div className="room-image position-relative">
//                                                         <Link href="./ViewDetailsResult">
//                                                             <Image
//                                                                 src="/images/icons/room-img1.jpg"
//                                                                 alt="Room"
//                                                                 width={104}
//                                                                 height={192}
//                                                                 className="img-fluid"
//                                                             />


//                                                             <p>Booked on your dates</p>
//                                                         </Link>
//                                                         <span className="image-count"><Image src="./images/icons/image_w.svg" width={16} height={16} alt="count" /> 5</span>
//                                                     </div>
//                                                     <div className="room-details">
//                                                         <div className='r-detail-1'>
//                                                             <h4 className='room-title'> Room 4   <span className='room-type-badge' >Shared Rooms</span> </h4>
//                                                             <div className="room-specs mb-2">
//                                                                 <span className="spec-item"><Image src="./images/icons/person.svg" width={16} height={16} alt="bed" /> Sleeps 2</span>
//                                                                 <span className="spec-item"><Image src="./images/icons/single_bed.svg" width={16} height={16} alt="area" /> 1 king bed</span>
//                                                                 <span className="spec-item">538 sq ft</span>
//                                                             </div>
//                                                             <div className="amenities mb-2">
//                                                                 <span className="amenity-item">36&quot; flat-screen TV</span>
//                                                                 <span className="amenity-item">Ceiling fans</span>
//                                                                 <span className="amenity-item">Coffee maker</span>
//                                                                 <span className="amenity-item">Robes</span>
//                                                                 <span className="amenity-item">Hair dryer</span>
//                                                                 <span className="amenity-item">Iron and ironing board</span>
//                                                             </div>

//                                                             <Link href="#" className="room-details-link ">Room Details</Link>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </Col>
//                                             <Col md={3} className='h-100' >
//                                                 <div className="booking-section text-end">
//                                                     {showPrices && (
//                                                         <p className='room-price' >From <br />
//                                                             <span style={{ fontSize: '2rem', fontWeight: '500', color: '#BF9039', fontFamily: 'Felgine' }} >₹3939</span> <br />
//                                                             / night
//                                                         </p>
//                                                     )}
//                                                     <p className='mb-0' >This room is already booked for your selected dates.</p>
//                                                     <Button onClick={marknoShowModal} variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Change Dates</Button>
//                                                     <p className='mb-0' >or</p>
//                                                     <Button variant="" className="edit-btn text-center justify-center" style={{ width: '133px', height: '48px' }} >Book Hotel
//                                                         <Image src='./images/icons/open_in_new.svg' className='img-fluid ms-1' width={20} height={20} alt='opnenew' />
//                                                     </Button>

//                                                 </div>
//                                             </Col>
//                                         </Row>
//                                     </div>

//                                 </div>


//                             </div>
//                         </div>

//                     </Tab>

//                 </Tabs>
//             </Tab>


//         </Tabs>
//     )
// }
