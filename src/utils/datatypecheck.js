export const isBinaryData = (value) => {
  return (
    value instanceof ArrayBuffer ||
    ArrayBuffer.isView(value) ||
    value instanceof Blob ||
    value instanceof File
  );
};

export const downloadCSV = (csvContent, filename = "data.csv") => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
export const downloadPdfFromBase64 = (base64Data, filename) => {
  
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  
  const blob = new Blob([byteArray], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "file.pdf";
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};


// {
//   Array.from({ length: cart?.room_type == "Private" ? 1 : cart?.max_guests }).map((_, ind) => (
//     <div className="row">
//       <div className="col-md-4">
//         {Array.from({ length: cart?.room_type == "Private" ? 1 : cart?.max_guests }).map((_, ind) => (
//           <Select
//             key={ind}
//             name="traveller_type"
//             options={travelOption}
//             placeholder="Choose Role"
//             className='react_selectbox'
//             isSearchable={false}
//             styles={customStyles}
//             onChange={(e) => handleSelectDropdown(e, index, ind)}
//             components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
//           />
//         ))}
//         <Select
//           key={ind}
//           name="traveller_type"
//           options={travelOption}
//           placeholder="Choose Role"
//           className='react_selectbox'
//           isSearchable={false}
//           styles={customStyles}
//           onChange={(e) => handleSelectDropdown(e, index, ind)}
//           components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
//         />
//       </div>
//       {cart?.room_type == "Twin-Sharing" && (
//         <div className="col-md-3">
//           {Array.from({ length: cart?.max_guests }).map((_, ind) => (
//             <Select
//               key={ind}
//               name="bed_index"
//               options={cart?.beds?.filter((_, index) => cart?.available_beds?.includes(index))?.map((cv, i) => ({ value: i, label: cv.name, type: cv.type }))}
//               placeholder="Choose bed"
//               className='react_selectbox'
//               isSearchable={false}
//               styles={customStyles}
//               onChange={(e) => handleBedBookIndex(e, cart, ind)}
//             // components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
//             />
//           ))}
//         </div>
//       )}
//       {cart?.room_type == "Twin-Sharing" && (
//         <div className="col-md-3">
//           <Select
//             key={ind}
//             name="bed_index"
//             options={cart?.beds?.filter((_, index) => cart?.available_beds?.includes(index))?.map((cv, i) => ({ value: i, label: cv.name, type: cv.type }))}
//             placeholder="Choose bed"
//             className='react_selectbox'
//             isSearchable={false}
//             styles={customStyles}
//             onChange={(e) => handleBedBookIndex(e, cart, ind)}
//           // components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
//           />
//         </div>
//       )}
//       <div className="col-md-5">
//         {cart?.travelerDetails?.map((caretakerItem, cartIndex) => (
//           !caretakerItem.data && (
//             <div key={caretakerItem.id} className="form-group" style={{ position: "relative" }}>
//               <input
//                 type="text"
//                 className="form-control user-icn2"
//                 placeholder="Add a traveler"
//                 onFocus={() => setShowCaretakerList(caretakerItem.id)}
//                 onBlur={() => setTimeout(() => setShowCaretakerList(null), 200)}
//               />

//               {showCaretakerList === caretakerItem.id && (
//                 <div
//                   style={{
//                     position: "absolute",
//                     top: "58px",
//                     left: 0,
//                     right: 0,
//                     background: "#f9f6f4",
//                     border: "1px solid #6B4F3F",
//                     borderRadius: "0px",
//                     zIndex: 10,
//                     padding: "16px",
//                     maxHeight: "300px",
//                     overflowY: "auto",
//                   }}
//                 >
//                   {CaretakerList?.[index]?.[cartIndex]?.length > 0 ? (
//                     <>
//                       {CaretakerList?.[index]?.[cartIndex]?.map((caretaker, idx) => (
//                         <div
//                           className="managers-data"
//                           key={idx}
//                           // style={{
//                           //   display: "flex",
//                           //   alignItems: "center",
//                           //   marginBottom: "18px",
//                           //   borderBottom: idx < CaretakerList.length - 1 ? "1px solid #ececec" : "none",
//                           //   paddingBottom: "15px",
//                           //   cursor: "pointer",
//                           // }}
//                           onMouseDown={(e) => e.preventDefault()}
//                           onClick={() => handleCaretakerSelect(cart, caretakerItem.id, caretaker)}
//                         >
//                           <Image
//                             src={caretaker.profile_image}
//                             alt={caretaker.name}
//                             width={48}
//                             height={48}
//                             style={{
//                               borderRadius: "0px",
//                               objectFit: "cover",
//                               marginRight: "16px",
//                             }}
//                           />
//                           <div>
//                             <div style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                               {caretaker.first_name} {caretaker.last_name}{" "}
//                               {caretaker.you && (
//                                 <span style={{ fontWeight: 400, fontSize: "14px", color: "#73615F" }}>
//                                   (You)
//                                 </span>
//                               )}
//                             </div>
//                             <div style={{ fontSize: "14px", color: "#73615F" }}>{caretaker.email}</div>
//                           </div>
//                         </div>
//                       ))}

//                       {/* "Can't find someone" message at the bottom */}
//                       <div style={{
//                         borderTop: "1px solid #ececec",
//                         paddingTop: "16px",
//                         marginTop: "8px"
//                       }}>
//                         <div style={{
//                           textAlign: "left",
//                           padding: "0px",
//                         }}>
//                           <div style={{
//                             fontSize: "14px",
//                             fontWeight: "500",
//                             marginBottom: "4px",
//                             color: "#463527"
//                           }}>
//                             {`Can't find someone?`} <br></br>

//                             <Link onClick={addTravel} href='#' style={{ color: '#463527' }} >Register a new traveler</Link>
//                           </div>

//                         </div>
//                       </div>
//                     </>
//                   ) : (
//                     /* Show only when no caretakers are available */
//                     <div style={{
//                       textAlign: "center",
//                       padding: "30px 20px",
//                       color: "#73615F"
//                     }}>
//                       <div style={{
//                         marginBottom: "12px",
//                         fontSize: "18px",
//                         color: "#463527"
//                       }}>
//                         👤
//                       </div>
//                       <div style={{
//                         fontSize: "16px",
//                         fontWeight: "500",
//                         marginBottom: "8px",
//                         color: "#463527"
//                       }}>
//                         No caretakers found
//                       </div>
//                       <div style={{
//                         fontSize: "14px",
//                         marginBottom: "16px",
//                         lineHeight: "1.4"
//                       }}>
//                         {`Can't find the person you're looking for?`}
//                       </div>
//                       <button
//                         style={{
//                           background: "#6B4F3F",
//                           color: "white",
//                           border: "none",
//                           padding: "10px 20px",
//                           borderRadius: "4px",
//                           fontSize: "14px",
//                           cursor: "pointer",
//                           fontWeight: "500",
//                           width: "100%"
//                         }}
//                         onMouseDown={(e) => e.preventDefault()}
//                         onClick={() => {/* Add your invite logic here */ }}
//                       >
//                         Invite to Join
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )
//         ))}
//       </div>
//       <div className="col-md-12">
//         {cart?.travelerDetails?.map((caretakerItem) => (
//           caretakerItem.data && (
//             <div key={caretakerItem.id} className="selected-caretaker-container">
//               <div
//                 className='manager-list-full'
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   border: "1px solid rgb(128 99 75 / 24%)",
//                   borderRadius: "0px",
//                   padding: "12px 16px",
//                   // marginBottom: "8px",
//                   marginTop: "15px",
//                   width: "100%",
//                   gap: '4px'
//                 }}
//               >
//                 <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px" }}>
//                   <Image
//                     src={caretakerItem.data.profile_image}
//                     alt={caretakerItem.data.first_name}
//                     width={48}
//                     height={48}
//                     style={{
//                       borderRadius: "0px",
//                       objectFit: "cover",
//                       marginRight: "10px",
//                     }}
//                   />
//                   <span style={{ fontWeight: 500, fontSize: "14px", color: "#463527" }}>
//                     {caretakerItem.data.first_name} {caretakerItem.data.last_name}{" "}
//                     <br></br>
//                     <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: '10px' }}>
//                       Emp. id: {caretakerItem.data.employee_id}
//                     </span> <br></br>
//                     <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F", lineHeight: '10px' }}>
//                       Dept: {caretakerItem.data.segment}
//                     </span>

//                     {caretakerItem.data.you && (
//                       <span style={{ fontWeight: 400, fontSize: "12px", color: "#73615F" }}>
//                         (You)
//                       </span>
//                     )}
//                   </span>

//                   <span style={{ color: "#73615F" }}>|</span>

//                   <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                     <Image src="./images/icons/call.svg" alt="call" width={18} height={18} />
//                     {caretakerItem.data.phone_number}
//                   </span>

//                   <span style={{ color: "#73615F" }}>|</span>

//                   <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                     <Image src="./images/icons/email.svg" alt="email" width={18} height={18} />
//                     {caretakerItem.data.email}
//                   </span>

//                   <span style={{ color: "#73615F" }}>|</span>

//                   <span style={{ display: "flex", alignItems: "center", color: "#463527", fontSize: "14px", gap: "5px" }}>
//                     <Image src="./images/icons/Genders.svg" alt="email" width={18} height={18} />
//                     {caretakerItem.data.gender}
//                   </span>
//                 </div>

//                 <div className='show-edit-btn'>
//                   <Button variant='' className='edit-btn ms-1 me-1'>Edit details</Button>
//                   <button
//                     type="button"
//                     className='ms-auto'
//                     onClick={() => handleCaretakerRemove(cart, caretakerItem.id)}
//                     style={{
//                       background: "none",
//                       border: "none",
//                       color: "#6B4F3F",
//                       fontSize: "14px",
//                       cursor: "pointer",
//                       flexShrink: 0,
//                     }}
//                     title="Remove"
//                   >
//                     <Image src="./images/icons/delete_b.svg" alt="delete" width={24} height={24} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )
//         ))}
//       </div>
//     </div>
//   ))
// }