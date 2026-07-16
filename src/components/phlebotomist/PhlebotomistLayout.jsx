/**
 * Legacy layout — App.jsx uses RoleLayout for /phlebotomist.
 * Kept in sync with mobile-first RoleLayout field portal pattern.
 */
import RoleLayout from '../role/RoleLayout';

export default function PhlebotomistLayout() {
  return <RoleLayout role="phlebotomist" />;
}
