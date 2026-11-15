# JoyUI component catalog

Prefer **npm whole-library** install. All components ship in `@joyui/react` with built-in CSS.

```bash
pnpm add @joyui/react
```

```css
@import "tailwindcss";
@import "@joyui/react/styles.css";
```

```tsx
import { JoyUIProvider, Button, Input } from "@joyui/react";
```

Optional source copy (shadcn-style): `npx @joyui/cli add <name> --yes`.

| Name | Layer | Exports | Import |
|------|-------|---------|--------|
| `accordion` | base | `Accordion, AccordionItem` | `@joyui/react` |
| `admin-dashboard` | application | `AdminDashboard` | `@joyui/react` |
| `agent-log` | application | `ShimmerText, RowConnector, GuideBridge, WorkingRow, …` | `@joyui/react` |
| `agent-thinking` | application | `AgentThinking` | `@joyui/react` |
| `ai-kit` | application | `AiChat, AiComposer, AiConversation, AiMessage, …` | `@joyui/react` |
| `alert` | base | `Alert` | `@joyui/react` |
| `announcement` | base | `Announcement` | `@joyui/react` |
| `aspect-ratio` | base | `AspectRatio` | `@joyui/react` |
| `auth-card` | application | `AuthCard, AuthMediaCarousel` | `@joyui/react` |
| `avatar` | base | `Avatar` | `@joyui/react` |
| `avatar-group` | base | `AvatarGroup` | `@joyui/react` |
| `badge` | base | `Badge, Chip, StatusDot` | `@joyui/react` |
| `barcode` | base | `Barcode` | `@joyui/react` |
| `border-beam` | base | `BorderBeam` | `@joyui/react` |
| `brand` | foundation | `Logo, ProLogo, NavBrand` | `@joyui/react` |
| `breadcrumb` | base | `Breadcrumb, BreadcrumbItem` | `@joyui/react` |
| `button` | base | `ButtonGroup, ButtonGroupItem, Button, ButtonLink, …` | `@joyui/react` |
| `card` | base | `Card` | `@joyui/react` |
| `carousel` | base | `CarouselItem, Carousel` | `@joyui/react` |
| `carousel-coverflow` | base | `CarouselCoverflow` | `@joyui/react` |
| `carousel-fade` | base | `CarouselFade` | `@joyui/react` |
| `carousel-stacked` | base | `CarouselStacked` | `@joyui/react` |
| `carousel-thumbs` | base | `CarouselThumbs` | `@joyui/react` |
| `chat-message` | application | `ChatMessage` | `@joyui/react` |
| `checkbox` | base | `CheckboxCard, CheckboxGlyph, Checkbox` | `@joyui/react` |
| `citation` | base | `Citation` | `@joyui/react` |
| `collapsible` | base | `Collapsible` | `@joyui/react` |
| `color-picker` | base | `ColorPicker, ColorWell` | `@joyui/react` |
| `combobox` | base | `ComboBox, ComboBoxItem, ComboBoxSection` | `@joyui/react` |
| `command-palette` | base | `CommandPalette, CommandPaletteItem, CommandPaletteSection` | `@joyui/react` |
| `composer` | application | `ComposerLoader, ComposerAttachmentStrip, ComposerWithAttachments, ComposerPanel, …` | `@joyui/react/composer` |
| `context-menu` | base | `ContextMenuTrigger, ContextMenu, ContextMenuItem, ContextMenuSubmenu, …` | `@joyui/react` |
| `context-meter` | base | `ContextMeter` | `@joyui/react` |
| `copy-button` | base | `CopyButton` | `@joyui/react` |
| `copy-field` | base | `CopyField` | `@joyui/react` |
| `dashboard` | application | `ActivityRingsCard, AreaChartCard, BarListCard, ComboChartCard, …` | `@joyui/react` |
| `data-grid` | application | `DataGrid` | `@joyui/react` |
| `data-table` | application | `DataTable` | `@joyui/react` |
| `date-picker` | base | `DateCalendar, DateRangeCalendar, DatePicker, DateRangePicker, …` | `@joyui/react` |
| `description-list` | base | `DescriptionList, DescriptionTerm, DescriptionDetails, DescriptionItem` | `@joyui/react` |
| `direction` | foundation | `DirectionProvider` | `@joyui/react` |
| `divider` | base | `Divider` | `@joyui/react` |
| `dot-loader` | base | `DotLoader` | `@joyui/react` |
| `drawer` | base | `Drawer, DrawerBody, DrawerFooter, DrawerHeader, …` | `@joyui/react` |
| `drawer-form` | base | `DrawerForm, DrawerFormTrigger` | `@joyui/react` |
| `dropdown` | base | `Dropdown, DropdownTrigger, DropdownPopover, DropdownGroup, …` | `@joyui/react` |
| `empty-state` | base | `EmptyState` | `@joyui/react` |
| `empty-state-illustrated` | base | `EmptyStateIllustrated` | `@joyui/react` |
| `empty-state-search` | base | `EmptyStateSearch` | `@joyui/react` |
| `file-upload` | base | `FileUpload` | `@joyui/react` |
| `file-upload-gallery` | base | `FileUploadGallery` | `@joyui/react` |
| `form-field` | base | `FormField` | `@joyui/react` |
| `format` | lib | `dayjs, toDayjs, formatDate, fromNow, …` | `@joyui/react` |
| `hover-card` | base | `HoverCard` | `@joyui/react` |
| `hover-card-profile` | base | `HoverCardProfile` | `@joyui/react` |
| `i18n` | foundation | `JoyUIProvider` | `@joyui/react` |
| `icons` | foundation | `ChevronDownSmall, ChevronRightSmall, ChevronUpDownSmall, ChevronSortDown` | `@joyui/react` |
| `inline-edit` | base | `InlineEdit` | `@joyui/react` |
| `input` | base | `HintText, TextField, InputBase, Input, …` | `@joyui/react` |
| `input-otp` | base | `InputOtp` | `@joyui/react` |
| `kbd` | base | `Kbd` | `@joyui/react` |
| `list` | base | `List, ListItem` | `@joyui/react` |
| `magnetic` | base | `Magnetic` | `@joyui/react` |
| `marquee` | base | `Marquee` | `@joyui/react` |
| `marquee-3d` | base | `Marquee3d` | `@joyui/react` |
| `marquee-paired` | base | `MarqueePaired` | `@joyui/react` |
| `marquee-vertical` | base | `MarqueeVertical` | `@joyui/react` |
| `media-card` | base | `MediaCard` | `@joyui/react` |
| `media-card-hover` | base | `MediaCardHover` | `@joyui/react` |
| `media-card-landscape` | base | `MediaCardLandscape` | `@joyui/react` |
| `medical` | application | `ImportantAlertsCard, PatientInfoCard, WeekRangePill` | `@joyui/react` |
| `message-actions` | base | `MessageActions` | `@joyui/react` |
| `meter` | base | `Meter` | `@joyui/react` |
| `modal` | base | `ModalTrigger, Modal, ModalDialog, ModalHeader, …` | `@joyui/react` |
| `modal-sheet` | base | `ModalSheet, ModalSheetBody, ModalSheetFooter, ModalSheetHeader, …` | `@joyui/react` |
| `model-select` | base | `ModelSelect` | `@joyui/react` |
| `notification` | base | `Notification, NotificationViewport` | `@joyui/react` |
| `notification-bell` | application | `NotificationBell` | `@joyui/react` |
| `notification-center` | application | `NotificationCenter` | `@joyui/react` |
| `number-field` | base | `NumberField` | `@joyui/react` |
| `number-ticker` | base | `NumberTicker` | `@joyui/react` |
| `page-header` | base | `PageHeader` | `@joyui/react` |
| `pagination` | base | `Pagination` | `@joyui/react` |
| `password-strength` | base | `PasswordStrength` | `@joyui/react` |
| `popover` | base | `PopoverTrigger, Popover, PopoverHeader, PopoverFooter` | `@joyui/react` |
| `progress` | base | `ProgressTrack, ProgressBar, ProgressCircle` | `@joyui/react` |
| `prompt-suggestions` | base | `PromptSuggestions` | `@joyui/react` |
| `qr-code` | base | `QrCode` | `@joyui/react` |
| `radio` | base | `RadioCard, RadioDot, RadioGroup, Radio` | `@joyui/react` |
| `rating` | base | `Rating` | `@joyui/react` |
| `rating-emoji` | base | `RatingEmoji` | `@joyui/react` |
| `reasoning-block` | application | `ReasoningBlock` | `@joyui/react` |
| `relative-time` | base | `RelativeTime` | `@joyui/react` |
| `reveal` | base | `Reveal` | `@joyui/react` |
| `reveal-stagger` | base | `RevealStagger` | `@joyui/react` |
| `ripple` | base | `Ripple` | `@joyui/react` |
| `scroll-fade` | foundation | `ScrollFade` | `@joyui/react` |
| `scroll-progress` | base | `ScrollProgress` | `@joyui/react` |
| `search-field` | base | `SearchField` | `@joyui/react` |
| `section-header` | base | `SectionHeader` | `@joyui/react` |
| `segmented-control` | base | `SegmentedControl, SegmentedControlItem` | `@joyui/react` |
| `select` | base | `Select, SelectItem` | `@joyui/react` |
| `settings-modal` | application | `SettingsGeneral, SettingsModal, SettingsProfile, SettingsCard, …` | `@joyui/react` |
| `sidebar` | application | `Sidebar, SidebarHeader, SidebarContent, SidebarFooter, …` | `@joyui/react` |
| `skeleton` | base | `Skeleton, SkeletonText` | `@joyui/react` |
| `slide-to-confirm` | base | `SlideToConfirm` | `@joyui/react` |
| `slider` | base | `Slider, RangeSlider` | `@joyui/react` |
| `social-button` | base | `SocialButton, SOCIAL_PROVIDERS` | `@joyui/react` |
| `spinner` | base | `SpinnerGlyph, Spinner` | `@joyui/react` |
| `spotlight-card` | base | `SpotlightCard` | `@joyui/react` |
| `spotlight-card-border` | base | `SpotlightCardBorder` | `@joyui/react` |
| `spotlight-card-tilt` | base | `SpotlightCardTilt` | `@joyui/react` |
| `steps` | base | `Steps` | `@joyui/react` |
| `steps-wizard` | base | `StepsWizard` | `@joyui/react` |
| `switch` | base | `SwitchCard, SwitchTrack, Switch` | `@joyui/react` |
| `table` | base | `Table, TableHeader, TableColumn, TableBody, …` | `@joyui/react` |
| `tabs` | base | `PillTabList, PillTab, Tabs, TabList, …` | `@joyui/react` |
| `tag-group` | base | `TagGroup, Tag` | `@joyui/react` |
| `tag-input` | base | `TagInput` | `@joyui/react` |
| `template-copy` | foundation | `TemplateMenuProvider, TemplateCopyProvider` | `@joyui/react` |
| `text-link` | base | `TextLink` | `@joyui/react` |
| `text-shimmer` | base | `TextShimmer` | `@joyui/react` |
| `textarea` | base | `TextareaBase, Textarea` | `@joyui/react` |
| `theme-toggle` | application | `ThemeToggle` | `@joyui/react` |
| `thinking-orbs` | base | `ThinkingOrbs` | `@joyui/react` |
| `time-field` | base | `TimeField` | `@joyui/react` |
| `timeline` | base | `Timeline, TimelineItem` | `@joyui/react` |
| `timeline-horizontal` | base | `TimelineHorizontal, TimelineHorizontalItem` | `@joyui/react` |
| `toast` | base | `Toaster` | `@joyui/react` |
| `tool-call` | application | `ToolCall` | `@joyui/react` |
| `tooltip` | base | `Tooltip, TooltipTrigger` | `@joyui/react` |
| `tree-view` | base | `TreeView, TreeViewItem, TreeViewCollection` | `@joyui/react` |
| `tree-view-files` | base | `TreeViewFiles, TreeViewFilesFolder, TreeViewFilesFile` | `@joyui/react` |
| `typing-text` | base | `TypingText` | `@joyui/react` |
| `utils` | lib | `cn, cx` | `@joyui/react` |
| `voice-ring` | base | `VoiceRing` | `@joyui/react` |
| `web-search` | application | `WebSearch` | `@joyui/react` |
