import * as React from "react";

/**
 * Props for the SuccessState component.
 * @param onReset - Callback function to reset the form.
 */
export interface SuccessStateProps {
    onReset: () => void;
}

/**
 * Colors used in the contact form.
 * @param label - Label text color.
 * @param optional - Optional text color.
 * @param text - Text color.
 * @param placeholder - Placeholder text color.
 * @param border - Border color.
 * @param borderFocus - Border color when focused.
 * @param pillBg - Background color of the pill.
 * @param pillText - Text color of the pill.
 * @param pillBorder - Border color of the pill.
 * @param subtext - Subtext color.
 */
export interface FormColors {
    label:       string;
    optional:    string;
    text:        string;
    placeholder: string;
    border:      string;
    borderFocus: string;
    pillBg:      string;
    pillText:    string;
    pillBorder:  string;
    subtext:     string;
}

/**
 * Props for the FieldWrap component.
 * @param label - Label text.
 * @param required - Whether the field is required.
 * @param optional - Whether the field is optional.
 * @param children - Child elements.
 * @param error - Error message to display.
 */
export interface FieldWrapProps {
    label:    string;
    required?: boolean;
    optional?: boolean;
    children:  React.ReactNode;
    error?:    string;
}

/**
 * Props for the ContactForm component.
 * @param onSuccess - Callback function to be called on successful form submission.
 * @param dark - Whether the form should be displayed in dark mode.
 */
export interface ContactFormProps {
    onSuccess: () => void;
    dark?:     boolean;
}

/**
 * Represents a service item with various properties.
 * @param title - The title of the service.
 * @param description - Optional description of the service.
 * @param price - Optional price of the service.
 * @param duration - Optional duration of the service.
 * @param bullets - Optional list of bullet points.
 * @param tag - Optional tag associated with the service.
 * @param href - Optional link to the service.
 */
export interface ServiceItem {
    title: string;
    description?: string;
    price?: string;
    duration?: string;
    bullets?: string[];
    tag?: string;
    href?: string;
}

/**
 * Props for the ContentPanel component.
 * @param service - The service item to display.
 * @param index - The index of the service item.
 * @param total - The total number of service items.
 * @param isActive - Whether the service item is currently active.
 * @param isPrev - Whether the service item is the previous one.
 */
export interface ContentPanelProps {
    service:  ServiceItem;
    index:    number;
    total:    number;
    isActive: boolean;
    isPrev:   boolean;
}