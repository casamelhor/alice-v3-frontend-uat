export const AuthUrl = {
  Login: "alice-account-api/user-login-view/",
  ForgotPassword:"alice-account-api/forgot-password-api/",
  CodeVerify:"alice-account-api/code-verify-api/",
  ResetPassword:"alice-account-api/reset-user-password-api/"
};
export const CompanyUrl = {
  companyList: "alice-account-api/company-list-api/",
  CompanyDetail: "alice-account-api/company-detail-api/",
  CreateCompany: "alice-account-api/create-company-api/",
  UpdateCompanyDetail: "alice-account-api/update-company-api/",
  CompanyUserList: "alice-account-api/company-user-list-api/",
  CompanyUserDetail: "alice-account-api/company-user-detail-api/",
  AddCompanyUser: "alice-account-api/create-company-employee-user-api/",
  AddExternalGuestUser: "alice-account-api/create-external-guest-user-api/",
  CompanySettingDetail: "alice-account-api/company-setting-detail-api/",
  CompanySettingUrl: "alice-account-api/create-company-setting-api/",
  CompanySettingUpdate: "alice-account-api/update-company-setting-api/",
  DeptDesignation: "alice-account-api/company/",
  AssignPropertiesToCompany: "alice-account-api/company-property-assignment-list-api/",
  MultiplePropertiesAssienToCompnay: "alice-account-api/create-company-property-assignment-api/",
  UpdatePropertiesAssienToCompnay: "alice-account-api/company-property-assignment/",
  RemoveCompany: "alice-account-api/remove-company-api",
  CompanyStatusUpdate:"alice-account-api/update-company-status-api/",
  CompanyNotificationUpdate:"alice-notifications-api/create-and-update-channel-config-api/"
}
export const PeopleUrl = {
  UserList: "alice-account-api/user-list-api/",
  UserDetail: "alice-account-api/user-detail-api/",
  UserExternalUpdate: "alice-account-api/update-external-guest-user-api/",
  UserCompanyUpdate: "alice-account-api/update-company-employee-user-api/",
  UserRoleList: "alice-account-api/role-list-api/"
}

export const PropertyUrl = {
  CreateProperty: "alice-property-api/create-property-api/",
  UpdateSpaceProperty: "alice-property-api/property/",
  UploadPropertyPhotos: "alice-property-api/property-photo/upload/",
  PropertyList: "alice-property-api/property/",
  SetCoverPhoto: "alice-property-api/property-photo/",
  DeletePropertPhoto: "alice-property-api/property-photo/",
  SetOrderPhotos: "alice-property-api/update-photo-order/",
  propertyAssignCreate: "alice-property-api/property-assignment/create/",
  PropertyListApi: "alice-property-api/property-list",
  PropertyFinishPublish: "alice-property-api/property/",
  PropertyDetail: "alice-property-api/property/",
  UpdatePropertyDetail: "alice-property-api/property/",
  PropertyAssignList: "alice-property-api/property/",
  PropertyAssignDelete: "alice-property-api/property-assignment/",
  OperationManagerImageUpdate: "alice-property-api/property/",
  UpdateAssignment: "alice-property-api/property-assignment/",
  PropertyListDataById: "alice-property-api/property",
  DeleteBookingRestricted: "alice-property-api/booking-restriction/",
  Operationmanagerphotoupload: "alice-property-api/property/",
  WizardStep: "alice-property-api/property/",
  RemovePropertyAssignment: "alice-property-api/property-assignment/",
  PropertyStatusUpdate: "alice-property-api/property/",
  RemovePropertyList: "alice-property-api/property/",
  CompanyPropertiesCities: "alice-property-api/company-properties-cities-api/"
}
export const RoomUrl = {
  CreateRoom: "alice-property-api/room/create/",
  CreateRoomPhotos: "alice-property-api/room-photo/upload/",
  RoomList: "alice-property-api/property/",
  bookingRestriction: "alice-property-api/booking-restriction/create/",
  BookingRestrictionList: "alice-property-api/property/",
  UpdateRoom: "alice-property-api/room/",
  RoomDetail: "alice-property-api/room/",
  PropertyRoomsById: "alice-property-api/property/",
  PropertyRoomPhotosUpload: "alice-property-api/room-photo/upload/",
  RoomPhotosList: "alice-property-api/room/",
  setCoverRoomCoverPhoto: "alice-property-api/room-photo/",
  DeleteRoomPhotos: "alice-property-api/room-photo/",
  RoomStatusUpdate:"alice-property-api/room/"
}

export const BookingUrl = {
  BacisSearchAPI: "alice-property-api/basic-room-search-api/",
  SmartSearchUrl: "alice-property-api/smart-search-api/",
  CartValidation: "alice-property-api/cart-validation-api/",
  CreateBooking: "alice-property-api/create-bookings-api/",
  genderValidationAPI: "alice-property-api/validate-traveler-gender/",
  BookingDetail: "alice-property-api/bookings/",
  BookingListAPI: "alice-property-api/bookings/list/",
  DynamicFilters: "alice-property-api/bookings/filter-options/",
  ModifyBooking: "alice-property-api/bookings/",
  CheckAvailability: "alice-property-api/bookings/",
  BookingCheckout: "alice-property-api/bookings/",
  MarkNoShow: "alice-property-api/bookings/",
  CancelBooking: "alice-property-api/bookings/",
  BookingExport: "alice-property-api/booking-export-api/",
  FormalitiesById: "alice-property-api/bookings/",
  ReviewPost: "alice-review-api/reviews-post-api/",
  GetReviewDetail: "alice-review-api/review-detail-api/"
}

//Dashboard API
export const DashboardUrl = {
  HomeDashboard: "alice-review-api/home-dashboard-api/",
  ActiveGuest: "alice-review-api/active-guests-api/",
  FeedbackInsights: "alice-review-api/feedback-insights-api/",
  occupancyReport: "alice-review-api/occupancy-api/",
  occupancyRoomReport: "alice-review-api/dashboard-room-occupancy-api/",
  MonthlyReport: "alice-review-api/generate-daily-monthly-pdf-report/",
  Snapshot: "alice-review-api/dashboard-checkin-checkout-snapshot-api/",
  ReviewsList:"alice-review-api/reviews-list-api/",
  CompanyReporting: "alice-review-api/company-reporting-api/",
  DashboardCalendorPermission:"alice-account-api/my-permissions/"
}

export const HeaderUrl ={
  unReadCount:"alice-review-api/unread-count-notifications/",
  markReadNotification:"alice-review-api/mark-read-notifications/",
  notificationList:"alice-review-api/list-notifications/",
}

//Calendor API
export const CalendorUrl={
  FilterOption:"alice-review-api/filter-options/",
  CalendorSnap:"alice-review-api/main-calendar-data-api/",
  BookingOverview:"alice-review-api/bookings-overview-api/",
  BlockOverview:"alice-review-api/blocks-overview-api/",
  CheckRoomAvailability:"alice-review-api/check-room-availability/",
  setRoomAvailability:"alice-review-api/set-room-availability-api/"
}

//Notification API
export const NotificationConfigUrl={
  GetConfig:"alice-notifications-api/get-notification-config-api/",
  UpdateGroupEmail:"alice-notifications-api/update-notification-config-api/",
  PropertyOverride:"alice-notifications-api/update-notification-config-property-api/"
}

// integration: alice_v3_claude — w7 — booking integrations admin (backend: alice_channels/api/urls.py)
export const IntegrationUrl = {
  Health: "alice-channels-api/health/",
  Badge: "alice-channels-api/badge/",
  Flags: "alice-channels-api/flags/",
  Inbox: "alice-channels-api/inbox/",
  Connections: "alice-channels-api/connections/",
  ConnectOptions: "alice-channels-api/connect-options/",
};
