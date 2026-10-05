import PropTypes from 'prop-types';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Bed, Building2, Users, Maximize2, ChevronRight, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Room details modal component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {() => void} props.onClose - Close callback
 * @param {Object} props.seletedRoomData - Selected room data
 * @param {Object} props.responseSearchData - Search response data
 * @param {Array} props.visibleAmenities - List of amenities with icons
 * @param {Array} props.amenities - All amenities list
 * @param {(roomData: Object) => void} props.onReserve - Reserve callback
 * @returns {JSX.Element | null}
 */
export function RoomOverviewModal({
  isOpen,
  onClose,
  block,
  roomName = 'Casa Mehlhor 2',
  bedName = 'Ultra Lux',
  propertyName = 'Casa Mehlhor 2 Ultra Lux',
  companyName = 'Schlumberger Asia Service Ltd',
  onMakeAvailable,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState(block?.reason || '');

  // if (!block) return null;

  const isMaintenanceBlock = block?.blockType === 'Maintenance';
  const title = isMaintenanceBlock 
    ? 'These nights are currently blocked for maintenance'
    : 'These nights are currently unavailable';

  // const startDate = new Date(block.startDate);
  // const endDate = new Date(block.endDate);
  // const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white  shadow-2xl z-50 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="page-title font-semibold text-gray-900">
                  Casa Mehlhor 2
                </h3>
                <p className="text-gray-600 mt-1">Ultra Lux</p>
              </div>
              <Dialog.Close asChild>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Image Gallery */}
            <div className="mb-6">
              <div className="relative  overflow-hidden">
                <Image
                  src="./images/icons/slide-image.jpg" // Dummy image path
                  alt="Room"
                  width={1000}
                  height={500}
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <button className="p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Room Specs */}
            <div className="mb-6">
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>Sleeps 4</span>
                </div>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5" />
                  <span>1 beds</span>
                </div>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-5 h-5" />
                  <span>500 sq ft</span>
                </div>
              </div>

              {/* Booking Status */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-orange-600 font-medium">ONLY 1 BED LEFT!</span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-gray-700 mb-3">
                  Our property stands out for its elegant design, exceptional hospitality, and attention to detail. From premium interiors to curated guest experiences, every element is designed to deliver comfort, style, and memorable stays.
                </p>
                <button className="read-more-btn-full flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                  Hide full description
                  <ChevronDown className="w-4 h-4 transition-transform rotate-180" />
                </button>
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Amenities */}
            <div>
              <p className="font-18 font-semibold text-gray-900 mb-4">Room amenities</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Image src="./images/icons/concierge.svg" alt="Concierge" width={24} height={24} />
                  </div>
                  <span className="text-gray-700">Concierge</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Image src="./images/icons/fitness_center.svg" alt="Fitness center" width={24} height={24} />
                  </div>
                  <span className="text-gray-700">Fitness center</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Image src="./images/icons/wifi.svg" alt="Free internet access" width={24} height={24} />
                  </div>
                  <span className="text-gray-700">Free internet access</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Image src="./images/icons/local_parking.svg" alt="Free parking" width={24} height={24} />
                  </div>
                  <span className="text-gray-700">Free parking</span>
                </div>
              </div>
              <button className="read-more-btn-full flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                Show all 11 amenities
                <ChevronDown className="w-4 h-4 transition-transform" />
              </button>
            </div>
          </div>

          {/* Footer */}
         
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

RoomOverviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  seletedRoomData: PropTypes.array,
  responseSearchData: PropTypes.object,
  visibleAmenities: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  ),
  amenities: PropTypes.array,
  onReserve: PropTypes.func,
};

RoomOverviewModal.defaultProps = {
  visibleAmenities: [],
  amenities: [],
};