"use client";
import { useState } from 'react';
import PropTypes from 'prop-types';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Key, Copy, Building2, Bed } from 'lucide-react';
import { STATUS_LABELS } from '@/types';
import { getStatusColorClasses, formatNights, getInitials } from '@/utils/formatters';
import { getBookingActions } from '@/utils/permissions';
import { format } from 'date-fns';
import { Card, Row, Col, Image } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

/**
 * Booking overview modal component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {() => void} props.onClose - Close callback
 * @param {import('@/types').Booking | null} props.booking - Booking data
 * @param {import('@/types').UserRole} [props.userRole='CASAMELHOR_ADMIN'] - User role
 * @param {(bookingId: string) => void} [props.onCheckIn] - Check-in callback
 * @param {(bookingId: string) => void} [props.onCheckOut] - Check-out callback
 * @param {(bookingId: string) => void} [props.onViewFullDetails] - View details callback
 * @param {(bookingId: string) => void} [props.onSendReviewReminder] - Send review reminder callback
 * @returns {JSX.Element | null}
 */
export function BookingOverviewModal({
  isOpen,
  onClose,
  booking,
  userRole = 'CASAMELHOR_ADMIN',
  onCheckIn,
  onCheckOut,
  onViewFullDetails,
  onSendReviewReminder,
  permissions = {},
}) {
  const [privateNote, setPrivateNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const router = useRouter();

  if (!booking) return null;
  // Fallback for missing traveler
  const traveler = booking.traveler || { name: 'Guest', photo: '' };

  let statusColors = getStatusColorClasses(booking.status);
  if (!statusColors) {
    statusColors = { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
  }
  const actions = getBookingActions(booking, userRole);
  const isCompleted = booking.status === 'CHECKED_OUT';

  const handleCopyBookingId = () => {
    navigator.clipboard.writeText(booking.bookingNumber);
  };

  const handleSaveNote = async () => {
    setIsSavingNote(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSavingNote(false);
  };

  console.log(booking)

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl  z-50 max-h-[90vh] overflow-hidden" style={{ background: '#F2F2F2', border: 'border-bottom: 1px solid #4635277A' }}>
          {/* Header */}
          <div className="p-3 border-b border-gray-400" >
            <div className="flex items-center justify-between">
              <h3 className="mb-0 page-title">
                Booking Overview
              </h3>
              <Dialog.Close asChild>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 overflow-y-auto max-h-[calc(90vh-200px)]">

            <Card className="review-card-top  mb-0">
              <Card.Body className="p-3">
                <Row className="align-items-center">
                  <Col xs={12}>
                    <span className={`inline-flex items-center px-2 py-1  text-xs font-medium uppercase tracking-wide ${statusColors.bg} ${statusColors.text} border ${statusColors.border}`}>
                      {STATUS_LABELS[booking?.booking_status]} Check-in
                    </span>
                    <div className='d-flex align-items-center gap-2 mb-1 mt-1'>
                      <p className="room-title  mb-0 fw-medium ">{booking?.room?.room_name} <span className="text-muted"> | </span>
                        {booking?.room?.bed_name && (
                          <>
                            <Bed className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-500">{booking?.room?.bed_name}</span>
                          </>
                        )}
                      </p>
                      <span className="text-muted"> | </span>  <p className="room-title  mb-0 fw-medium ">{booking?.property?.property_name}</p>

                    </div>
                  </Col>

                  {booking?.company?.company_name && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Building2 className="w-4 h-4" />
                      <span>{booking?.company?.company_name}</span>
                    </div>
                  )}

                  <Col xs={12} className=" d-flex align-items-center justify-between mt-2">

                    <div>
                      <p className="reviewer-name font-18 mb-0 fw-medium">  {permissions.viewGuestDetails ? (booking?.guest?.full_name || booking.guest_display_name || 'Guest Name') : 'Guest'}</p>
                      {permissions.viewGuestDetails && (
                        <p className='mb-0' onClick={()=>router.push(booking.links.guest_profile_url)} style={{cursor:'pointer'}}>Show profile</p>
                      )}
                    </div>
                    {permissions.viewGuestDetails && booking?.guest?.profile_image_url ? (
                      <img
                        src={`${booking.guest.profile_image_url}`}
                        alt={booking?.guest?.full_name}
                        className="w-12 h-12  object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12  bg-[#8B7355] text-white flex items-center justify-center font-medium text-base">
                        {/* {getInitials(booking.guest_name || booking.guest_display_name)} */}
                      </div>
                    )}
                  </Col>
                </Row>

                <Row className="review-meta mt-3 g-3">
                  <Col xs={2} className="border-end mt-0">
                    <p className="meta-title mb-0 fw-medium d-flex">1 Room</p>
                  </Col>
                  <Col xs={5} className="border-end mt-0">
                    <p className="meta-title mb-0 fw-medium d-flex align-center font-18">{booking?.booking_details?.display_date_range} <br /><span className="text-muted small">{booking?.booking_details?.display_nights}</span></p>
                  </Col>
                  <Col xs={5} className='mt-0' >
                    <p className="meta-title mb-0 fw-medium d-flex align-center font-18">Booking Id <br /><span className="id-no fw-bold">{booking?.booking_number}</span></p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            {/* Status Badge and Room Info */}




            {/* <Card className="review-card-top  mb-3">
              <Card.Body className="p-3">
          
            
            <div className="mb-0">
              <div className="flex items-center justify-between mb-2">
                <p className="mb-0 font-18">Private note</p>
              </div>
              <p className="text-xs text-gray-500 mb-2">This is not shown to guests.</p>
              {booking.privateNote ? (
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {booking.privateNote}
                </p>
              ) : (
                <div className="relative">
                  <textarea
                    value={privateNote}
                    onChange={(e) => setPrivateNote(e.target.value)}
                    placeholder="Add your message here"
                    className="w-full px-3 py-2 text-sm border border-gray-200  resize-none"
                    rows={3}
                  />
                  <button
                    onClick={handleSaveNote}
                    disabled={!privateNote.trim() || isSavingNote}
                    className="mt-2 px-4 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSavingNote ? 'Saving...' : 'Save Note'}
                  </button>
                </div>
              )}
            </div>
            </Card.Body>
            </Card> */}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">

            {booking?.available_action?.can_check_in && permissions.checkIn && (
              <button
                onClick={() => onCheckIn?.(booking.booking_uid)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-[var(--color-alice-brown)] rounded-lg hover:bg-[var(--color-alice-brown-dark)] transition-colors complete-form-btn"
              >
                <Key className="w-4 h-4" />
                Check-in
              </button>
            )}
            {booking?.available_action?.can_check_out && permissions.checkOut && (
              <button
                onClick={() => onCheckOut?.(booking.booking_uid)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-[var(--color-alice-brown)] rounded-lg hover:bg-[var(--color-alice-brown-dark)] transition-colors"
              >
                <Key className="w-4 h-4" />
                Checkout
              </button>
            )}
            {booking?.available_action?.can_send_review_reminder && (
              <button
                onClick={() => onSendReviewReminder?.(booking.booking_uid)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Send Review Reminder
              </button>
            )}


            <button
              // onClick={() => onViewFullDetails?.(booking.booking_uid)}
              onClick={()=>router.push(booking.links.booking_details_url)}
              className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Full Booking Details
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

BookingOverviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  booking: PropTypes.shape({
    id: PropTypes.string.isRequired,
    bookingNumber: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    roomName: PropTypes.string.isRequired,
    bedName: PropTypes.string,
    propertyName: PropTypes.string.isRequired,
    companyName: PropTypes.string,
    checkInDate: PropTypes.string.isRequired,
    checkOutDate: PropTypes.string.isRequired,
    nights: PropTypes.number.isRequired,
    privateNote: PropTypes.string,
    traveler: PropTypes.shape({
      name: PropTypes.string.isRequired,
      photo: PropTypes.string,
    }).isRequired,
  }),
  userRole: PropTypes.string,
  onCheckIn: PropTypes.func,
  onCheckOut: PropTypes.func,
  onViewFullDetails: PropTypes.func,
  onSendReviewReminder: PropTypes.func,
  permissions: PropTypes.object,
};