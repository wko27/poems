import React from 'react';

import Tooltip from '@mui/material/Tooltip';

/**
 * Surrounds the children elements with a tooltip if the condition is satisfied
 *
 * Example usage:
 * <ConditionalTooltip
 *   condition={isError}
 *   tooltipTitle={"An error has occurred"}
 * >
 *   {isError ? "Error" : "Success"}
 * </ConditionalTooltip>
 * 
 * See also:
 * ConditionalBorder
 */
export const ConditionalTooltip = (props) => {
  const {
    condition,
    children,
    tooltipTitle,
  } = props;

  if (!condition) {
    return children;
  }

  return (
    <Tooltip title={tooltipTitle}>
      {children}
    </Tooltip>
  );
};

export default ConditionalTooltip;
