/**
 * @file Main barrel export for custom calendar module
 */

// Components
export { CalendarGrid } from './components/CalendarGrid';
export { PropertyTreeSidebar } from './components/PropertyTreeSidebar';
export { TimelineGrid } from './components/TimelineGrid';
export { BookingCard } from './components/BookingCard';
export { MaintenanceBlock } from './components/MaintenanceBlock';
export { AvailabilityCell } from './components/AvailabilityCell';
export { DateHeader } from './components/DateHeader';

// Hooks
export { useCalendarLayout } from './hooks/useCalendarLayout';
export { useResourceTree } from './hooks/useResourceTree';

// Utilities
export * from './utils/dateUtils';
export * from './utils/gridPositioning';

// Page
export { CustomCalendarPage } from './CustomCalendarPage';
