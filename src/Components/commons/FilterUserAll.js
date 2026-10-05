"use client"
import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import Image from 'next/image';

export const FilterUserAll = ({ handleOptionClick, filtermShow, filterClose, role, search, setSearch, handleOptionKeyDown,
    selectedSegment, setSelectedSegment, searchDesignation, setSearchDesignation, handleDesignation,
    selectedDesignation, selectedRoles, handleRemove, handleRemoveDesignation, handleRoleSelect, selectedGender,
    setSelectedGender, searchLocation, setSearchLocation, selectedLocation, setSelectedLocation, handleLocation,
    gender, handleRemoveLocation, getcompanyUserList, companyList, activeTab, handleSelectCompany, handleClearCompanies, selectedCompanies, segments, designations, handleSegmentDep,
    filteredList, companyId, showCompanyFilter, handleSelectGender, handleClearAllFields, loadMoreCompanies, canListCompany, canListRole, setCompanySearchText }) => {
    // const gender = [
    //     { id: 1, label: "Male", icon: "./images/icons/male.svg" },
    //     { id: 2, label: "Female", icon: "./images/icons/genders.svg" },
    const [isCompanyOpen, setIsCompanyOpen] = useState(false);
    // const [companySearchText, setCompanySearchText] = useState("");
    // ];    
    // const handleGenderSelect = (option) => {
    //     if (selectedGender.includes(option)) {
    //         setSelectedGender(selectedGender.filter((item) => item !== option));
    //     } else {
    //         setSelectedGender([option]);
    //     }
    // };
    return (
        <Modal show={filtermShow} onHide={filterClose} animation={false} centered className='custom-theme-modal status-height-70' >
            <Modal.Header className='d-flex align-items-center justify-content-between border-bottom' >
                Filters
                <Image src='../images/icons/close-circle.svg' width={24} height={24} alt='Close' style={{ cursor: 'pointer' }} onClick={filterClose} />
            </Modal.Header>
            <Modal.Body className='pt-4 pb-4'>
                {canListCompany && (
                    <div className='role-select' id='withcompany' style={{ display: showCompanyFilter ? "block" : "none" }}>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsCompanyOpen(!isCompanyOpen)}
                                className="border px-3 py-2 rounded-md flex items-center gap-2 justify-content-between role-btn"
                            >
                                Company
                                <Image src="./images/icons/bottom-arrow.svg" className='img-fluid' alt='bottom' width={10} height={10} />
                            </button>

                            {/* {isCompanyOpen && (
                            <div className="absolute top-13 mt-2 w-64 border z-10" style={{ background: '#F2F2F2', maxWidth: '317px', width: '100%' }} >
                                <div className="p-3" style={{ minHeight: '260px' }}>
                                    <ul className="Companies-list space-y-3 mb-0">
                                        {companyList?.map((c, index) => (
                                            <li key={index} className="px-3 py-2 border user-role-list  flex items-center justify-between">
                                                <label className="flex items-center  gap-3 cursor-pointer" onClick={() => handleSelectCompany(c.label)}>
                                                    <input type="checkbox" checked={selectedCompanies.includes(c.label)} className='custom-checkbox' readOnly />
                                                    <span className="ml-1">{c.label}</span>
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="border-top flex justify-between items-center p-3 ">
                                    <button onClick={handleClearCompanies} className="text-gray-500 text-sm hover:underline">Clear all</button>
                                    <button onClick={() => setIsCompanyOpen(false)} className="bg-green-700 text-white rounded-md" style={{ padding: '12px 26px' }}>Done</button>
                                </div>
                            </div>
                        )} */}
                            {isCompanyOpen && (
                                <div className="absolute top-13 mt-2 w-64 border z-10" style={{ background: '#F2F2F2', maxWidth: '317px', width: '100%' }}>

                                    {/* Search input */}
                                    <div className="p-2 border-bottom">
                                        <input
                                            type="text"
                                            placeholder="Search company..."
                                            className="form-control form-control-sm"
                                            // value={companySearchText}
                                            onChange={(e) => setCompanySearchText(e.target.value)}
                                        />
                                    </div>

                                    <div className="p-3" style={{ minHeight: '260px' }}>
                                        <ul
                                            className="Companies-list space-y-3 mb-0"
                                            style={{ maxHeight: "220px", overflowY: "auto" }}
                                            onScroll={(e) => {
                                                const el = e.target;
                                                const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 30;
                                                if (isAtBottom && typeof loadMoreCompanies === "function") {
                                                    loadMoreCompanies();
                                                }
                                            }}
                                        >
                                            {/* {companyList?.filter((c) =>
                                                    !companySearchText ||
                                                    c.label?.toLowerCase().includes(companySearchText.toLowerCase())
                                                ) */}
                                            {companyList?.map((c, index) => (
                                                <li key={index} className="px-3 py-2 border user-role-list flex items-center justify-between">
                                                    <label className="flex items-center gap-3 cursor-pointer" onClick={() => handleSelectCompany(c.label)}>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCompanies.includes(c.label)}
                                                            className="custom-checkbox"
                                                            readOnly
                                                        />
                                                        <span className="ml-1">{c.label}</span>
                                                    </label>
                                                </li>
                                            ))
                                            }

                                            {/* No results message */}
                                            {/* {companySearchText &&
                                                companyList?.filter((c) =>
                                                    c.label?.toLowerCase().includes(companySearchText.toLowerCase())
                                                ).length === 0 && (
                                                    <li className="px-3 py-2 text-center text-sm" style={{ color: "#888", listStyle: "none" }}>
                                                        No companies found
                                                    </li>
                                                )} */}
                                                {companyList?.length === 0 && (
                                                    <li className="px-3 py-2 text-center text-sm" style={{ color: "#888", listStyle: "none" }}>
                                                        No companies found
                                                    </li>
                                                )}
                                        </ul>
                                    </div>

                                    <div className="border-top flex justify-between items-center p-3">
                                        <button
                                            onClick={() => {
                                                handleClearCompanies();
                                                setCompanySearchText("");
                                            }}
                                            className="text-gray-500 text-sm hover:underline"
                                        >
                                            Clear all
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsCompanyOpen(false);
                                                setCompanySearchText("");
                                            }}
                                            className="bg-green-700 text-white rounded-md"
                                            style={{ padding: '12px 26px' }}
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                        <hr style={{ marginTop: '20px', marginBottom: '20px' }}></hr>
                    </div>

                )}
                {canListRole && (
                    <div className='filter-compnay-details'>
                        <p>Role</p>
                        <ul className="space-y-3 gap-2 ps-0 mb-0">
                            {role.map((role, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleRoleSelect(role.label)}
                                    className={` gap-2 px-3 py-2 user-role-list me-3  rounded-full cursor-pointer ${selectedRoles.includes(role.label)
                                        ? "select-grey"
                                        : "hover:bg-gray-100"
                                        }`}
                                >
                                    <span className="text-gray-600"><Image src={role.icon} className='img-fluid' alt='role' width={20} height={20} /> </span>
                                    <span>{role.label}</span>
                                </li>
                            ))}
                        </ul>
                        <hr style={{ marginTop: '20px', marginBottom: '20px' }}></hr>
                    </div>
                )}

                <div className='filter-compnay-details'>
                    <p>Dept./Segment</p>
                    <div className='search-box '>
                        <input
                            type='text'
                            placeholder='Search '
                            className='form-control'
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={handleOptionKeyDown}
                        />
                        <button className='btn btn-search'>
                            <Image src='../images/icons/search.svg' width={24} height={24} alt='Search' />
                        </button>

                        {/* 🔽 Search Suggestion Dropdown */}
                        {search && filteredList?.length > 0 && (
                            <ul
                                className="list-group position-absolute w-100"
                                style={{ top: "100%", zIndex: 10, background: "#fff", maxHeight: "200px", overflowY: "auto" }}
                            >
                                {filteredList?.map((opt, idx) => (
                                    <li
                                        key={idx}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => handleOptionClick(opt)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {opt.name} {opt.designation ? `- ${opt.designation}` : ""}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="d-flex gap-2 mt-3 flex-wrap">
                        {selectedSegment.map((opt, idx) => (
                            <div key={idx} style={{ display: "flex", alignItems: "center", border: "1px solid #4635271F", borderRadius: "24px", padding: "13px 14px", background: "transparent", fontWeight: 500, color: "#463527" }}>
                                {opt}
                                <span
                                    style={{ marginLeft: "8px", cursor: "pointer", color: "#463527" }}
                                    onClick={() => handleRemove(opt)}
                                >
                                    <Image src="/images/icons/x-circle.svg" width={20} height={20} alt="Remove" />
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* search code  */}

                    {search.trim() !== "" && (
                        <div className="option-list max-h-40 overflow-y-auto w-full bg-white shadow-md rounded-md absolute z-10">
                            {segments
                                ?.filter((opt) =>
                                    opt.toLowerCase().includes(search.toLowerCase())
                                )
                                .map((opt, index) => (
                                    <div
                                        key={index}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSegmentDep(opt);   // select segment
                                            setSearch("");           // clear input
                                        }}
                                        className={`px-3 py-2 cursor-pointer text-sm ${selectedSegment.includes(opt)
                                            ? "bg-gray-200 font-medium"
                                            : "hover:bg-gray-100"
                                            }`}
                                    >
                                        {opt}
                                    </div>
                                ))}
                        </div>
                    )}



                    <hr style={{ marginTop: '20px', marginBottom: '20px' }}></hr>
                </div>
                <div className='filter-compnay-details'>
                    <p>Designation</p>
                    <div className='role-select'>
                        <div className='search-box '>
                            <input
                                type='text'
                                placeholder='Search '
                                className='form-control'
                                value={searchDesignation}
                                onChange={e => setSearchDesignation(e.target.value)}
                                onKeyDown={handleDesignation}
                            />
                            <button className='btn btn-search'>
                                <Image src='../images/icons/search.svg' width={24} height={24} alt='Search' />
                            </button>


                            {/* Dropdown Suggestion */}

                            {searchDesignation.trim() !== "" && (
                                <div className="option-list max-h-40 overflow-y-auto w-full bg-white shadow-md rounded-md absolute z-10">
                                    {designations
                                        ?.filter(
                                            (opt) =>
                                                opt.toLowerCase().includes(searchDesignation.toLowerCase())
                                            // &&
                                            //     !selectedDesignation.includes(opt) // hide already-selected ones
                                        )
                                        .map((opt, index) => (
                                            <div
                                                key={index}
                                                onClick={() => {
                                                    handleDesignation(opt); // add to selected list
                                                    setSearchDesignation(""); // clear search
                                                }}
                                                className={`px-3 py-2 cursor-pointer text-sm hover:bg-gray-100`}
                                            >
                                                {opt}
                                            </div>
                                        ))}
                                    {/* If no results found */}
                                    {designations.filter((opt) =>
                                        opt.toLowerCase().includes(searchDesignation.toLowerCase())
                                    ).length === 0 && (
                                            <div className="px-3 py-2 text-sm text-gray-500">No results found</div>
                                        )}
                                </div>
                            )}






                        </div>
                    </div>
                    <div className="d-flex gap-2 mt-3 flex-wrap">
                        {/* {selectedDesignation.map((opt, idx) => (
                            <div key={idx} style={{ display: "flex", alignItems: "center", border: "1px solid #4635271F", borderRadius: "24px", padding: "13px 14px", background: "transparent", fontWeight: 500, color: "#463527" }}>
                                {opt}
                                <span
                                    style={{ marginLeft: "8px", cursor: "pointer", color: "#463527" }}
                                    onClick={() => handleRemoveDesignation(opt)}
                                >
                                    <Image src="/images/icons/x-circle.svg" width={20} height={20} alt="Remove" />
                                </span>
                            </div>
                        ))} */}


                        {selectedDesignation.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    border: "1px solid #4635271F",
                                    borderRadius: "24px",
                                    padding: "13px 14px",
                                    background: "transparent",
                                    fontWeight: 500,
                                    color: "#463527",
                                    gap: "8px",
                                }}
                            >
                                {item}
                                <button
                                    onClick={() => handleRemoveDesignation(item)}
                                    className="ml-1 text-gray-500 hover:text-black"
                                >
                                    <Image src="/images/icons/x-circle.svg" alt="close" width={20} height={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <hr style={{ marginTop: '20px', marginBottom: '20px' }}></hr>
                </div>

                <div className='filter-compnay-details'>
                    <p>Gender</p>
                    <ul className="space-y-3 gap-2 ps-0 mb-0">
                        {gender.map((role, index) => (
                            <li
                                key={index}
                                onClick={() => handleSelectGender(role.label)}
                                className={` gap-2 px-3 py-2 user-role-list me-3  rounded-full cursor-pointer ${selectedGender?.includes(role.label)
                                    ? "select-grey"
                                    : "hover:bg-gray-100"
                                    }`}
                            >
                                <span className="text-gray-600"><Image src={role.icon} className='img-fluid' alt='role' width={20} height={20} /> </span>
                                <span>{role.label}</span>
                            </li>
                        ))}
                    </ul>
                    {/* <hr style={{ marginTop: '20px', marginBottom: '20px' }}></hr> */}
                </div>
                {/* <div className='filter-compnay-details'>
                    <p className='d-flex justify-content-between' >Location <Image style={{ transform: 'rotate(180deg)' }} src='../images/icons/bottom-arrow.svg' className='img-fluid' width={12} height={12} alt='bottom' /> </p>

                    <div className='search-box '>
                        <input type='text' placeholder='Search by company name, or location' className='form-control' />
                        <input
                            type='text'
                            placeholder='Search by location '
                            className='form-control'
                            value={searchLocation}
                            onChange={e => setSearchLocation(e.target.value)}
                            onKeyDown={handleLocation}
                        />
                        <button className='btn btn-search'>
                            <Image src='../images/icons/search.svg' width={24} height={24} alt='Search' />
                        </button>
                    </div>
                </div>
                <div className="d-flex gap-2 mt-3 flex-wrap">
                    {selectedLocation.map((opt, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", border: "1px solid #4635271F", borderRadius: "24px", padding: "13px 14px", background: "transparent", fontWeight: 500, color: "#463527" }}>
                            {opt}
                            <span
                                style={{ marginLeft: "8px", cursor: "pointer", color: "#463527" }}
                                onClick={() => handleRemoveLocation(opt)}
                            >
                                <Image src="/images/icons/x-circle.svg" width={20} height={20} alt="Remove" />
                            </span>
                        </div>
                    ))}
                </div> */}
            </Modal.Body>

            <Modal.Footer className='d-flex align-items-center justify-content-between '>
                <p onClick={handleClearAllFields}>
                    Clear all
                </p>
                <Button variant="" className='search-btn complete-form-btn' style={{ padding: '13px 25px', borderRadius: '0' }} onClick={getcompanyUserList}>
                    Search
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
