import { ReactNode } from 'react';

export interface SocialLink {
    name: string;
    url?: string;
    email?: string;
    icon: ReactNode;
    label: string;
    username: string;
    colorClass: string;
    actionText: string;
}

export interface NavItem {
    label: string;
    href: string;
}