/**
 * Utility functions for organization ID resolution
 */

export const getOrganizationId = (userInfo) => {
  // Debug logging
  console.log('getOrganizationId called with:', userInfo);
  
  // Try different possible paths for organization ID
  const possiblePaths = [
    userInfo?.organisationId,
    userInfo?.user?.organisationId, 
    userInfo?.employee?.organisationId,
    userInfo?.organisation?.id,
    userInfo?.organization?.id,
    userInfo?.orgId,
    // Handle case where userInfo is the employee data itself
    userInfo?.data?.employee?.organisationId,
    // Handle nested employee structure
    userInfo?.employee?.organisation?.id,
    // Handle the specific structure shown in the error
    userInfo?.employee?.organisationId
  ];

  for (let i = 0; i < possiblePaths.length; i++) {
    const orgId = possiblePaths[i];
    console.log(`Checking path ${i}:`, orgId);
    if (orgId && !isNaN(orgId)) {
      console.log('Found organisationId:', Number(orgId));
      return Number(orgId);
    }
  }

  console.log('No organisationId found, returning null');
  return null;
};

export const getUserDisplayName = (user) => {
  if (user?.firstName && user?.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user?.name) {
    return user.name;
  }
  if (user?.email) {
    return user.email;
  }
  return 'Unknown User';
};

export const getStatusBadgeConfig = (status) => {
  const statusConfigs = {
    'CLAIM_SUBMITTED': { 
      bg: 'bg-blue-100', 
      text: 'text-blue-800', 
      label: 'Claim Submitted' 
    },
    'IN_REVIEW': { 
      bg: 'bg-yellow-100', 
      text: 'text-yellow-800', 
      label: 'In Review' 
    },
    'ASSIGNED': { 
      bg: 'bg-purple-100', 
      text: 'text-purple-800', 
      label: 'Assigned' 
    },
    'APPROVED': { 
      bg: 'bg-green-100', 
      text: 'text-green-800', 
      label: 'Approved' 
    },
    'REJECTED': { 
      bg: 'bg-red-100', 
      text: 'text-red-800', 
      label: 'Rejected' 
    }
  };
  
  return statusConfigs[status] || { 
    bg: 'bg-gray-100', 
    text: 'text-gray-800', 
    label: status 
  };
};