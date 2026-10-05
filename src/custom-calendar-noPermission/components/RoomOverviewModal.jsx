import PropTypes from 'prop-types';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Bed, Building2, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { setItemLocalStorage } from '@/utils/browserStorage';

/**
 * Room overview modal component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {() => void} props.onClose - Close callback
 * @param {import('@/types').MaintenanceBlock | null} props.block - Maintenance block data
 * @param {string} [props.roomName='Room 3'] - Room name
 * @param {string} [props.bedName] - Bed name
 * @param {string} [props.propertyName='CasaMelhor Areca Exotica B1-1103'] - Property name
 * @param {string} [props.companyName='Schlumberger Asia Service Ltd'] - Company name
 * @param {(blockId: string) => void} [props.onMakeAvailable] - Make available callback
 * @returns {JSX.Element | null}
 */
export function RoomOverviewModal({
  isOpen,
  onClose,
  block,
  roomName = 'Room 3',
  bedName = 'Bed A',
  propertyName = 'CasaMelhor Areca Exotica B1-1103',
  companyName = 'Schlumberger Asia Service Ltd',
  onMakeAvailable,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState(block?.reason || '');
  const router = useRouter();

  // if (!block) return null;

  const isMaintenanceBlock = block?.blockType === 'Maintenance';
  const title = isMaintenanceBlock
    ? 'These nights are currently blocked for maintenance'
    : 'These nights are currently unavailable';

  // const startDate = new Date(block.startDate);
  // const endDate = new Date(block.endDate);
  // const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  console.log(block)

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl  shadow-2xl z-50" style={{ background: '#F2F2F2' }} >
          {/* Header */}
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="mb-0 page-title">
                Room Overview
              </h3>
              <Dialog.Close asChild>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Content */}
          <div className="p-3">
            {/* Status Message */}
            <div className="bg-white rounded-xl p-3 py-4 ">
              <p className="text-gray-700 font-medium  font-20 mb-2 ">{block?.block_type_display}</p>

              {/* Room Info */}
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <span className="font-medium font-18 mb-0">{block?.room?.room_name}</span>
                {block?.bed_name && (
                  <>
                    <Bed className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">{block?.bed_name}</span>
                  </>
                )}
                <span className="text-gray-400">|</span>
                <span className="text-sm text-gray-500 truncate">{block?.property?.property_name}</span>
              </div>

              {/* Company */}
              {block?.company?.company_name && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Building2 className="w-4 h-4" />
                  <span>{block?.company?.company_name}</span>
                </div>
              )}

              <hr></hr>


              <div className="flex items-center gap-2 text-sm text-gray-600 ">
                <span className="font-medium">
                  {block?.block_details?.display_date_range}
                  {/* {format(startDate, 'd')}-{format(endDate, 'd MMM, yyyy')} */}
                </span>
                <span className="text-gray-400">
                  {block?.block_details?.display_nights}
                  {/* {nights} {nights === 1 ? 'night' : 'nights'} */}
                </span>
              </div>
            </div>

            {/* Date Info */}


            {/* Private Note */}
            {/*             
            <div className="bg-white rounded-xl p-3  ">
              <div className="flex items-center  gap-2 mb-2">
                <p className="font-18 mb-0">Private note</p>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Image src="./images/icons/edit.svg" alt="Edit" width={22} height={22} />
                </button>
              </div>
              
              {isEditing ? (
                <div>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add a note about this block"
                    className="w-full px-3 py-2 text-sm border border-gray-200 "
                    rows={3}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 text-sm text-white bg-[var(--color-alice-brown)] rounded-lg hover:bg-[var(--color-alice-brown-dark)] transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-700">
                  {block.reason || 'No note added'}
                </p>
              )}
            </div> */}
          </div>

          {/* Footer Action */}
          <div className="px-6 py-4 border-t mt-3 border-gray-300">
            <button
              onClick={() => {
                const obj = {set_room_status:block?.set_room_status}
                setItemLocalStorage('blockInfo',JSON.stringify(obj))
                router.push(block?.room_status_page_redirect_url)
              }}
              className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Make These Nights Available Again
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

RoomOverviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  block: PropTypes.shape({
    id: PropTypes.string.isRequired,
    blockType: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    reason: PropTypes.string,
  }),
  roomName: PropTypes.string,
  bedName: PropTypes.string,
  propertyName: PropTypes.string,
  companyName: PropTypes.string,
  onMakeAvailable: PropTypes.func,
};