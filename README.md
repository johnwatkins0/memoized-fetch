## memoizedFetch

Wrapper for `window.fetch` that caches JSON responses using memoization. The function accepts the same arguments as [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) with an added third argument to enable cache busting. If the third argument is omitted, subsequent calls with the same arguments will serve the JSON response from memory or sessionStorage.

### JSON only

`memoizedFetch` is intended for use with endpoints returning JSON data. Unlike `fetch`, it doesn't require calling the `Response.json()` method on the response. It handles that step interally.

### Install

// To-do

### Examples

```JavaScript

(async () => {
    let json;

    json = await memoizedFetch('http://mysite.com/data.json'. {}); // From web request.
    json = await memoizedFetch('http://mysite.com/data.json'. {}); // From cache.

    json = await memoizedFetch('http://mysite.com/data.json'. {}, 'some-string'); // From web request.
    json = await memoizedFetch('http://mysite.com/data.json'. {}, 'some-string'); // From cache.

    json = await memoizedFetch('http://mysite.com/data.json'. {}, 1); // From web request.
    json = await memoizedFetch('http://mysite.com/data.json'. {}, 1); // From cache.

    json = await memoizedFetch('http://mysite.com/data.json'. {}, null); // From web request.
    json = await memoizedFetch('http://mysite.com/data.json'. {}, null); // From cache.

    json = await memoizedFetch('http://mysite.com/data.json'. {}, 1); // From web request.
    json = await memoizedFetch('http://mysite.com/data.json'. {}, 1); // From cache.
})()
```

### Accepted memo types

The third argument passed to `memoizedFetch` must be a string, a number, a boolean, a date, null, or undefined. An error is thrown if a value of any other type is passed.
