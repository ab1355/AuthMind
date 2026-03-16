import { AlignmentCheckParams, AlignmentStatus } from './types';

/**
 * Performs a Three-Way Alignment Check.
 * 1. Functional: Did the agent achieve the functional goal?
 * 2. Alignment: Did it follow the user's specific instructions/preferences?
 * 3. Constitutional: Did it violate core safety/ethical bounds?
 * 
 * Returns: CERTIFIED_SUCCESS | VIOLATED_REFUND | AWAITING_VERIFICATION
 */
export function performThreeWayCheck(params: AlignmentCheckParams): AlignmentStatus {
  // Constitutional violations are absolute failures
  if (!params.constitutionalSuccess) {
    return 'VIOLATED_REFUND';
  }
  
  // If both functional and alignment checks pass, it's a certified success
  if (params.functionalSuccess && params.alignmentSuccess) {
    return 'CERTIFIED_SUCCESS';
  }

  // If functional passed but alignment failed (or vice versa), it requires human review
  return 'AWAITING_VERIFICATION';
}
