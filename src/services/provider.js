import { AuthUrl, BookingUrl, CompanyUrl, DashboardUrl, PeopleUrl, PropertyUrl, RoomUrl, HeaderUrl, CalendorUrl } from "./apiUrl";
import client from "./axiosInstance";

//Login Api's
export const LogInUserAPI = (data) => {
  const data1 = client.postWithoutToken(AuthUrl.Login, data);
  return data1;
};
export const ForgotPasswordAPI = (email) => {
  const data = client.postWithoutToken(AuthUrl.ForgotPassword, email);
  return data;
}
export const CodeVerifyAPI = (data) => {
  const result = client.postWithoutToken(AuthUrl.CodeVerify, data);
  return result;
}

export const ResetUserPasswordAPI = (data) => {
  const result = client.postWithoutToken(AuthUrl.ResetPassword, data);
  return result;
}

// company Api's
export const companyListAPI = (key, page, sort_by) => {
  const data = client.getWithToken(key === "all" ? `${CompanyUrl.companyList}` : `${CompanyUrl.companyList}?search=${key}&page=${page}&limit=10&sort_by=${sort_by}`);
  return data
}
// export const companyListAPI = (key, page) => {
//   const data = client.getWithToken(`${CompanyUrl.companyList}?search=${key}&page=${page}&limit=10`);
//   return data
// }
export const companyListAPIS = (key = "", page = 1, limit = 10, sort_by = "") => { 
  const url =
    key === "all"
      ? `${CompanyUrl.companyList}?limit=${limit}`
      : `${CompanyUrl.companyList}?search=${key}&page=${page}&limit=${limit}&sort_by=${sort_by}`;
 
  const data = client.getWithToken(url);
  return data;
};
export const companyDetailAPI = (id) => {
  const data = client.getWithToken(`${CompanyUrl.CompanyDetail}${id}/`);
  return data;
}
export const AddCompanyAPI = (data) => {
  const result = client.postWithToken(CompanyUrl.CreateCompany, data);
  return result;
}
export const UpdateCompanyDetailAPI = (id, data) => {
  const result = client.put(`${CompanyUrl.UpdateCompanyDetail}${id}/`, data);
  return result;
}
export const CompanyuserListAPI = (id, search, role, segment, designation, gender, location, page, sortBy) => {
  const data = client.getWithToken(`${CompanyUrl.CompanyUserList}${id}/?search=${search}&user_role=${role}&segment=${segment}&designation=${designation}&gender=${gender}&location=${location}&page=${page}&limit=10&sort_by=${sortBy}`);
  return data;
}
export const CompanyuserDetailAPI = (com_uid, user_uid) => {
  const data = client.getWithToken(`${CompanyUrl.CompanyUserDetail}company-uid/${com_uid}/user-uid/${user_uid}`);
  return data;
}
export const AddCompanyUserAPI = (data) => {
  const result = client.postWithToken(CompanyUrl.AddCompanyUser, data);
  return result;
}
export const AddExternalGuestUserAPI = (data) => {
  const result = client.postWithToken(CompanyUrl.AddExternalGuestUser, data);
  return result;
}
export const CompanySettingDetailAPI = (id) => {
  const data = client.getWithToken(`${CompanyUrl.CompanySettingDetail}${id}`);
  return data;
}
export const CompanySettingCreateAPI = (data) => {
  const result = client.postWithToken(CompanyUrl.CompanySettingUrl, data);
  return result;
}
export const CompanySettingUpdateAPI = (id, data) => {
  const result = client.putForUpload(`${CompanyUrl.CompanySettingUpdate}${id}/`, data);
  return result;
}
export const DeptDesignationAPI = (id) => {
  return client.getWithToken(
    `${CompanyUrl.DeptDesignation}${id}/user-dropdowns/`
  );
};
export const RemovePropertyAssignmentApi = (propertyId) => {
  return client.deleteReq(
    `${PropertyUrl.RemovePropertyAssignment}${propertyId}/remove/`
  );
};
export const PropertyStatusUpdateApi = (propertyId, data) => {
  const result = client.patch(
    `${PropertyUrl.PropertyStatusUpdate}${propertyId}/status/`,
    data
  );
  return result;
};
export const AssignPropertiesToCompanyAPI = (id) => {
  const result = client.getWithToken(`${CompanyUrl.AssignPropertiesToCompany}${id}`);
  return result;
}
export const MultiplePropertiesAssignToCompany = (data) => {
  const result = client.postWithToken(CompanyUrl.MultiplePropertiesAssienToCompnay, data);
  return result
}
export const UpdatePropertiesAssienToCompnayAPI = (id, data) => {
  const result = client.put(`${CompanyUrl.UpdatePropertiesAssienToCompnay}${id}/update/`, data);
  return result
}

export const RemoveCompanyAPI = (id, payload) => {
  return client.postWithToken(
    `${CompanyUrl.RemoveCompany}/${id}/`,
    payload
  );
};

export const CompanyStatusUpdateAPI = (id, data) => {
  const result = client.patch(`${CompanyUrl.CompanyStatusUpdate}${id}/`, data);
  return result;
}
export const CompanyNotificationUpdateAPI=(data)=>{
  const result = client.postWithToken(`${CompanyUrl.CompanyNotificationUpdate}`,data);
  return result;
}


//people
// export const UserListAPI = (type, search, role, segment, designation, gender, location, comapny) => {
//   const data = client.getWithToken(type === "All" ? `${PeopleUrl.UserList}${type}/?search=${search}` : `${PeopleUrl.UserList}${type}/?search=${search}&user_role=${role}&segment=${segment}&designation=${designation}&gender=${gender}&location=${location}&user_company=${comapny}`);
//   return data;
// }


// export const UserListAPI = (type, search, role, segment, designation, gender, location, sortBy, comapny, page, limit) => {
//   const data = client.getWithToken(type === "All" ? `${PeopleUrl.UserList}${type}/` : `${PeopleUrl.UserList}${type}/?search=${search}&user_role=${role}&segment=${segment}&designation=${designation}&gender=${gender}&location=${location}&sort_by=${sortBy}&user_company=${comapny}&page=${page}&limit=${limit}`);
//   return data;
// }
export const UserListAPI = (
  type = "",
  role = "",
  search = "",  
  segment = "",
  designation = "",
  gender = "",
  location = "",
  sortBy = "",
  company = "",
  page = 1,
  limit = 10
) => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (role) params.append("user_role", role);
  if (segment) params.append("segment", segment);
  if (designation) params.append("designation", designation);
  if (gender) params.append("gender", gender);
  if (location) params.append("location", location);
  if (sortBy) params.append("sort_by", sortBy);
  if (company) params.append("user_company", company);

  // Always include pagination
  params.append("page", page);
  params.append("limit", limit);

  const url = `${PeopleUrl.UserList}${type || "All"}/?${params.toString()}`;

  return client.getWithToken(url);
};

export const UserDetailAPI = (id) => {
  const data = client.getWithToken(`${PeopleUrl.UserDetail}${id}/`);
  return data;
}
export const UserCompanyUpdateAPI = (id, data) => {
  const result = client.putForUpload(`${PeopleUrl.UserCompanyUpdate}${id}/`, data)
  return result
}
export const UserExternalUpdateAPI = (id, data) => {
  const result = client.putForUpload(`${PeopleUrl.UserExternalUpdate}${id}/`, data)
  return result
}
export const UserRoleListAPI = (id) => {
  const data = client.getWithToken(`${PeopleUrl.UserRoleList}${id}/`);
  return data;
}
//Property
export const CreatePropertyAPI = (data) => {
  const result = client.postWithToken(PropertyUrl.CreateProperty, data)
  return result
}
export const UpdatePropertySpaceAPI = (id, data) => {
  const result = client.patchWithUpload(`${PropertyUrl.UpdateSpaceProperty}${id}/update-space-api/`, data)
  return result
}
export const UploadPropertyPhotosAPI = (data) => {
  const result = client.postWithToken(PropertyUrl.UploadPropertyPhotos, data)
  return result
}
export const PropertyPhotosListAPI = (id) => {
  const data = client.getWithToken(`${PropertyUrl.PropertyList}${id}/`);
  return data;
}
export const SetCoverPhotoAPI = (id, data) => {
  const result = client.patchWithUpload(`${PropertyUrl.SetCoverPhoto}${id}/set-cover/`)
  return result
}
export const DeletePhotoAPI = (id) => {
  const result = client.deleteReq(`${PropertyUrl.DeletePropertPhoto}${id}/delete/`)
  return result
}
export const SetOrderPhotoAPI = (data) => {
  const result = client.patch(PropertyUrl.SetOrderPhotos, data)
  return result
}

export const AssignProperty = (data) => {
  const result = client.postWithToken(PropertyUrl.propertyAssignCreate, data)
  return result
}
// export const PropertyListApi = (data) => {
//   const result = client.getWithToken(PropertyUrl.PropertyListApi, data)
//   return result
// }

export const PropertyListApi = (searchText, location, propertiesName, company, status, limit, page) => {
  return client.getWithToken(
    // `${PropertyUrl.PropertyListApi}?search=${search}&page=${page}&limit=10&sort_by=${sort_by}`
    `${PropertyUrl.PropertyListApi}?search=${searchText}&location=${location}&property_name=${propertiesName}&company=${company}&property_status=${status}&page=${page}&limit=${limit}`
  );
};
export const PropertyListFullApi = (limit,page,com_uid,location) => {
  return client.getWithToken(
    `${PropertyUrl.PropertyListApi}?limit=${limit}&page=${page}&company=${com_uid}&location=${location}`
  );
};

export const PropertyDetailApi = (id) => {
  const result = client.getWithToken(`${PropertyUrl.PropertyDetail}${id}`)
  return result
}
export const PropertyFinishPublishedAPI = (id, data) => {
  const result = client.patchWithUpload(`${PropertyUrl.PropertyFinishPublish}${id}/update-step-finish/`, data)
  return result
}

export const UpdatePropertyDetailAPI = (id, data) => {
  const result = client.put(`${PropertyUrl.UpdatePropertyDetail}${id}/update/`, data);
  return result;
}
export const PropertyAssignListApi = (id) => {
  const result = client.getWithToken(`${PropertyUrl.PropertyAssignList}${id}/assignments/`)
  return result
}

export const DeletePropertyAssignAPI = (id) => {
  const result = client.deleteReq(`${PropertyUrl.PropertyAssignDelete}${id}/remove/`)
  return result
}
export const UpdatePropertyAssignmentAPI = (id, data) => {
  const result = client.put(`${PropertyUrl.UpdateAssignment}${id}/update/`, data);
  return result;
}

export const DeleteBookingRestrictedAPI = (id, data) => {
  const result = client.deleteReq(`${PropertyUrl.DeleteBookingRestricted}${id}/delete/`, data)
  return result
}

export const OperationManagerPhotoUploadAPI = (id, data) => {
  const result = client.postWithToken(`${PropertyUrl.Operationmanagerphotoupload}${id}/operation-manager-photo/upload/`, data)
  return result
}

export const WizardStepUpdateAPI = (id, data) => {
  const result = client.patchWithUpload(`${PropertyUrl.WizardStep}${id}/wizard-step/`, data)
  return result
}
export const RemovePropertyListAPI = (id, data) => {
  const result = client.deleteReq(`${PropertyUrl.RemovePropertyList}${id}/delete/`, data)
  return result
}

export const getCompanyPropertiesCitiesAPI=(id)=>{
  const result = client.get(`${PropertyUrl.CompanyPropertiesCities}${id}`)
  return result
}

//Room
export const CreateRoomAPI = (data) => {
  const result = client.post(RoomUrl.CreateRoom, data)
  return result
}
export const CreateRoomPhotosAPI = (data) => {
  const result = client.postWithToken(RoomUrl.CreateRoomPhotos, data)
  return result
}
export const PropertyRoomListAPI = (id) => {
  const data = client.getWithToken(`${RoomUrl.RoomList}${id}/rooms/`);
  return data;
}
export const PropertyRoomDetailAPI = (id) => {
  const data = client.getWithToken(`${RoomUrl.RoomDetail}${id}/`);
  return data;
}
export const CreateBookingRestrictionAPI = (data) => {
  const result = client.post(RoomUrl.bookingRestriction, data)
  return result
}
export const UpdateRoomDetailAPI = (id, data) => {
  const result = client.put(`${RoomUrl.UpdateRoom}${id}/update/`, data);
  return result;
}
export const PropertyDataById = (id) => {
  const data = client.getWithToken(`${PropertyUrl.PropertyListDataById}/${id}/assignments/`);
  return data
}
export const BookingRestrictionListAPI = (id) => {
  const data = client.getWithToken(`${RoomUrl.BookingRestrictionList}${id}/booking-restrictions/`);
  return data;
}

export const PropertyRoomsByIdAPI = (id) => {
  const data = client.getWithToken(`${RoomUrl.PropertyRoomsById}${id}/rooms/`);
  return data;
}

export const UploadRoomPhotosAPI = (data) => {
  const result = client.postWithToken(RoomUrl.PropertyRoomPhotosUpload, data)
  return result
}

export const RoomsPhotoListAPI = (id) => {
  const data = client.getWithToken(`${RoomUrl.RoomPhotosList}${id}/photos/`);
  return data;
}

export const SetRoomCoverPhotoAPI = (id) => {
  const result = client.patchWithUpload(`${RoomUrl.setCoverRoomCoverPhoto}${id}/set-cover/`)
  return result
}
export const DeleteRoomPhotoAPI = (id) => {
  const result = client.deleteReq(`${RoomUrl.DeleteRoomPhotos}${id}/delete/`)
  return result
}

export const RoomStatusUpdateApi = (roomId, data) => {
  const result = client.patch(
    `${RoomUrl.RoomStatusUpdate}${roomId}/status/`,
    data
  );
  return result;
};

// Booking

export const BasicBookingSearch = (data) => {
  const result = client.post(BookingUrl.BacisSearchAPI, data)
  return result
}

export const SmartBookingSearch = (data) => {
  const result = client.post(BookingUrl.SmartSearchUrl, data)
  return result
}

export const CartValidationPost = (data) => {
  const result = client.post(BookingUrl.CartValidation, data)
  return result
}

export const CreateBookingPost = (data) => {
  const result = client.post(BookingUrl.CreateBooking, data)
  return result
}

export const validateGender = (data) => {
  const result = client.post(BookingUrl.genderValidationAPI, data)
  return result
}

export const BookingDetailAPI = (id) => {
  const result = client.get(`${BookingUrl.BookingDetail}${id}`)
  return result
}

export const DynamicFiltersAPI = (key, page) => {
  const data = client.getWithToken(`${BookingUrl.DynamicFilters}`);
  return data
}

export const BookingsListAPI = (filters = {}) => {
  const params = new URLSearchParams();

  // Loop through filters and append only non-empty values
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      params.append(key, value);
    }
  });

  return client.getWithToken(`${BookingUrl.BookingListAPI}?${params.toString()}`);
};

export const CheckAvailabilityAPI = (id, data) => {
  const result = client.post(`${BookingUrl.CheckAvailability}${id}/check-availability/`, data)
  return result;
}
export const ModifyBookingAPI = (id, data) => {
  const result = client.patch(`${BookingUrl.ModifyBooking}${id}/modify/`, data);
  return result;
}
export const BookingCheckoutAPI = (id, data) => {
  const result = client.post(`${BookingUrl.BookingCheckout}${id}/checkout/`, data);
  return result
}
export const MarkNoShowAPI = (id, data) => {
  const result = client.post(`${BookingUrl.MarkNoShow}${id}/mark-no-show/`, data);
  return result;
}
export const CancelBookingAPI = (id, data) => {
  const result = client.post(`${BookingUrl.CancelBooking}${id}/cancel/`, data);
  return result;
}
export const ExportBookingAPI = (data) => {
  const result = client.post(BookingUrl.BookingExport, data);
  return result;
}

export const getFormalityById = (id) => {
  const data = client.getWithToken(`${BookingUrl.FormalitiesById}${id}/formalities/`);
  return data
}

export const postFormalityById = (id, data) => {
  const result = client.postWithUpload(`${BookingUrl.FormalitiesById}${id}/formalities/`, data);
  return result;
}

export const postCheckInById = (id, data) => {
  const result = client.postWithUpload(`${BookingUrl.FormalitiesById}${id}/checkin/`, data);
  return result;
}

export const ReviewGiveFeedbackPostAPI = (data) => {
  const result = client.postWithUpload(BookingUrl.ReviewPost, data);
  return result;
}
export const getReviewDetailsAPI = (id) => {
  const data = client.getWithToken(`${BookingUrl.GetReviewDetail}${id}/`);
  return data
}
//Dashboard API
export const DashboardAPI = (start_date, end_date, property_uid, location, company_uid, property_uids, period) => {
  const result = client.getWithToken(`${DashboardUrl.HomeDashboard}?performers_start_date=${start_date}&performers_end_date=${end_date}&property_uid=${property_uid}&location=${location}&company_uid=${company_uid}&property_uids=${property_uids ? property_uids : ''}&period=${period ? period : ''}`)
  return result
}
export const ActiveGuestAPI = (property_uid = "a4c01ee5-175e-4606-91b6-1d1ebe3f86b5", company_uid = "60e2ed85-9afb-49f0-8e6a-4646fe51feb5") => {
  const result = client.getWithToken(`${DashboardUrl.ActiveGuest}?property_uid=${property_uid}&company_uid=${company_uid}`)
  return result
}
export const FeedbackInsightsAPI = (period = "12_months", property_uid = "4fccf40d-be82-49c1-98f8-2edbc1589c8c", company_uid = "41627cc1-2928-4078-a818-de758ca68424") => {
  const result = client.getWithToken(`${DashboardUrl.FeedbackInsights}?period=${period}&property_uid=${property_uid}&company_uid=${company_uid}`)
  return result
}
export const occupancyReportAPI = (view, date, dateData, filter) => {
  const result = client.getWithToken(view === "daily" ? `${DashboardUrl.occupancyReport}?view=${view}&date=${date}&property_uid=${filter?.property}&location=${filter?.location}&company_uid=${filter?.company}&page=${filter?.page}&limit=${filter?.limit}` : `${DashboardUrl.occupancyReport}?view=${view}&year=${dateData?.year}&month=${dateData?.month}&property_uid=${filter?.property}&location=${filter?.location}&company_uid=${filter?.company}&page=${filter?.page}&limit=${filter?.limit}`)
  return result
}

// export const occupancyRoomReportAPI = (view, date, dateData, filter) => {
//   const result = client.getWithToken(view === "daily" ? `${DashboardUrl.occupancyRoomReport}?view=${view}&date=${date}&property_uid=${filter?.property}&location=${filter?.location}&company_uid=${filter?.company}&page=${filter?.page}&page_size=${filter.page_size}` : `${DashboardUrl.occupancyRoomReport}?view=${view}&year=${dateData?.year}&month=${dateData?.month}&property_uid=${filter?.property}&location=${filter?.location}&company_uid=${filter?.company}&page=${filter?. Page}&page_size=${filter?.page_size}`)
//   return result
// }
export const occupancyRoomReportAPI = (view, date, dateData, filter) => {

  const result = client.getWithToken(
    view === "daily"
      ? `${DashboardUrl.occupancyRoomReport}?view=${view}&date=${date}&property_uid=${filter?.property}&location=${filter?.location}&company_uid=${filter?.company}&page=${filter?.page}&page_size=${filter?.page_size}`
      : `${DashboardUrl.occupancyRoomReport}?view=${view}&year=${dateData?.year}&month=${dateData?.month}&property_uid=${filter?.property}&location=${filter?.location}&company_uid=${filter?.company}&page=${filter?.page}&page_size=${filter?.page_size}`
  )

  return result
}

export const MonthlyReportAPI = (data,property_id,location,com_uid) => {
  const result = client.post(`${DashboardUrl.MonthlyReport}?view=${data.view}&date=${data.date?data.date:''}&property_uid=${property_id}&location=${location}&company_uid=${com_uid}`,data);
  return result;
}
export const SnapshotCheckInCheckoutAPI = (date, tab, currentPage, totalPages, property_uid, location, company_uid, sort) => {
  const result = client.getWithToken(`${DashboardUrl.Snapshot}?date=${date}&filter_tab=${tab}&page=${currentPage}&page_size=${totalPages}&property_uid=${property_uid}&location=${location}&company_uid=${company_uid}&sort_by=${sort}`);
  return result;
}

export const ReviewsListAPI = (data) => {
  const result = client.getWithToken(`${DashboardUrl.ReviewsList}?page=${data?.page}&limit=${data?.limit}&property_uid=${data?.property}&location=${data?.location}&company_uid=${data?.company}&show_all_brs=${data?.show_all_brs}&max_rating=${data?.max_rating}&min_rating=${data?.min_rating}&end_date=${data?.end_date}&start_date=${data?.start_date}`)
  return result
}
// Header API (Notification)

export const NotificationUnreadCountAPI = () => {
  const result = client.getWithToken(`${HeaderUrl.unReadCount}`)
  return result
}
export const NotificationUnreadListAPI = (listSetting) => {
  const result = client.getWithToken(`${HeaderUrl.notificationList}?page=${listSetting.page}&page_size=${listSetting.size}`)
  return result
}
export const NotificationReadAPI = (data) => {
  const result = client.post(HeaderUrl.markReadNotification, data);
  return result;
}
// Calendor API
/**
 * Get filter options for the Calendar page. Optional scoping params drive
 * the Company -> Location -> Property cascade.
 *
 * @param {{companyId?: number|string|null, location?: string|string[]|null}} [params]
 */
export const FilterOptionAPI = ({ companyId, location } = {}) => {
  const qs = new URLSearchParams();
  if (companyId !== undefined && companyId !== null && companyId !== '') {
    qs.append('company_id', String(companyId));
  }
  if (location) {
    const loc = Array.isArray(location) ? location.filter(Boolean).join(',') : location;
    if (loc) qs.append('location', loc);
  }
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  return client.getWithToken(`${CalendorUrl.FilterOption}${suffix}`);
};

/**
 * Fetch full calendar data.
 *
 * @param {Object} params
 * @param {string} params.startDate       - YYYY-MM-DD (required)
 * @param {string} params.endDate         - YYYY-MM-DD (required)
 * @param {number|string} params.companyId - required
 * @param {string} params.referenceDate   - YYYY-MM-DD (required)
 * @param {string[]} [params.locations]   - optional; empty/omitted = all
 * @param {string[]} [params.propertyIds] - optional UIDs; empty/omitted = all
 * @param {string} [params.viewType]      - 'daily' | 'monthly' (default 'daily')
 */
export const CalendorSnapFull = ({
  startDate,
  endDate,
  companyId,
  referenceDate,
  locations = [],
  propertyIds = [],
  viewType = 'daily',
} = {}) => {
  const qs = new URLSearchParams();
  qs.append('start_date', startDate);
  qs.append('end_date', endDate);
  qs.append('company_id', String(companyId));
  qs.append('reference_date', referenceDate);
  qs.append('view_type', viewType);
  if (locations && locations.length) qs.append('location', locations.join(','));
  if (propertyIds && propertyIds.length) qs.append('property_ids', propertyIds.join(','));
  return client.getWithToken(`${CalendorUrl.CalendorSnap}?${qs.toString()}`);
};
export const BookingOverviewAPI = (b_uid) => {
  const result = client.getWithToken(`${CalendorUrl.BookingOverview}${b_uid}`);
  return result;
}
export const BlockOverviewAPI = (b_uid) => {
  const result = client.getWithToken(`${CalendorUrl.BlockOverview}${b_uid}`);
  return result;
}
export const CheckRoomAvailabilityAPI = (id, data) => {
  const result = client.post(`${CalendorUrl.CheckRoomAvailability}${id}/`, data);
  return result;
}
export const SetRoomAvailabilityAPI = (id, data) => {
  const result = client.post(`${CalendorUrl.setRoomAvailability}${id}/`, data);
  return result;
}

// Company Reporting API
export const CompanyReportingAPI = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      params.append(key, value);
    }
  });
  const result = client.getWithToken(`${DashboardUrl.CompanyReporting}?${params.toString()}`);
  return result;
}

export const PermissionsCalAndDash=()=>{
  const result = client.getWithToken(DashboardUrl.DashboardCalendorPermission);
  return result;
}