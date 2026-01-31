## Pull request type:

<!-- Please check the type of change your PR introduces: -->

- [ ] Bugfix
- [x] Feature
- [ ] Code style update (formatting, renaming)
- [ ] Refactoring (no functional changes, no api changes)
- [ ] Build related changes
- [ ] Documentation content changes
- [ ] Other (please describe):

## Links (Jira/Trello/Notion ticket and other relevant links):

<!--- At a minimum include links to the Jira/Trello ticket --->

N/A

## Tasks:

- [ ] Tested responsive
- [ ] Tested on Safari, Chrome and Firefox

## What & Why:

Remove Spanish language support from the website. The site will be English-only.

**Changes:**

- **URLs:** Removed locale prefixes (`/en/`, `/es/`). Routes now work without a prefix (e.g. `/products` instead of `/en/products`).
- **Middleware:** Renamed `proxy.ts` to `middleware.ts`; set `localePrefix: 'never'` and `locales: ['en']`.
- **i18n:** Removed `ES` from the `Locale` enum and validation in `i18n.ts`.
- **LocaleWrapper:** Simplified to load English messages only.
- **Pathname checks:** Updated MainNav and AnnouncementToastHomepageWrapper to stop checking for `/en` or `/es` in the path (homepage is now `pathname === '/'` only).
- **Quiz:** Simplified `formatAgeText` to English-only; removed `useLocale` from QuizResultsHeader.
- **Translations:** Deleted `messages/es.json`. All copy continues to come from `messages/en.json`.

**Kept:** The `next-intl` library and `useTranslations` usage are unchanged so existing translation keys and structure remain in place.

## Other information:

<!-- Please add any relevant information that assists the code review. -->

N/A

## Preview:

N/A
