# Caps Collection

Simple dynamic or static website allowing to view or share [my personal caps collection](https://michaelscaps.com).

## Dynamic vs static website

This app can either be run dynamically or generate a static website.
- Use `npm start` to run the dynamic website
- Use `npm run build` to generate the static website under the `build` directory

## How to add caps

Caps are ordered by countries and breweries. To add some, simply create the necessary folders under the `images` directory. Note that you must use a two-level directory structure (country + brewery).

Pictures should be converted to a 300px wide JPG, and preferably optimized to improve performance. They're lazy loaded in the browser. They can be converted with [ImageMagick](https://imagemagick.org/script/mogrify.php):

```
# Convert to jpg
find . -name '*.png' -print0 | xargs -0 mogrify -format jpg && find . -name '*.png' -print0 | xargs -0 rm

# Resize to a 300px wide image
find . -name '*.jpg' -print0 | xargs -0 mogrify -resize 300
```
