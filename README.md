
Playwright Basic Tests
==

![Playwright](https://img.shields.io/badge/playwright-1.45-green)

Basic tests scripts with Playwright.
Crawl and list up url in the site.
Check each listed url to capture screenshot, find broken link.

Setup
--

Clone this repository.

```command
git clone https://github.com/synchrovision/playwright-basic-tests.git
```

Exec init process.

```command
npm run init
```

Edit urls.txt and put entry url to it.

```txt:urls.txt
https://example.com
↓
https://your.site
```

Start UI.

```command
npm run start
```

Do init>crawl.   
Then crawled urls are listed in urls.txt.


Usage
--

Start UI, and do any test you like.

```command
npm run start
```