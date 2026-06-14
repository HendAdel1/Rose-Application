import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideBell,
  LucideChevronDown,
  LucideClipboardList,
  LucideGift,
  LucideHeadphones,
  LucideHeart,
  LucideHome,
  LucideInfo,
  LucideMapPin,
  LucidePartyPopper,
  LucideSearch,
  LucideShoppingCart,
  LucideUser,
} from '@lucide/angular';
import { CustomInput } from '@org/shared-components';

interface NavItem {
  label: string;
  route: string;
  icon: 'home' | 'products' | 'categories' | 'occasions' | 'contact' | 'about';
  exact?: boolean;
}

@Component({
  imports: [
    CustomInput,
    LucideBell,
    LucideChevronDown,
    LucideClipboardList,
    LucideGift,
    LucideHeadphones,
    LucideHeart,
    LucideHome,
    LucideInfo,
    LucideMapPin,
    LucidePartyPopper,
    LucideSearch,
    LucideShoppingCart,
    LucideUser,
    RouterLink,
    RouterLinkActive,
  ],
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  readonly logoPath = '/logos/rose-logo.png';
  readonly searchPlaceholder = 'What awesome gift are you looking for?';
  readonly isAuthenticated = input(false);
  readonly currentUserName = input('Jonathan');
  readonly deliveryCity = input('Cairo');

  readonly navItems: NavItem[] = [
    { label: 'Home', route: './', icon: 'home', exact: true },
    { label: 'Products', route: './products', icon: 'products' },
    { label: 'Categories', route: './categories', icon: 'categories' },
    { label: 'Occasions', route: './occasions', icon: 'occasions' },
    { label: 'Contact', route: './contact', icon: 'contact' },
    { label: 'About', route: './about', icon: 'about' },
  ];
}
