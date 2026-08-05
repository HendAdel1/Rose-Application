import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
  DestroyRef,
  effect,
} from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
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
  LucideX,
} from '@lucide/angular';
import { AuthSessionService } from '@org/auth-data-access';
import { CustomInput } from '@org/shared-components';
import { SharedI18nService } from '@org/shared-i18n';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, EMPTY } from 'rxjs';
import { WishlistService } from '../../features/wishlist/services/wishlist.service';
import { SearchDropdown } from './search-dropdown/search-dropdown';

interface NavItem {
  labelKey: string;
  route: string[];
  icon: 'home' | 'products' | 'categories' | 'occasions' | 'contact' | 'about';
  exact?: boolean;
}

@Component({
  imports: [
    CustomInput,
    FormsModule,
    SearchDropdown,
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
    LucideX,
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
  private readonly wishlistService = inject(WishlistService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  readonly layoutRoute = inject(ActivatedRoute);

  readonly logoPath = '/logos/rose-logo.png';
  readonly isAuthenticated = input(false);
  readonly currentUserName = input('Jonathan');
  readonly deliveryCity = input('Cairo');
  readonly searchSubmitted = output<string>();
  readonly searchTerm = signal('');
  readonly searchOpen = signal(false);
  readonly menuOpen = signal(false);
  readonly profileMenuOpen = signal(false);
  private readonly cartService = inject(CartService);
  readonly cartItemCount = toSignal(this.cartService.cartItemCount, { initialValue: 0 });
  readonly wishlistCount = this.wishlistService.count;
  readonly languageLabel = computed(() =>
    this.i18n.currentLanguage() === 'ar' ? 'English' : 'العربية',
  );

  private wishlistLoaded = false;

  readonly navItems: NavItem[] = [
    { labelKey: 'NAV.HOME', route: [''], icon: 'home', exact: true },
    { labelKey: 'NAV.PRODUCTS', route: ['products'], icon: 'products' },
    { labelKey: 'NAV.CATEGORIES', route: ['categories'], icon: 'categories' },
    { labelKey: 'NAV.OCCASIONS', route: ['occasions'], icon: 'occasions' },
    { labelKey: 'NAV.CONTACT', route: ['contact'], icon: 'contact' },
    { labelKey: 'NAV.ABOUT', route: ['about'], icon: 'about' },
  ];

  constructor() {
    effect(() => {
      if (!this.isAuthenticated()) {
        this.wishlistLoaded = false;
        this.wishlistService.setItems([]);
        return;
      }

      if (this.wishlistLoaded) {
        return;
      }

      this.wishlistLoaded = true;
      this.wishlistService
        .loadWishlist()
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError(() => EMPTY),
        )
        .subscribe();
    });
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.searchOpen.set(true);
  }

  onSearchFocus(): void {
    this.searchOpen.set(true);
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.searchOpen.set(true);
  }

  closeSearch(): void {
    this.searchOpen.set(false);
  }

  onSearchResultSelected(): void {
    this.searchTerm.set('');
    this.searchOpen.set(false);
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
