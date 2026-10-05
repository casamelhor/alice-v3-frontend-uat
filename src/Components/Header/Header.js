"use client";
import React, { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearLocalStorage, getItemLocalStorage } from "@/utils/browserStorage";
import Dropdown from 'react-bootstrap/Dropdown';
import { NotificationUnreadCountAPI, NotificationUnreadListAPI, NotificationReadAPI } from "@/services/provider";
import ToastContainer from "react-bootstrap";
import { alert_success, alert_danger } from "@/utils/Alerts/TostifyAlerts";
import { formatToDayDate } from '@/utils/formatTime';
import { checkPermission } from "@/utils/helper";

export default function Header() {

  const permissionArray = JSON.parse(getItemLocalStorage("user_permissions"));
  const loginData = JSON.parse(getItemLocalStorage("userLogin"));

  const permissionUser = checkPermission(permissionArray, "user");
  const permissionCompany = checkPermission(permissionArray, "company");
  const permissionBookingMain = checkPermission(permissionArray, "booking");
  const permissionProperty = checkPermission(permissionArray, "property");
  //user permission
  const canListUser = permissionUser === true || permissionUser?.can_list;
  //company permision
  const canListCompany = permissionCompany === true || permissionCompany?.can_list;
  //booking permission
  const canListBooking = permissionBookingMain === true || permissionBookingMain?.can_list;
  const canAddBooking = permissionBookingMain === true || permissionBookingMain?.can_add;
  //property permission
  const canListProperty = permissionProperty === true || permissionProperty?.can_list;
  console.log(permissionArray)
  // console.log('success', permissionBookingMain)

  const togglePicOption1 = (e, index) => {
    e.preventDefault();
    setOpenPicIndex(openPicIndex === index ? null : index);
  };

  const [notificationCount, setNotificationCount] = useState(0)
  const [notificationList, setNotificationList] = useState([])


  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    { href: "/Home", label: "Home" },
    { href: "/Calendar", label: "Calendar" },
    { href: "/Bookings", label: "Bookings" },
    { href: "/People", label: "People" },
    { href: "/AllCompany", label: "Company" },
    { href: "/PropertyListing", label: "Properties" },
  ];

  const getNotificationCout = async () => {
    try {
      const res = await NotificationUnreadCountAPI()
      if (res.data.success) {
        setNotificationCount(res.data.response.unread_count)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const getNotificationList = async () => {
    try {
      let payload = {
        page: 1,
        size: 20,
        isRead: true
      }
      const res = await NotificationUnreadListAPI(payload)
      if (res.data.success) {
        setNotificationList(res.data.response.notifications)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleClickedNotification = async (id, url) => {
    try {
      let payload = { notification_uids: [id] }
      const res = await NotificationReadAPI(payload)
      if (res.data.success) {
        setNotificationCount(res.data.response.updated_count)
        if (url != "") {
          router.push(url)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getNotificationCout();
    getNotificationList();
  }, [])

  return (
    <header className="header">
      <Container>
        <Row className="align-items-center">
          {/* Logo */}
          <Col xs={6} md={3}>
            <div className="logo">
              <Image
                src="/images/logo.svg"
                width={157}
                height={49}
                className="img-fluid"
                alt="Logo"
              />
            </div>
          </Col>

          {/* Desktop Navigation */}
          <Col md={6} className="d-none d-md-block">
            <nav className="nav">
              <ul>
                {/* {menuItems.map((item) => (
                  <li
                    key={item.href}
                    className={pathname === item.href ? "active" : ""}
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))} */}
                <li
                  className={pathname === "/Home" ? "active" : ""}
                >
                  <Link href="/Home">Home</Link>
                </li>
                <li
                  className={pathname === "/Calendar" ? "active" : ""}
                >
                  <Link href="/Calendar">Calendar</Link>
                </li>

                {canListBooking && (
                  <li
                    className={pathname === "/Bookings" ? "active" : ""}
                  >
                    <Link href="/Bookings">Bookings</Link>
                  </li>
                )}

                {canListUser && (
                  <li
                    className={pathname === "/People" ? "active" : ""}
                  >
                    <Link href="/People">People</Link>
                  </li>
                )}

                {canListCompany && (
                  <li
                    className={pathname === "/AllCompany" ? "active" : ""}
                  >
                    <Link href="/AllCompany">Company</Link>
                  </li>
                )}

                {canListProperty && (
                  <li
                    className={pathname === "/PropertyListing" ? "active" : ""}
                  >
                    <Link href="/PropertyListing">Properties</Link>
                  </li>
                )}
                {(loginData?.user_role?.role_name === 'Company Admin' || loginData?.user_role?.role_name === "CasaMelhor Booking Manager" || loginData?.user_role?.role_name === "CasaMelhor Booking Manager") && (
                  <li
                    className={pathname === "/company/reporting" ? "active" : ""}
                  >
                    <Link href={`/company/reporting?uid=${loginData?.company_uid}`}>Insights</Link>
                  </li>
                )}

              </ul>
            </nav>
          </Col>

          {/* Right Section */}
          <Col xs={6} md={3} className="text-end">
            <div className="header-right d-flex justify-content-end align-items-center">
              {/* Mobile Menu Toggle */}
              <button
                className="menu-toggle d-md-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <Image
                  src="./images/icons/menu.svg"
                  width={24}
                  height={24}
                  alt="Menu"
                />
              </button>

              <ul className="user-profile d-none d-md-flex">
                {canAddBooking && (
                  <li className="user-name">
                    <Link href="/CreateBooking">Create Booking</Link>
                  </li>
                )}
                <li>

                  <Dropdown className="login-dropdown notification-dropdown relative" >
                    <Dropdown.Toggle variant="" id="dropdown-basic2">
                      <Image
                        src="/images/icons/notification.svg"
                        width={24}
                        height={24}
                        alt="Notification"
                      />
                      {notificationCount > 0 && <span className="notification-badge" style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#165953', fontSize: '10px', padding: '2px', borderRadius: '50%', width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }} >{notificationCount}</span>}
                    </Dropdown.Toggle>
                    <Dropdown.Menu >
                      {notificationList.length > 0 ?
                        notificationList.map((item, index) => (<Dropdown.Item key={index} onClick={() => { handleClickedNotification(item?.notification_uid, item?.notification_action_url) }}>
                          <Image src={item?.guest_image ? `${item?.guest_image}` : "/images/icons/No-Image.svg"} className="img-fluid" alt="" width={32} height={32} />

                          <p className="mb-0" >  {item.notification_message.length > 20
                            ? item.notification_message.slice(0, 20) + "..."
                            : item.notification_message}</p><p className="mt-3">{formatToDayDate(item.created_at)}</p>
                          <Image src={item?.property_image ? `${item?.property_image}` : "/images/icons/No-Image.svg"} className="img-fluid" alt="" width={32} height={32} />
                        </Dropdown.Item>)) : <Dropdown.Item className="border-t-4 border-b-4 border-gray-500">
                          <p>
                            No New Notification Found
                          </p>
                        </Dropdown.Item>}
                    </Dropdown.Menu>

                  </Dropdown>



                </li>
                <li className="action-item">


                  <Dropdown className="login-dropdown" >
                    <Dropdown.Toggle variant="" id="dropdown-basic">

                      <Image
                        src="/images/icons/user.svg"
                        width={24}
                        height={24}
                        alt="User"
                      />

                    </Dropdown.Toggle>

                    <Dropdown.Menu >
                      <Dropdown.Item href="/ViewProfile">
                        <Image
                          src="/images/icons/user.svg"
                          width={24}
                          height={24}
                          alt="User"
                        /> View Profile</Dropdown.Item>
                      <Dropdown.Item href="/AccountSetting">
                        <Image
                          src="/images/icons/settings.svg"
                          width={24}
                          height={24}
                          alt="User"
                        />
                        Account Settings</Dropdown.Item>
                      <hr style={{ margin: '6px 0' }} ></hr>
                      <Dropdown.Item onClick={() => {
                        clearLocalStorage()
                        router.push("/")
                      }} href={""}>Log out</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>


                </li>



              </ul>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <ul>
          {/* {menuItems.map((item) => (
            <li
              key={item.href}
              className={pathname === item.href ? "active" : ""}
              onClick={() => setIsMenuOpen(false)}
            >
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))} */}
          <li
            className={pathname === "/Home" ? "active" : ""}
          >
            <Link href="/Home">Home</Link>
          </li>
          <li
            className={pathname === "/Calendar" ? "active" : ""}
          >
            <Link href="/Calendar">Calendar</Link>
          </li>

          {canListBooking && (
            <li
              className={pathname === "/Bookings" ? "active" : ""}
            >
              <Link href="/Bookings">Bookings</Link>
            </li>
          )}

          {canListUser && (
            <li
              className={pathname === "/People" ? "active" : ""}
            >
              <Link href="/People">People</Link>
            </li>
          )}

          {canListCompany && (
            <li
              className={pathname === "/AllCompany" ? "active" : ""}
            >
              <Link href="/AllCompany">Company</Link>
            </li>
          )}

          {canListProperty && (
            <li
              className={pathname === "/PropertyListing" ? "active" : ""}
            >
              <Link href="/PropertyListing">Properties</Link>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}