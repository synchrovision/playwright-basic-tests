# Playwright Basic Tests

![Playwright](https://img.shields.io/badge/playwright-1.45-green)

Basic tests scripts with Playwright.
Crawl and list up url in the site.
Check each listed url to capture screenshot, find broken link.

## Setup

Clone this repository.

```command
git clone https://github.com/synchrovision/playwright-basic-tests.git
```

Exec init process.

```command
npm run init
```

Rename and edit urlset/default.txt and put entry url to it.

```txt:urlset/your.site.txt
https://example.com
↓
https://your.site
```

Start UI.

```command
npm run start
```

Then PlayWright will starts.  
Open `scripts.spec.js > clawl` at sidebar, and you'll find the name of file that you created in urlset directory.  
Click the run icon at the side of the name.

Then crawled urls are listed in the file you created.

```txt:urlset/your.site.txt
https://your.site
↓
https://your.site
https://your.site/page/
https://your.site/page/linked/
https://your.site/page/linked/from/
https://your.site/page/linked/from/top/
...
```

Now you ready to do tests.

## Usage

Start UI, and do any test you like.

```command
npm run start
```
