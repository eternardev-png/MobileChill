import WebApp from '@twa-dev/sdk';

/**
 * Telegram Mini App Integration Module
 * Provides Telegram WebApp API functionality with fallbacks for non-Telegram environments
 */

export interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
}

class TelegramService {
    private isAvailable: boolean;

    constructor() {
        this.isAvailable = typeof window !== 'undefined' && !!WebApp;
        console.log('[Telegram] Service initialized. Version check enabled: 6.9+');
        if (this.isAvailable) {
            WebApp.ready();
            WebApp.expand();
            // Disable vertical swipes to prevent Telegram from closing the app
            WebApp.disableVerticalSwipes();
        }
    }

    /**
     * Check if running inside Telegram
     */
    isInTelegram(): boolean {
        return this.isAvailable && WebApp.initDataUnsafe?.user !== undefined;
    }

    /**
     * Get Telegram user info
     */
    getUser(): TelegramUser | null {
        if (!this.isInTelegram()) return null;
        return WebApp.initDataUnsafe.user as TelegramUser;
    }

    /**
     * Get user ID (useful as unique identifier)
     */
    getUserId(): number | null {
        const user = this.getUser();
        return user ? user.id : null;
    }

    /**
     * Get current theme (light/dark)
     */
    getTheme(): 'light' | 'dark' {
        if (!this.isAvailable) return 'dark';
        return WebApp.colorScheme || 'dark';
    }

    /**
     * Get theme colors from Telegram
     */
    getThemeParams() {
        if (!this.isAvailable) {
            return {
                bg_color: '#111111',
                text_color: '#ffffff',
                hint_color: '#888888',
                link_color: '#4ade80',
                button_color: '#4ade80',
                button_text_color: '#000000',
            };
        }
        return WebApp.themeParams;
    }

    /**
     * Haptic feedback for user interactions
     */
    haptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') {
        if (!this.isAvailable) return;

        switch (type) {
            case 'success':
            case 'warning':
            case 'error':
                WebApp.HapticFeedback.notificationOccurred(type as 'success' | 'warning' | 'error');
                break;
            default:
                WebApp.HapticFeedback.impactOccurred(type as 'light' | 'medium' | 'heavy');
        }
    }

    /**
     * Show main button at bottom of app
     */
    showMainButton(text: string, onClick: () => void) {
        if (!this.isAvailable) return;
        WebApp.MainButton.setText(text);
        WebApp.MainButton.show();
        WebApp.MainButton.onClick(onClick);
    }

    /**
     * Hide main button
     */
    hideMainButton() {
        if (!this.isAvailable) return;
        WebApp.MainButton.hide();
    }

    /**
     * Show back button
     */
    showBackButton(onClick: () => void) {
        if (!this.isAvailable) return;
        WebApp.BackButton.show();
        WebApp.BackButton.onClick(onClick);
    }

    /**
     * Hide back button
     */
    hideBackButton() {
        if (!this.isAvailable) return;
        WebApp.BackButton.hide();
    }

    /**
     * Helper to check if CloudStorage is truly available
     */
    private isCloudStorageSupported(): boolean {
        // CloudStorage is only available from version 6.9
        return this.isAvailable &&
            !!WebApp.CloudStorage &&
            WebApp.isVersionAtLeast('6.9');
    }

    /**
     * Cloud Storage - Save data
     */
    async cloudSave(key: string, value: string): Promise<void> {
        // If cloud unavailable or old version -> use LocalStorage
        if (!this.isCloudStorageSupported()) {
            try {
                localStorage.setItem(key, value);
            } catch (e) {
                console.warn('LocalStorage save failed:', e);
            }
            return;
        }

        return new Promise((resolve) => {
            try {
                WebApp.CloudStorage.setItem(key, value, (error, result) => {
                    if (error) {
                        console.warn('Cloud save error, falling back to local:', error);
                        localStorage.setItem(key, value);
                    }
                    resolve();
                });
            } catch (e) {
                console.error('Cloud save crashed:', e);
                localStorage.setItem(key, value);
                resolve();
            }
        });
    }

    /**
     * Cloud Storage - Load data
     */
    async cloudLoad(key: string): Promise<string | null> {
        if (!this.isCloudStorageSupported()) {
            return localStorage.getItem(key);
        }

        return new Promise((resolve) => {
            try {
                WebApp.CloudStorage.getItem(key, (error, value) => {
                    if (error) {
                        console.warn('Cloud load error:', error);
                        resolve(localStorage.getItem(key));
                    } else {
                        // If cloud empty, try local just in case
                        resolve(value || localStorage.getItem(key));
                    }
                });
            } catch (e) {
                console.error('Cloud load crashed:', e);
                resolve(localStorage.getItem(key));
            }
        });
    }

    /**
     * Cloud Storage - Remove data
     */
    async cloudRemove(key: string): Promise<void> {
        if (!this.isCloudStorageSupported()) {
            localStorage.removeItem(key);
            return;
        }

        return new Promise((resolve) => {
            try {
                WebApp.CloudStorage.removeItem(key, (error) => {
                    if (error) {
                        console.warn('Cloud remove error:', error);
                        localStorage.removeItem(key);
                    }
                    resolve();
                });
            } catch (e) {
                console.error('Cloud remove crashed:', e);
                localStorage.removeItem(key);
                resolve();
            }
        });
    }

    /**
     * Close the Mini App
     */
    close() {
        if (!this.isAvailable) return;
        WebApp.close();
    }

    /**
     * Open a link in external browser
     */
    openLink(url: string) {
        if (!this.isAvailable) {
            window.open(url, '_blank');
            return;
        }
        WebApp.openLink(url);
    }

    /**
     * Open Telegram link (user, channel, etc.)
     */
    openTelegramLink(url: string) {
        if (!this.isAvailable) {
            window.open(url, '_blank');
            return;
        }
        WebApp.openTelegramLink(url);
    }

    /**
     * Get viewport height (useful for layout)
     */
    getViewportHeight(): number {
        if (!this.isAvailable) return window.innerHeight;
        return WebApp.viewportHeight;
    }

    /**
     * Check if app is expanded
     */
    isExpanded(): boolean {
        if (!this.isAvailable) return true;
        return WebApp.isExpanded;
    }
}

// Export singleton instance
export const telegram = new TelegramService();
