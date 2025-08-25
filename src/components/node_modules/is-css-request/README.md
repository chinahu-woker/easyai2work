# is-css-request

Utils for checking if a path or url points to a CSS request.

## Installation

```bash
npm i is-css-request

yarn add is-css-request

pnpm add is-css-request
```

## Usage

### API

```js
// esm + ts
import { isCSSRequest, isModuleCSSRequest } from 'is-css-request'
// or cjs
// const { isCSSRequest, isModuleCSSRequest } = require('is-css-request')

isCSSRequest('http://foo.bar/css-file.css') // => true
isCSSRequest('some/path/to/a/css-file.css') // => true
isCSSRequest('ice/a/preprocessor.scss') // => true
isCSSRequest('ice/a/x.fac') // => false

isModuleCSSRequest('some/path/to/a/css-file.css') // => false
isModuleCSSRequest('some/path/to/a/css-file.module.css') // => true
```

### Enum

```ts
import { PostCssDialectLang, PreprocessLang, PureCssLang } from 'is-css-request'

PureCssLang.css
PreprocessLang.less
PreprocessLang.sass
PreprocessLang.scss
PostCssDialectLang.sss
```

## License

[MIT](./LICENSE)

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b feature/my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/my-new-feature`)
5. Create new Pull Request
