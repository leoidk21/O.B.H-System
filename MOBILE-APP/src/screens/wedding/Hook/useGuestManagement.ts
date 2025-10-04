import { useState, useEffect } from 'react';
import { Guest, CurrentGuest, StatusType } from '../../type';

export const useGuestManagement = () => {
  const [currentGuest, setCurrentGuest] = useState<CurrentGuest>({
    name: '',
    side: '',
    relationship: '',
    ageGroup: '',
    gender: '',
    status: '',
  });

  // Inside useGuestManagement
  const resetCurrentGuest = () => {
    setCurrentGuest({
      name: '',
      side: '',
      relationship: '',
      ageGroup: '',
      gender: '',
      status: '',
    });
  };

  const [invitedGuests, setInvitedGuests] = useState<Guest[]>([]);

  // Check if guest has complete information
  const isGuestComplete = (guest: Guest): boolean => {
    return (
      guest.name.trim() !== '' &&
      guest.side !== '' &&
      guest.relationship !== '' &&
      guest.side !== '' &&
      guest.status !== '' &&
      guest.status !== 'Pending'
    );
  };

  // Get completion level (0 to 1)
  const getGuestCompletionLevel  = (guest: Guest): number => {
    let completeFields = 0;
    const totalFields = 4;

    if (guest.name.trim() !== '') completeFields++;
    if (guest.side !== '') completeFields++;
    if (guest.relationship !== '') completeFields++;  
    if (guest.status !== '') completeFields++;

    return completeFields / totalFields;
  };

  // Save side and relationship choices
  const saveSideRelationship = (
    checked: string,
    selectedRelationship: number,
    selectedAge: number,
    selectedValue: string,
    sideOptions: Array<{ value: string; label: string }>
  ) => {
    const selectedSide = sideOptions.find(option => option.value === checked)?.label || '';
    const relationshipOptions = ["Family", "Friend", "Colleague", "VIP / Sponsor", "Other"];
    const ageOptions = ["Adult", "Teen", "Child"];
    
    const selectedRelationshipText = relationshipOptions[selectedRelationship] || '';
    const selectedAgeText = ageOptions[selectedAge] || '';
    
    setCurrentGuest({
      ...currentGuest,
      side: selectedSide,
      relationship: selectedRelationshipText,
      ageGroup: selectedAgeText,
      gender: selectedValue
    });
    
    return { selectedSide, selectedRelationship: selectedRelationshipText, selectedAge: selectedAgeText };
  };

  // Save RSVP status
  const saveRSVPStatus = (selectedRSVP: number) => {
    const statusOptions: StatusType[] = ["Accepted", "Declined", "Pending"];
    const selectedStatus = statusOptions[selectedRSVP] || 'Pending';
    
    setCurrentGuest({
      ...currentGuest,
      status: selectedStatus
    });
    
    return selectedStatus;
  };

  // Add guest to the list
  const addGuest = () => {
    if (currentGuest.name.trim()) {
      const newGuest: Guest = {
        id: Date.now().toString(),
        name: currentGuest.name,
        side: currentGuest.side,
        relationship: currentGuest.relationship,
        ageGroup: currentGuest.ageGroup,
        gender: currentGuest.gender,
        status: currentGuest.status,
        role: `${currentGuest.side} • ${currentGuest.relationship}`
      };
      
      setInvitedGuests(prevGuests => [...prevGuests, newGuest]);
      
      // Reset current guest
      setCurrentGuest({
        name: '',
        side: '',
        relationship: '',
        ageGroup: '',
        gender: '',
        status: 'Pending'
      });
      
      return newGuest;
    }
    return null;
  };

  // Update guest name
  const updateGuestName = (name: string) => {
    setCurrentGuest(prev => ({ ...prev, name }));
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      Accepted: '#4CAF50',
      Declined: '#F44336',
      Pending: '#FF9800',
    };
    return statusColors[status] || '#666';
  };

  // Remove guest from list
  const removeGuest = (guestId: string) => {
    setInvitedGuests(prevGuests => prevGuests.filter(guest => guest.id !== guestId));
  };

  // Update guest status
  const updateGuestStatus = (guestId: string, newStatus: StatusType) => {
    setInvitedGuests(prevGuests =>
      prevGuests.map(guest =>
        guest.id === guestId ? { ...guest, status: newStatus } : guest
      )
    );
  };

  // search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);

  // Filter guests based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredGuests(invitedGuests);
    } else {
      const filtered = invitedGuests.filter(guest =>
        guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.side.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.relationship.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredGuests(filtered);
    }
  }, [searchQuery, invitedGuests]);

  return {
    currentGuest,
    invitedGuests,
    setInvitedGuests,
    isGuestComplete,
    getGuestCompletionLevel,
    saveSideRelationship,
    saveRSVPStatus,
    addGuest,
    updateGuestName,
    getStatusColor,
    removeGuest,
    updateGuestStatus,
    setCurrentGuest,
    resetCurrentGuest,
  };
};