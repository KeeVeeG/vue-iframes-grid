## Installation
```sh
$ npm install --save vue-iframes-grid
```

## Usage
Just import:

```javascript
import IframesGrid from "vue-iframes-grid"
Vue.use(IframesGrid)
```

And use:

```javascript
<iframes-grid :iframes="['https://any.url/', ...]" />
```

## Props
| Name  | Type | Required | Default | Ex.
| ------------- | ------------- | ------------- | ------------- | ------------- |
| :iframes  | Array  | True | | `['https://any.url/','https://any.url/','https://any.url/']` |
| :ratio  | String | False | "16:9" | `"4:3"` |


## Screenshot
![image](https://user-images.githubusercontent.com/35378637/121425208-97d6b580-c98b-11eb-88f0-084db21d41b0.png)
