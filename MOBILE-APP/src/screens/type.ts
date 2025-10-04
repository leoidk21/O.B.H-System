export type RootStackParamList = {
  Loading: undefined;
  GetStarted: undefined;
  Wedding: undefined;
  Debut: undefined;
  Parties: undefined;

  // Auth routes
  SignIn: undefined;
  SignUp: undefined;
  ForgotPass: undefined;
  SendCode: undefined;
  ResetPass: undefined;

  ChooseEvent: undefined;
  ClientsName: undefined;
  EventDate: undefined;
  EventPrice: undefined;
  CompanyPolicy: undefined;

  Home: undefined;
  Event: undefined;
  Schedule: undefined;
  Guest: undefined;
  Budget: undefined;
  Checklist: undefined;
  Venue: undefined;
  Gallery: undefined;
  Account: undefined;
  ESignature: undefined;
  Notification: undefined;
  Payment: undefined;

  HomeIcon: undefined;
  EventIcon: undefined;
  ScheduleIcon: undefined;
  GuestIcon: undefined;
  BudgetIcon: undefined;
  VenueIcon: undefined;
  ChecklistIcon: undefined;

  EventSvg: undefined;
  ChecklistSvg: undefined;
  BudgetSvg: undefined;
  VenueSvg: undefined;
  GuestSvg: undefined;
  ScheduleSvg: undefined;
  GallerySvg: undefined;
  AccountSvg: undefined;
  
  useGuestManagement: undefined;
  NavigationSlider: undefined;
  MenuBar: undefined;
};

export type MenuItemType = {
  label: string;
  screen: keyof RootStackParamList;
  icon: React.FC<React.SVGProps<SVGSVGElement>>; 
};

export interface Guest {
  id: string;
  name: string;
  side: string;
  relationship: string;
  ageGroup: string;
  gender: string;
  status: string;
  role: string;
}

export interface CurrentGuest {
  name: string;
  side: string;
  relationship: string;
  ageGroup: string;
  gender: string;
  status: string;
}

export interface SideOption {
  value: string;
  label: string;
}

export type StatusType = 'Accepted' | 'Declined' | 'Pending';