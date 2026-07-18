import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartService } from '../../core/services/cart.service';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
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
  LucideMenu,
  LucidePartyPopper,
  LucideSearch,
  LucideSettings,
  LucideShoppingCart,
  LucideLogOut,
  LucideUser,
} from '@lucide/angular';
import { AuthSessionService } from '@org/auth-data-access';
import { CustomInput } from '@org/shared-components';
import { SharedI18nService } from '@org/shared-i18n';
import { TranslatePipe } from '@ngx-translate/core';

interface NavItem {
  labelKey: string;
  route: string[];
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
    LucideMenu,
    LucidePartyPopper,
    LucideSearch,
    LucideSettings,
    LucideShoppingCart,
    LucideLogOut,
    LucideUser,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
  ],
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly i18n = inject(SharedI18nService);
  private readonly authSession = inject(AuthSessionService);
  private readonly router = inject(Router);
  readonly layoutRoute = inject(ActivatedRoute);

  readonly logoPath = '/logos/rose-logo.png';
  readonly isAuthenticated = input(false);
  readonly currentUserName = input('Jonathan');
  readonly deliveryCity = input('Cairo');
  readonly searchSubmitted = output<string>();
  readonly searchTerm = signal('');
  readonly menuOpen = signal(false);
  readonly profileMenuOpen = signal(false);
  
  private readonly cartService = inject(CartService);
  readonly cartItemCount = toSignal(this.cartService.cartItemCount, { initialValue: 0 });

  readonly languageLabel = computed(() =>
    this.i18n.currentLanguage() === 'ar' ? 'English' : 'العربية',
  );

  readonly navItems: NavItem[] = [
    { labelKey: 'NAV.HOME', route: [''], icon: 'home', exact: true },
    { labelKey: 'NAV.PRODUCTS', route: ['products'], icon: 'products' },
    { labelKey: 'NAV.CATEGORIES', route: ['categories'], icon: 'categories' },
    { labelKey: 'NAV.OCCASIONS', route: ['occasions'], icon: 'occasions' },
    { labelKey: 'NAV.CONTACT', route: ['contact'], icon: 'contact' },
    { labelKey: 'NAV.ABOUT', route: ['about'], icon: 'about' },
  ];

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  onSearchSubmit(event: Event): void {
    event.preventDefault();
    const term = this.searchTerm().trim();

    if (term) {
      this.searchSubmitted.emit(term);
    }
  }

  onLanguageToggle(): void {
    this.i18n.toggleLanguage();
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen.update((open) => !open);
  }

  logout(): void {
    this.authSession.logout();
    this.profileMenuOpen.set(false);
    void this.router.navigate(['/roseApp']);
  }
}
