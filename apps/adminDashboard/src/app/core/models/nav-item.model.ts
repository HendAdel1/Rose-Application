export type DashboardNavIcon =
  | 'overview'
  | 'categories'
  | 'occasions'
  | 'products';

export interface DashboardNavItem {
  labelKey: string;
  route: string[];
  icon: DashboardNavIcon;
  exact?: boolean;
}

export type BottomNavItem = DashboardNavItem;
