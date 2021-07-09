# vite-plugin-auto-import-source

## example

```jsx
// jsx
<img src="../../assets/images/facebook.png" alt="" className="w-10 sx:w-5 h-auto" />

// output 
import assetsImagesFacebookPng from "../../assets/images/facebook.png"
<img src={assetsImagesFacebookPng} alt="" className="w-10 sx:w-5 h-auto" />

// normal

const obj = {
  src: "../../assets/images/facebook.png"
}

// output
import assetsImagesFacebookPng from "../../assets/images/facebook.png"

const obj = {
  src: assetsImagesFacebookPng
}
```
